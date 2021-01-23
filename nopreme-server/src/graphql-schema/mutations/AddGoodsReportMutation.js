import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLGoodsReportEdge } from "../nodes";
import { addReport, getGoodsReports } from "../../db-schema/Report";

export const AddGoodsReportMutation = mutationWithClientMutationId({
  name: "AddGoodsReport",
  inputFields: {
    goodsId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    contents: {
      type: GraphQLString,
    },
  },
  outputFields: {
    goodsReportEdge: {
      type: new GraphQLNonNull(GraphQLGoodsReportEdge),
      resolve: async ({ report: { _id, reporter, type, goods, contents } }) => {
        const reports = await getGoodsReports();

        const reportIds = reports.map((report) => report._id.toString());
        const currReportId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...reportIds], currReportId),
          node: { _id, reporter, type, goods, contents },
        };
      },
    },
  },
  mutateAndGetPayload: async ({ goodsId, contents }, { user: { id } }) => {
    const report = await addReport({
      reporter: id,
      type: "GOODS_INCORRECT_INFO",
      goods: goodsId,
      contents,
    });

    return { report };
  },
});
