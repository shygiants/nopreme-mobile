import { globalIdField } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { GraphQLUser, GraphQLEvent } from ".";
import { getUserById } from "../../db-schema/User";
import { getEventById } from "../../db-schema/Event";

export default {
  id: globalIdField("EventReport", (eventReport) => eventReport._id),
  reporter: {
    type: new GraphQLNonNull(GraphQLUser),
    resolve: async (eventReport) =>
      await getUserById({ _id: eventReport.reporter }),
  },
  event: {
    type: new GraphQLNonNull(GraphQLEvent),
    resolve: async (eventReport) =>
      await getEventById({ _id: eventReport.event }),
  },
  contents: {
    type: GraphQLString,
  },
};
