import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { buildUpdate } from "../utils/db";

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  img: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
  birthday: Date,
  isGroup: Boolean,
  belongsTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Artist = mongoose.model("Artist", artistSchema);

export async function getArtistById({ _id }) {
  return await Artist.findById(_id).exec();
}

export async function addGroup({ name, birthday, img }) {
  return await new Artist({
    name,
    birthday,
    img,
    isGroup: true,
  }).save();
}

export async function getGroups(_ = { sortBy: "createdAt", order: 1 }) {
  const { sortBy, order } = _;
  return await Artist.find({ isGroup: true })
    .sort({ [sortBy]: order })
    .exec();
}

export async function modifyGroup({ _id, name, birthday, img }) {
  const update = { name, birthday, img };

  const modifiedGroup = await Artist.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    {
      new: true,
    }
  ).exec();

  return modifiedGroup;
}

export async function removeGroup({ _id }) {
  //TODO: { n: 1, ok: 1, deletedCount: 1 }
  const res = await Artist.deleteOne({ _id }).exec();

  return _id;
}

export async function addArtist({ name, birthday, img, belongsTo }) {
  return await new Artist({
    name,
    birthday,
    img,
    isGroup: false,
    belongsTo,
  }).save();
}

export async function getArtists(
  { groupId },
  _ = { sortBy: "birthday", order: 1 }
) {
  const { sortBy, order } = _;
  return await Artist.find({ belongsTo: groupId })
    .sort({ [sortBy]: order })
    .exec();
}

export async function modifyArtist({ _id, name, birthday, img }) {
  const update = { name, birthday, img };

  const modifiedArtist = await Artist.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    {
      new: true,
    }
  ).exec();

  return modifiedArtist;
}

export async function removeArtist({ _id }) {
  //TODO: { n: 1, ok: 1, deletedCount: 1 }
  const res = await Artist.deleteOne({ _id }).exec();

  return _id;
}

export async function getArtistByName({ name }) {
  return await Artist.findOne({ name }).exec();
}
