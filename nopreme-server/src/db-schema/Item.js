import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

import { buildUpdate, buildSort } from "../utils/db";

const itemSchema = new mongoose.Schema({
  idx: Number,
  artist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  img: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  goods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
  },
});

export const Item = mongoose.model("Item", itemSchema);

export async function getItemById({ _id }) {
  return await Item.findById(_id).exec();
}

export async function addItem({ idx, artist, img, goods }) {
  return await new Item({
    idx,
    artist,
    img,
    goods,
  }).save();
}

export async function getItems(
  { goodsId },
  sort = [
    { sortBy: "artist.birthday", order: 1 },
    { sortBy: "idx", order: 1 },
  ]
) {
  return await Item.aggregate()
    .match({ goods: new ObjectId(goodsId) })
    .lookup({
      from: "artists",
      localField: "artist",
      foreignField: "_id",
      as: "artist",
    })
    .sort(buildSort(sort))
    .exec();
}

export async function modifyItem({ _id, idx, artist, img }) {
  const update = { idx, artist, img };

  const modifiedItem = await Item.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    {
      new: true,
    }
  ).exec();

  return modifiedItem;
}

export async function removeItem({ _id }) {
  //TODO: { n: 1, ok: 1, deletedCount: 1 }
  const res = await Item.deleteOne({ _id }).exec();

  return _id;
}
