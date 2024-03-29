import { globalIdField } from "graphql-relay";
import { GraphQLBoolean, GraphQLNonNull, GraphQLFloat } from "graphql";
import { connectionArgs, connectionFromArray } from "graphql-relay";

import {
  GraphQLGoods,
  GraphQLUser,
  WishConnection,
  PosessionConnection,
} from ".";
import { getGoodsById } from "../../db-schema/Goods";
import { getUserById } from "../../db-schema/User";
import { getWishesByCollectionId } from "../../db-schema/Wish";
import { getPosessionsByCollectionId } from "../../db-schema/Posession";
import { getItems } from "../../db-schema/Item";
import { getFulfilled } from "../../db-schema/Collection";
import { isObjectId } from "../../utils/db";

const SEPARATOR = "-";

export default {
  id: globalIdField("Collection", (collection) => {
    return [
      isObjectId(collection.goods) || typeof collection.goods === "string"
        ? collection.goods
        : collection.goods._id,
      collection.user,
    ].join(SEPARATOR);
  }),
  collecting: {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (collection) =>
      collection._id !== undefined && collection._id !== null,
  },
  fulfilled: {
    type: GraphQLFloat,
    resolve: async (collection) => {
      return await getFulfilled({
        goodsId: isObjectId(collection.goods)
          ? collection.goods
          : collection.goods._id,
        userId: collection.user,
      });
    },
  },
  goods: {
    type: new GraphQLNonNull(GraphQLGoods),
    resolve: async (collection) => {
      return isObjectId(collection.goods)
        ? await getGoodsById({ _id: collection.goods })
        : collection.goods;
    },
  },
  user: {
    type: new GraphQLNonNull(GraphQLUser),
    resolve: async (collection) => await getUserById({ _id: collection.user }),
  },
  wishes: {
    type: new GraphQLNonNull(WishConnection),
    args: connectionArgs,
    resolve: async (collection, { after, before, first, last }) => {
      let wishes;
      if (collection._id) {
        // There is collection
        wishes = await getWishesByCollectionId({
          collectionId: collection._id,
        });
      } else {
        const items = await getItems({ goodsId: collection.goods });
        wishes = items.map(({ _id }) => ({
          item: _id,
          user: collection.user,
          num: 0,
        }));
      }

      return connectionFromArray([...wishes], { after, before, first, last });
    },
  },
  posessions: {
    type: new GraphQLNonNull(PosessionConnection),
    args: connectionArgs,
    resolve: async (collection, { after, before, first, last }) => {
      let posessions;
      if (collection._id) {
        // There is collection
        posessions = await getPosessionsByCollectionId({
          collectionId: collection._id,
        });
      } else {
        const items = await getItems({ goodsId: collection.goods });
        posessions = items.map(({ _id }) => ({
          item: _id,
          user: collection.user,
          num: 0,
        }));
      }

      return connectionFromArray([...posessions], {
        after,
        before,
        first,
        last,
      });
    },
  },
};
