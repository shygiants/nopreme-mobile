import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";

import { isAdmin } from "../../db-schema/User";
import { removeItem } from "../../db-schema/Item";

export const RemoveItemMutation = mutationWithClientMutationId({
  name: "RemoveItem",
  inputFields: {
    itemId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    removedItemId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ removedItemId }) => toGlobalId("Item", removedItemId),
    },
  },
  mutateAndGetPayload: async ({ itemId }, { user: { id } }) => {
    if (!(await isAdmin({ _id: id }))) return null;

    const removedItemId = await removeItem({ _id: itemId });

    return { removedItemId };
  },
});
