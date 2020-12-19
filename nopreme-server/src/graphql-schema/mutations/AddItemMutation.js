import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt } from "graphql";

import { GraphQLItemEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { getItems, addItem } from "../../db-schema/Item";

export const AddItemMutation = mutationWithClientMutationId({
  name: "AddItem",
  inputFields: {
    goodsId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    artistId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    idx: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    img: {
      type: GraphQLID,
    },
  },
  outputFields: {
    itemEdge: {
      type: new GraphQLNonNull(GraphQLItemEdge),
      resolve: async ({ item: { _id, idx, artist, img }, goodsId }) => {
        const items = await getItems({ goodsId });

        const itemIds = items.map((item) => item._id.toString());
        const currItemId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...itemIds], currItemId),
          node: { _id, idx, artist, img },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { goodsId, artistId, idx, img },
    { user: { id } }
  ) => {
    // TODO: handle not authorized error
    if (!(await isAdmin({ _id: id }))) return null;

    const item = await addItem({
      idx,
      artist: artistId,
      img,
      goods: [goodsId],
    });

    return { item, goodsId };
  },
});
