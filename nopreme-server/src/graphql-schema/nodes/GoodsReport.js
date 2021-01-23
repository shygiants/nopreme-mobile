import { globalIdField } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { GraphQLUser, GraphQLGoods } from ".";
import { getUserById } from "../../db-schema/User";
import { getGoodsById } from "../../db-schema/Goods";

export default {
  id: globalIdField("GoodsReport", (goodsReport) => goodsReport._id),
  reporter: {
    type: new GraphQLNonNull(GraphQLUser),
    resolve: async (goodsReport) =>
      await getUserById({ _id: goodsReport.reporter }),
  },
  goods: {
    type: new GraphQLNonNull(GraphQLGoods),
    resolve: async (goodsReport) =>
      await getGoodsById({ _id: goodsReport.goods }),
  },
  contents: {
    type: GraphQLString,
  },
};
