import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

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

export async function getCollections({ userId }) {
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
    .exec();
}
