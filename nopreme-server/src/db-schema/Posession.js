import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

import PosessionTypes from "../assets/enum/posessionTypes.json";

import { getCollectionById, getCollectionByIds } from "./Collection";
import { getItems, getItemById } from "./Item";

const posessionSchema = new mongoose.Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  num: Number,
  type: {
    type: String,
    enum: PosessionTypes.map(({ value }) => value),
    index: true,
  },
  coll: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

posessionSchema.index({ item: 1, user: 1 });

export const Posession = mongoose.model("Posession", posessionSchema);

export async function getPosessionById({ _id }) {
  return await Posession.findById(_id).exec();
}

export async function getPosessionNumByIds({ itemId, userId, collectionId }) {
  const result = await Posession.aggregate()
    .match({
      item: new ObjectId(itemId),
      user: new ObjectId(userId),
      coll: new ObjectId(collectionId),
    })
    .group({
      _id: null,
      num: { $sum: "$num" },
    })
    .exec();

  return result.length > 0 ? result[0].num : 0;
}

export async function addPosession({ item, user, num, type, coll }) {
  return await new Posession({ item, user, num, type, coll }).save();
}

export async function getPosessionsByCollectionId({ collectionId }) {
  const collection = await getCollectionById({ _id: collectionId });
  const items = await getItems({ goodsId: collection.goods });

  const posessionNums = await Promise.all(
    items.map(({ _id }) =>
      getPosessionNumByIds({
        itemId: _id,
        userId: collection.user,
        collectionId: collection._id,
      })
    )
  );

  return posessionNums.map((num, idx) => ({
    item: items[idx]._id,
    user: collection.user,
    num,
  }));
}

export async function getPosessionObj({ itemId, userId }) {
  const item = await getItemById({ _id: itemId });
  const collection = await getCollectionByIds({ goodsId: item.goods, userId });
  if (collection === null || !collection.intent) {
    return { item: itemId, user: userId, num: 0 };
  }

  return {
    item: itemId,
    user: userId,
    num: await getPosessionNumByIds({
      itemId,
      userId,
      collectionId: collection._id,
    }),
  };
}
