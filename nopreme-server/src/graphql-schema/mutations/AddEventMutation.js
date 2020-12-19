import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLEventEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { getEvents, addEvent } from "../../db-schema/Event";
import { strToDate } from "../../utils/date";

export const AddEventMutation = mutationWithClientMutationId({
  name: "AddEvent",
  inputFields: {
    artistId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    img: {
      type: GraphQLID,
    },
  },
  outputFields: {
    eventEdge: {
      type: new GraphQLNonNull(GraphQLEventEdge),
      resolve: async ({ event: { _id, name, date, type, img }, artistId }) => {
        const events = await getEvents({ artistId });

        const eventIds = events.map((event) => event._id.toString());
        const currEventId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...eventIds], currEventId),
          node: { _id, name, date, type, img },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { artistId, name, date, type, img },
    { user: { id } }
  ) => {
    // TODO: handle not authorized error
    if (!(await isAdmin({ _id: id }))) return null;

    const event = await addEvent({
      artist: [artistId],
      name,
      date: strToDate(date),
      type,
      img,
    });

    return { event, artistId };
  },
});
