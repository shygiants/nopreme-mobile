import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";

import { isAdmin } from "../../db-schema/User";
import { removeGroup } from "../../db-schema/Artist";

export const RemoveGroupMutation = mutationWithClientMutationId({
  name: "RemoveGroup",
  inputFields: {
    groupId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    removedGroupId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ removedGroupId }) => toGlobalId("Artist", removedGroupId),
    },
  },
  mutateAndGetPayload: async ({ groupId }, { user: { id } }) => {
    if (!(await isAdmin({ _id: id }))) return null;

    const removedGroupId = await removeGroup({ _id: groupId });

    return { removedGroupId };
  },
});
