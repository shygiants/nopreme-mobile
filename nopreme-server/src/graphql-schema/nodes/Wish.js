import { globalIdField } from "graphql-relay";
import { GraphQLInt, GraphQLNonNull } from "graphql";

import { GraphQLItem, GraphQLUser } from ".";
import { getItemById } from "../../db-schema/Item";
import { getUserById } from "../../db-schema/User";
import { getPosessionObj } from "../../db-schema/Posession";

const SEPARATOR = "-";

export default {
  id: globalIdField("Wish", (wish) => [wish.item, wish.user].join(SEPARATOR)),
  item: {
    type: new GraphQLNonNull(GraphQLItem),
    resolve: async (wish) => await getItemById({ _id: wish.item }),
  },
  user: {
    type: new GraphQLNonNull(GraphQLUser),
    resolve: async (wish) => await getUserById({ _id: wish.user }),
  },
  num: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  fulfilled: {
    type: new GraphQLNonNull(GraphQLInt),
    resolve: async (wish) =>
      wish.num === 0
        ? 0
        : (await getPosessionObj({ itemId: wish.item, userId: wish.user })).num,
  },
};
