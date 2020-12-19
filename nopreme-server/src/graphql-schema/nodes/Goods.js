import { globalIdField } from "graphql-relay";
import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

import { GraphQLImage, GraphQLEvent } from ".";
import { getImageById } from "../../db-schema/Image";
import { getEventById } from "../../db-schema/Event";

export default {
  id: globalIdField("Goods", (goods) => goods._id),
  goodsId: {
    type: new GraphQLNonNull(GraphQLID),
    resolve: (goods) => goods._id,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
  img: {
    type: GraphQLImage,
    resolve: (goods) => (goods.img ? getImageById({ _id: goods.img }) : null),
  },
  width: {
    type: GraphQLInt,
    resolve: (goods) => (goods.size ? goods.size.width : null),
  },
  height: {
    type: GraphQLInt,
    resolve: (goods) => (goods.size ? goods.size.height : null),
  },
  event: {
    type: GraphQLEvent,
    resolve: (goods) =>
      goods.event ? getEventById({ _id: goods.event }) : null,
  },
};
