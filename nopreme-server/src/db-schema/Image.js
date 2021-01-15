import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
  src: String,
  originalName: String,
  ext: String,
  size: Number,
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = mongoose.model("Image", imageSchema);

export async function getImageById({ _id }) {
  return await Image.findById(_id).exec();
}

export async function addImage({ src, originalName, ext, size, uploader }) {
  return await new Image({
    src,
    originalName,
    ext,
    size,
    uploader,
  }).save();
}
