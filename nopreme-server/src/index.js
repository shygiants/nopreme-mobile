import path from "path";

import dotenv from "dotenv";
const result = dotenv.config();
if (result.error) throw result.error;

import express from "express";
import morgan from "morgan";
import Multer from "multer";
import mongoose from "mongoose";
import jwtSign from "jsonwebtoken";
import jwt from "express-jwt";
import { graphqlHTTP } from "express-graphql";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";

import { schema } from "./graphql-schema";
import { schema as publicSchema } from "./graphql-schema/public";
import { getToken, getUserInfo } from "./utils/kakao";
import { getInitialRandomName } from "./utils/random";
import {
  addUser,
  getUserByKakaoId,
  getUserById,
  isAdmin,
} from "./db-schema/User";
import { addImage } from "./db-schema/Image";

/////////////
// MONGODB //
/////////////
let uri = process.env.DB_URI;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("DB Connected!"));

/////////////
// EXPRESS //
/////////////
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const decodeJWT = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
app.use(
  "/graphql",
  decodeJWT,
  graphqlHTTP({
    schema: schema,
  })
);

app.use(
  "/publicGraphql",
  graphqlHTTP({
    schema: publicSchema,
  })
);

app.post("/user", async (req, res) => {
  const { token } = req.body;
  let id;
  try {
    const viewer = jwtSign.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });
    id = viewer.id;
  } catch (error) {
    return res.json({
      error: "invalid_token",
      error_description: "token is invalid",
    });
  }

  const user = await getUserById({ _id: id });

  res.json(user);
});

app.post("/oauth", async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!(code || redirectUri)) {
    // TODO: Something wrong
    return res.json({
      error: "invalid_request",
      error_description: "authorization code or redirect uri not found",
    });
  }

  const token = await getToken(code, redirectUri);

  if (token.access_token === undefined) {
    return res.json({
      error: "token_not_issued",
      error_description: "token is not issued",
    });
  }

  const userInfo = await getUserInfo(token);

  if (userInfo.id === undefined) {
    return res.json({
      error: "invalid_user_info",
      error_description: "user info is invalid",
    });
  }

  let user = await getUserByKakaoId({ kakaoId: userInfo.id });
  if (user === null) {
    const name = await getInitialRandomName();

    user = await addUser({ name, token, userInfo });
  }

  // TODO: Make use of issuer, audience
  res.json({
    token: jwtSign.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    ),
  });
});

// TODO: Accept language: req.acceptsLanguages()
app.use(
  "/",
  express.static(path.resolve(__dirname, "..", "..", "nopreme-web", "docs"))
);

/////////////
// STORAGE //
/////////////
const storage = new Storage();
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

app.post(
  "/upload",
  decodeJWT,
  multer.single("file"),
  async ({ user: { id } }, res, next) => {
    if (!(await isAdmin({ _id: id }))) return res.status(401).end();

    next();
  },
  async (req, res) => {
    // TODO: Consistent error msg and handling
    if (!req.file) return res.status(400).send("No file uploaded.");

    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();

    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

    let exists;
    let gcpFile;
    let filename;
    do {
      filename = uuidv4() + ext;
      gcpFile = bucket.file(filename);
      [exists] = await gcpFile.exists();
    } while (exists);

    await gcpFile.save(req.file.buffer);

    const addedImage = await addImage({
      src: `/${bucket.name}/${filename}`,
      originalName,
      ext,
      size: req.file.size,
    });

    res.json({
      ...addedImage,
      imageId: addedImage._id,
      src: process.env.GCLOUD_STORAGE_HOST + addedImage.src,
    });
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
