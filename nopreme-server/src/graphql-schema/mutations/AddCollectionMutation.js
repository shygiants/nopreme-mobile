import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
  offsetToCursor,
} from "graphql-relay";
import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { GraphQLCollectionEdge } from "../nodes";
import { addCollection } from "../../db-schema/Collection";
import { addWish } from "../../db-schema/Wish";
import { addPosession } from "../../db-schema/Posession";

const ItemPick = new GraphQLInputObjectType({
  name: "ItemPick",
  fields: {
    itemId: { type: new GraphQLNonNull(GraphQLID) },
    num: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const AddCollectionMutation = mutationWithClientMutationId({
  name: "AddCollection",
  inputFields: {
    goodsId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    wishes: {
      type: new GraphQLNonNull(new GraphQLList(ItemPick)),
    },
    posessions: {
      type: new GraphQLNonNull(new GraphQLList(ItemPick)),
    },
  },
  outputFields: {
    collectionEdge: {
      type: new GraphQLNonNull(GraphQLCollectionEdge),
      resolve: async ({ collection }) => {
        return {
          cursor: offsetToCursor(0),
          node: collection,
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { goodsId, wishes, posessions },
    { user: { id } }
  ) => {
    // TODO: Transaction
    const collection = await addCollection({
      goods: goodsId,
      user: id,
    });

    await Promise.all(
      wishes.map(({ itemId, num }) =>
        addWish({
          item: itemId,
          user: id,
          num,
          coll: collection._id,
        })
      )
    );

    await Promise.all(
      posessions.map(({ itemId, num }) =>
        addPosession({
          item: itemId,
          user: id,
          num,
          type: "CORRECTION",
          coll: collection._id,
        })
      )
    );

    return { collection };
  },
});
