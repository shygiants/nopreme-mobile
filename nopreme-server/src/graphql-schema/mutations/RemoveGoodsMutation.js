import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";

import { isAdmin } from "../../db-schema/User";
import { removeGoods } from "../../db-schema/Goods";

export const RemoveGoodsMutation = mutationWithClientMutationId({
  name: "RemoveGoods",
  inputFields: {
    goodsId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    removedGoodsId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ removedGoodsId }) => toGlobalId("Goods", removedGoodsId),
    },
  },
  mutateAndGetPayload: async ({ goodsId }, { user: { id } }) => {
    if (!(await isAdmin({ _id: id }))) return null;

    const removedGoodsId = await removeGoods({ _id: goodsId });

    return { removedGoodsId };
  },
});
