import { mutationWithClientMutationId, offsetToCursor } from "graphql-relay";
import { GraphQLNonNull, GraphQLID, GraphQLList } from "graphql";

import { GraphQLCollectionEdge } from "../nodes";
import { getCollectionByIds } from "../../db-schema/Collection";
import { upsertWish } from "../../db-schema/Wish";
import { updatePosession } from "../../db-schema/Posession";
import { ItemPick } from "./AddCollectionMutation";

export const UpdateCollectionMutation = mutationWithClientMutationId({
  name: "UpdateCollection",
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
    const collection = await getCollectionByIds({
      goodsId,
      userId: id,
    });

    await Promise.all(
      wishes.map(({ itemId, num }) =>
        upsertWish({
          item: itemId,
          user: id,
          num,
          coll: collection._id,
        })
      )
    );

    await Promise.all(
      posessions.map(({ itemId, num }) =>
        updatePosession({
          item: itemId,
          user: id,
          num,
          coll: collection._id,
        })
      )
    );

    return { collection };
  },
});
