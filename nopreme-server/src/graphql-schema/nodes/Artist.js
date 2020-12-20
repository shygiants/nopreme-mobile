import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

import { dateToStr } from "../../utils/date";
import { GraphQLImage } from ".";
import { getImageById } from "../../db-schema/Image";

export default {
  id: globalIdField("Artist", (artist) => artist._id),
  artistId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (artist) => artist._id,
  },
  img: {
    type: GraphQLImage,
    resolve: async (artist) =>
      artist.img && artist.img.length > 0
        ? await getImageById({ _id: artist.img[0] })
        : null,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  birthday: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (artist) => dateToStr(artist.birthday),
  },
};
