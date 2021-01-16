import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLEventReportEdge } from "../nodes";
import { addReport, getEventReports } from "../../db-schema/Report";

export const AddEventReportMutation = mutationWithClientMutationId({
  name: "AddEventReport",
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    contents: {
      type: GraphQLString,
    },
  },
  outputFields: {
    eventReportEdge: {
      type: new GraphQLNonNull(GraphQLEventReportEdge),
      resolve: async ({ report: { _id, reporter, type, event, contents } }) => {
        const reports = await getEventReports();

        const reportIds = reports.map((report) => report._id.toString());
        const currReportId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...reportIds], currReportId),
          node: { _id, reporter, type, event, contents },
        };
      },
    },
  },
  mutateAndGetPayload: async ({ eventId, contents }, { user: { id } }) => {
    const report = await addReport({
      reporter: id,
      type: "EVENT_INCORRECT_INFO",
      event: eventId,
      contents,
    });

    return { report };
  },
});
