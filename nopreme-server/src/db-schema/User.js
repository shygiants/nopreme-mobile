import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { buildUpdate } from "../utils/db";

const userSchema = new mongoose.Schema({
  kakaoId: {
    type: Number,
    index: true,
  },
  name: {
    type: String,
    index: true,
    unique: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  connectedAt: Date,
  admin: {
    type: Boolean,
    default: false,
  },
  kakao: {
    accessToken: String,
    refreshToken: String,
    expiresIn: Number,
    refreshTokenExpiresIn: Number,
    issuedAt: Date,
  },
});

export const User = mongoose.model("User", userSchema);

export async function getUserById({ _id }) {
  return await User.findById(_id).exec();
}

export async function nameExists({ name }) {
  return await User.findOne({ name })
    .exec()
    .then((user) => user !== null);
}

export async function getUserByKakaoId({ kakaoId }) {
  return await User.findOne({ kakaoId }).exec();
}

// Add user with kakao id
export async function addUser({
  name,
  token: { access_token, refresh_token, expires_in, refresh_token_expires_in },
  userInfo: { id, connected_at },
}) {
  const user = await getUserByKakaoId({ kakaoId: id });
  if (user !== null) throw "User with given id already exists";

  return await new User({
    kakaoId: id,
    name,
    connectedAt: connected_at,
    kakao: {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      refreshTokenExpiresIn: refresh_token_expires_in,
      issuedAt: Date.now(),
    },
  }).save();
}

export async function modifyUser({ _id, name, profile }) {
  // TODO: Resolve unique username issue: https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
  const update = { name, profile };

  const modifiedUser = await User.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    { new: true }
  ).exec();

  return modifiedUser;
}

export async function isAdmin({ _id }) {
  const user = await getUserById({ _id });
  return user.admin;
}
