import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  src: String,
  originalName: String,
  ext: String,
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = mongoose.model("Image", imageSchema);

export async function getImageById({ _id }) {
  return await Image.findById(_id).exec();
}

export async function addImage({ src, originalName, ext, size }) {
  return await new Image({
    src,
    originalName,
    ext,
    size,
  }).save();
}
