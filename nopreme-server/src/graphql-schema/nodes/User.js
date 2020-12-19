import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

export default {
  id: globalIdField("User", (user) => user._id),
  userId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (user) => user._id,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
};
