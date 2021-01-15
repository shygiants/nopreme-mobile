import { mutationWithClientMutationId, offsetToCursor } from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLUserEdge } from "../nodes";
import { modifyUser } from "../../db-schema/User";

export const ModifyUserMutation = mutationWithClientMutationId({
  name: "ModifyUser",
  inputFields: {
    name: {
      type: GraphQLString,
    },
    profile: {
      type: GraphQLID,
    },
  },
  outputFields: {
    userEdge: {
      type: new GraphQLNonNull(GraphQLUserEdge),
      resolve: async ({ _id, name, profile }) => {
        return {
          cursor: offsetToCursor(0),
          node: { _id, name, profile },
        };
      },
    },
  },
  mutateAndGetPayload: async ({ name, profile }, { user: { id } }) => {
    return await modifyUser({
      _id: id,
      name,
      profile,
    });
  },
});
