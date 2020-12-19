import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt } from "graphql";

import { GraphQLGoodsEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { modifyGoods, getGoodsCollection } from "../../db-schema/Goods";

export const ModifyGoodsMutation = mutationWithClientMutationId({
  name: "ModifyGoods",
  inputFields: {
    goodsId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
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
      resolve: async ({ _id, name, type, img, size, artist, event }) => {
        const goodsCollection = await getGoodsCollection({
          artistId: artist,
          eventId: event,
        });

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
    { goodsId, name, type, img, width, height },
    { user: { id } }
  ) => {
    if (!(await isAdmin({ _id: id }))) return null;

    return await modifyGoods({
      _id: goodsId,
      name,
      type,
      img,
      size: { width, height },
    });
  },
});
