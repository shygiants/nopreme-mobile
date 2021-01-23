import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";

import { GraphQLEventEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { modifyEvent, getEvents } from "../../db-schema/Event";
import { strToDate } from "../../utils/date";

export const ModifyEventMutation = mutationWithClientMutationId({
  name: "ModifyEvent",
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    img: {
      type: GraphQLID,
    },
    published: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    eventEdge: {
      type: new GraphQLNonNull(GraphQLEventEdge),
      resolve: async ({ _id, name, date, type, img, artist, published }) => {
        const events = await getEvents({ artistId: artist[0] });

        const eventIds = events.map((event) => event._id.toString());
        const currEventId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...eventIds], currEventId),
          node: { _id, name, date, type, img, published },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { eventId, name, date, type, img, published },
    { user: { id } }
  ) => {
    if (!(await isAdmin({ _id: id }))) return null;

    return await modifyEvent({
      _id: eventId,
      name,
      date: date && strToDate(date),
      type,
      img,
      published,
    });
  },
});
