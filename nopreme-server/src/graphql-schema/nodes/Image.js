import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

export default {
  id: globalIdField("Image", (image) => image._id),
  imageId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (image) => image._id,
  },
  src: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (image) => process.env.GCLOUD_STORAGE_HOST + image.src,
  },
};
