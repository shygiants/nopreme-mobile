import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { getCollectionById } from "./Collection";
import { getItems, getItemById } from "./Item";
import { getCollectionByIds } from "./Collection";

const wishSchema = new mongoose.Schema({
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

wishSchema.index({ item: 1, user: 1 });

export const Wish = mongoose.model("Wish", wishSchema);

export async function getWishById({ _id }) {
  return await Wish.findById(_id).exec();
}

export async function getWishByIds({ itemId, userId, collectionId }) {
  const wishes = await Wish.find({
    item: itemId,
    user: userId,
    coll: collectionId,
  })
    .sort({ createdAt: -1 })
    .exec();

  return wishes.length === 0 ? null : wishes[0];
}

export async function addWish({ item, user, num, coll }) {
  const wish = await getWishByIds({
    itemId: item,
    userId: user,
    collectionId: coll,
  });
  if ((wish === null && num !== 0) || wish.num !== num)
    return await new Wish({ item, user, num, coll }).save();

  return wish;
}

export async function getWishesByCollectionId({ collectionId }) {
  const collection = await getCollectionById({ _id: collectionId });
  const items = await getItems({ goodsId: collection.goods });

  const wishes = await Promise.all(
    items.map(({ _id }) =>
      getWishByIds({
        itemId: _id,
        userId: collection.user,
        collectionId: collection._id,
      })
    )
  );

  return wishes.map(
    (wish, idx) =>
      wish || { item: items[idx]._id, user: collection.user, num: 0 }
  );
}

export async function getWishObj({ itemId, userId }) {
  const item = await getItemById({ _id: itemId });
  const collection = await getCollectionByIds({ goodsId: item.goods, userId });
  if (collection === null || !collection.intent) {
    return { item: itemId, user: userId, num: 0 };
  }
  return await getWishByIds({ itemId, userId, collectionId: collection._id });
}
