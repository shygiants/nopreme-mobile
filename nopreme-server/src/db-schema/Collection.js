import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

import { getWishByIds } from "./Wish";
import { getItems } from "./Item";
import { getPosessionNumByIds } from "./Posession";
import { buildSort } from "../utils/db";

const collectionSchema = new mongoose.Schema({
  goods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  intent: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

collectionSchema.index({ goods: 1, user: 1 });

export const Collection = mongoose.model("Collection", collectionSchema);

export async function getCollectionById({ _id }) {
  return await Collection.findById(_id).exec();
}

export async function getCollectionByIds({ goodsId, userId }) {
  const collections = await Collection.find({
    goods: goodsId,
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .exec();

  return collections.length === 0 ? null : collections[0];
}

export async function addCollection({ goods, user }) {
  const collection = await getCollectionByIds({ goodsId: goods, userId: user });

  const intent = collection === null || !collection.intent;

  return intent
    ? await new Collection({ goods, user, intent: true }).save()
    : null;
}

export async function getCollections(
  { userId },
  sort = [
    { sortBy: "goods.event.date", order: -1 },
    { sortBy: "goods.name", order: 1 },
  ]
) {
  // TODO: Sort by various criterion

  return await Collection.aggregate()
    .match({ user: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .group({
      _id: "$goods",
      collection: { $first: "$_id" },
      intent: { $first: "$intent" },
      user: { $first: "$user" },
    })
    .match({ intent: true })
    .project({
      _id: "$collection",
      goods: "$_id",
      user: 1,
    })
    .lookup({
      from: "goods",
      localField: "goods",
      foreignField: "_id",
      as: "goods",
    })
    .unwind("goods")
    .lookup({
      from: "events",
      localField: "goods.event",
      foreignField: "_id",
      as: "goods.event",
    })
    .unwind("goods.event")
    .sort(buildSort(sort))
    .exec();
}

export async function isCollecting({ goodsId, userId }) {
  const collection = await getCollectionByIds({ goodsId, userId });

  return collection !== null && collection.intent;
}

export async function getFulfilled({ goodsId, userId }) {
  const collection = await getCollectionByIds({ goodsId, userId });

  if (collection === null || !collection.intent) return 0;

  const items = await getItems({ goodsId });

  const wishes = await Promise.all(
    items.map(
      async ({ _id }) =>
        await getWishByIds({
          itemId: _id,
          userId,
          collectionId: collection._id,
        })
    )
  );

  const status = await Promise.all(
    wishes
      .filter((wish) => wish !== null && wish.num > 0)
      .map(async ({ item, num }) => {
        const fulfilled = await getPosessionNumByIds({
          itemId: item,
          userId,
          collectionId: collection._id,
        });

        return { num, fulfilled };
      })
  );

  const reduced = status.reduce(
    (accum, { num, fulfilled }) => ({
      num: accum.num + num,
      fulfilled: accum.fulfilled + Math.min(fulfilled, num),
    }),
    { num: 0, fulfilled: 0 }
  );

  return reduced.fulfilled / reduced.num;
}
