import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";

import { nodeField, GraphQLProfile } from "./nodes";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    profile: {
      type: GraphQLProfile,
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (root, { userId }) => ({ userId }),
    },
    node: nodeField,
  },
});

export const schema = new GraphQLSchema({ query: Query });
