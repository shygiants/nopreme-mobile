import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt } from "graphql";

import { GraphQLGoodsEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { getGoodsCollection, addGoods } from "../../db-schema/Goods";

export const AddGoodsMutation = mutationWithClientMutationId({
  name: "AddGoods",
  inputFields: {
    artistId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    img: {
      type: GraphQLID,
    },
    width: {
      type: GraphQLInt,
    },
    height: {
      type: GraphQLInt,
    },
  },
  outputFields: {
    goodsEdge: {
      type: new GraphQLNonNull(GraphQLGoodsEdge),
      resolve: async ({
        goods: { _id, name, type, img, size },
        artistId,
        eventId,
      }) => {
        const goodsCollection = await getGoodsCollection({ artistId, eventId });

        const goodsIds = goodsCollection.map((goods) => goods._id.toString());
        const currGoodsId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...goodsIds], currGoodsId),
          node: { _id, name, type, img, size },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { artistId, eventId, name, type, img, width, height },
    { user: { id } }
  ) => {
    // TODO: handle not authorized error
    if (!(await isAdmin({ _id: id }))) return null;

    const goods = await addGoods({
      artist: artistId,
      event: eventId,
      name,
      type,
      img,
      size: { width, height },
    });

    return { goods, artistId, eventId };
  },
});
