import { globalIdField } from "graphql-relay";
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { GraphQLImage, GraphQLEvent } from ".";
import { getImageById } from "../../db-schema/Image";
import { getEventById } from "../../db-schema/Event";
import { getItems } from "../../db-schema/Item";
import { getFulfilled, isCollecting } from "../../db-schema/Collection";
import { isObjectId } from "../../utils/db";

export default {
  id: globalIdField("Goods", (goods) => goods._id),
  goodsId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (goods) => goods._id,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
  img: {
    type: GraphQLImage,
    resolve: async (goods) =>
      goods.img ? await getImageById({ _id: goods.img }) : null,
  },
  width: {
    type: GraphQLInt,
    resolve: (goods) => (goods.size ? goods.size.width : null),
  },
  height: {
    type: GraphQLInt,
    resolve: (goods) => (goods.size ? goods.size.height : null),
  },
  event: {
    type: GraphQLEvent,
    resolve: async (goods) => {
      if (!goods.event) return null;

      return isObjectId(goods.event)
        ? await getEventById({ _id: goods.event })
        : goods.event;
    },
  },
  numItems: {
    type: GraphQLInt,
    resolve: async (goods) => (await getItems({ goodsId: goods._id })).length,
  },
  collecting: {
    type: GraphQLBoolean,
    resolve: async (goods, args, { user: { id } }) =>
      await isCollecting({ goodsId: goods._id, userId: id }),
  },
  fulfilled: {
    type: GraphQLFloat,
    resolve: async (goods, args, { user: { id } }) => {
      return await getFulfilled({ goodsId: goods._id, userId: id });
    },
  },
};
