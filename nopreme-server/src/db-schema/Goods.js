import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

import { buildUpdate, buildFind, buildSort } from "../utils/db";

import GoodsTypes from "../assets/enum/goodsTypes.json";

const goodsSchema = new mongoose.Schema({
  name: String,
  img: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  type: {
    type: String,
    enum: GoodsTypes.map(({ value }) => value),
  },
  size: {
    width: Number,
    height: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Goods = mongoose.model("Goods", goodsSchema);

export async function getGoodsById({ _id }) {
  return await Goods.findById(_id).exec();
}

export async function addGoods({ name, img, type, size, artist, event }) {
  return await new Goods({
    name,
    img,
    type,
    size,
    artist,
    event,
  }).save();
}

export async function getGoodsCollection(
  { artistId, eventId, goodsType },
  sort = [
    { sortBy: "event.date", order: -1 },
    { sortBy: "name", order: 1 },
  ]
) {
  // TODO: consider multiple sort
  const { sortBy, order } = sort;

  return await Goods.aggregate()
    .match(
      buildFind({
        artist: artistId && new ObjectId(artistId),
        event: eventId && new ObjectId(eventId),
        type: goodsType,
      })
    )
    .lookup({
      from: "events",
      localField: "event",
      foreignField: "_id",
      as: "event",
    })
    .unwind("event")
    .sort(buildSort([sort]))
    .exec();
}

export async function modifyGoods({ _id, name, img, type, size }) {
  const update = { name, img, type, size };

  const modifiedGoods = await Goods.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    {
      new: true,
    }
  ).exec();

  return modifiedGoods;
}

export async function removeGoods({ _id }) {
  //TODO: { n: 1, ok: 1, deletedCount: 1 }
  const res = await Goods.deleteOne({ _id }).exec();

  return _id;
}
