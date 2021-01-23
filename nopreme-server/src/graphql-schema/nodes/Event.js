import { globalIdField } from "graphql-relay";
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";

import { dateToStr } from "../../utils/date";
import { GraphQLImage } from ".";
import { getImageById } from "../../db-schema/Image";
import { getGoodsCollection } from "../../db-schema/Goods";
import { getArtistByName } from "../../db-schema/Artist";

export default {
  id: globalIdField("Event", (event) => event._id),
  eventId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (event) => event._id,
  },
  img: {
    type: GraphQLImage,
    resolve: async (event) =>
      event.img ? await getImageById({ _id: event.img }) : null,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  date: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (event) => dateToStr(event.date),
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
  published: {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (event) => event?.published ?? false,
  },
  numGoods: {
    type: GraphQLInt,
    args: {
      artistName: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (event, { artistName }) => {
      const artist = await getArtistByName({ name: artistName });
      return (
        await getGoodsCollection({ artistId: artist._id, eventId: event._id })
      ).length;
    },
  },
};
