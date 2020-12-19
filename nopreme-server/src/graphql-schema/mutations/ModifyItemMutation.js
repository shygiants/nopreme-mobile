import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLID, GraphQLInt } from "graphql";

import { GraphQLItemEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { modifyItem, getItems } from "../../db-schema/Item";

export const ModifyItemMutation = mutationWithClientMutationId({
  name: "ModifyItem",
  inputFields: {
    itemId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    artistId: {
      type: GraphQLID,
    },
    idx: {
      type: GraphQLInt,
    },
    img: {
      type: GraphQLID,
    },
  },
  outputFields: {
    itemEdge: {
      type: new GraphQLNonNull(GraphQLItemEdge),
      resolve: async ({ _id, artist, idx, img, goods }) => {
        const items = await getItems({
          goodsId: goods,
        });

        const itemIds = items.map((item) => item._id.toString());
        const currItemId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...itemIds], currItemId),
          node: { _id, artist, idx, img },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { itemId, artistId, idx, img },
    { user: { id } }
  ) => {
    if (!(await isAdmin({ _id: id }))) return null;

    return await modifyItem({
      _id: itemId,
      artist: artistId && [artistId],
      idx,
      img,
    });
  },
});
