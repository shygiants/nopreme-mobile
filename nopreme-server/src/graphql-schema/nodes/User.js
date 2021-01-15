import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

import { GraphQLImage } from ".";
import { getImageById } from "../../db-schema/Image";

export default {
  id: globalIdField("User", (user) => user._id),
  userId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (user) => user._id,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  profile: {
    type: GraphQLImage,
    resolve: async (user) =>
      user.profile ? await getImageById({ _id: user.profile }) : null,
  },
};
