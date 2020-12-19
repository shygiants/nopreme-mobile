import { globalIdField } from "graphql-relay";
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from "graphql";

import { GraphQLImage, GraphQLArtist } from ".";
import { getImageById } from "../../db-schema/Image";
import { getArtistById } from "../../db-schema/Artist";

export default {
  id: globalIdField("Item", (item) => item._id),
  itemId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (item) => item._id,
  },
  idx: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  artist: {
    type: new GraphQLNonNull(new GraphQLList(GraphQLArtist)),
    resolve: (item) =>
      item.artist.map((artist) => getArtistById({ _id: artist })),
  },
  img: {
    type: GraphQLImage,
    resolve: (item) => (item.img ? getImageById({ _id: item.img }) : null),
  },
};
