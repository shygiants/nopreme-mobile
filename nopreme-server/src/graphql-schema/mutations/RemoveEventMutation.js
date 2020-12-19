import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";

import { isAdmin } from "../../db-schema/User";
import { removeEvent } from "../../db-schema/Event";

export const RemoveEventMutation = mutationWithClientMutationId({
  name: "RemoveEvent",
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    removedEventId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ removedEventId }) => toGlobalId("Event", removedEventId),
    },
  },
  mutateAndGetPayload: async ({ eventId }, { user: { id } }) => {
    if (!(await isAdmin({ _id: id }))) return null;

    const removedEventId = await removeEvent({ _id: eventId });

    return { removedEventId };
  },
});
