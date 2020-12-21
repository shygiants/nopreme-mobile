import { globalIdField } from "graphql-relay";
import { GraphQLInt, GraphQLNonNull } from "graphql";

import { GraphQLItem, GraphQLUser } from ".";
import { getItemById } from "../../db-schema/Item";
import { getUserById } from "../../db-schema/User";
import { getWishObj } from "../../db-schema/Wish";

const SEPARATOR = "-";

export default {
  id: globalIdField("Posession", (posession) =>
    [posession.item, posession.user].join(SEPARATOR)
  ),
  item: {
    type: new GraphQLNonNull(GraphQLItem),
    resolve: async (posession) => await getItemById({ _id: posession.item }),
  },
  user: {
    type: new GraphQLNonNull(GraphQLUser),
    resolve: async (posession) => await getUserById({ _id: posession.user }),
  },
  num: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  wished: {
    type: new GraphQLNonNull(GraphQLInt),
    resolve: async (posession) =>
      posession.num === 0
        ? 0
        : (await getWishObj({ itemId: posession.item, userId: posession.user }))
            .num,
  },
};
