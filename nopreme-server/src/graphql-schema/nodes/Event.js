import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";

import { dateToStr } from "../../utils/date";
import { GraphQLImage } from ".";
import { getImageById } from "../../db-schema/Image";

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
};
