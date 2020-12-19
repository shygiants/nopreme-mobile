import {
  nodeDefinitions,
  fromGlobalId,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
  globalIdField,
} from "graphql-relay";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from "graphql";

import { getUserById, User } from "../../db-schema/User";
import {
  getArtistById,
  Artist,
  getGroups,
  getArtists,
  getArtistByName,
} from "../../db-schema/Artist";
import { getImageById, Image } from "../../db-schema/Image";
import {
  getEventById,
  Event,
  getEvents,
  getEventsByArtistName,
} from "../../db-schema/Event";
import { getGoodsById, Goods, getGoodsCollection } from "../../db-schema/Goods";
import { getItemById, Item, getItems } from "../../db-schema/Item";

export const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case "User":
        return await getUserById({ _id: id });
      case "Artist":
        return await getArtistById({ _id: id });
      case "Image":
        return await getImageById({ _id: id });
      case "Event":
        return await getEventById({ _id: id });
      case "Goods":
        return await getGoodsById({ _id: id });
      case "Item":
        return await getItemById({ _id: id });
      case "Admin":
        return new Admin();
      case "Viewer":
        return new Viewer();
      default:
        throw "no supported type";
    }
  },
  (obj) => {
    // TODO: get type from obj
    if (obj instanceof User) return GraphQLUser;
    else if (obj instanceof Artist) return GraphQLArtist;
    else if (obj instanceof Admin) return GraphQLAdmin;
    else if (obj instanceof Image) return GraphQLImage;
    else if (obj instanceof Event) return GraphQLEvent;
    else if (obj instanceof Goods) return GraphQLGoods;
    else if (obj instanceof Item) return GraphQLItem;
    else if (obj instanceof Viewer) return GraphQLViewer;
    else throw "no supported type";
  }
);

export const GraphQLImage = new GraphQLObjectType({
  name: "Image",
  fields: require("./Image").default,
  interfaces: [nodeInterface],
});

export const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: require("./User").default,
  interfaces: [nodeInterface],
});

export const GraphQLArtist = new GraphQLObjectType({
  name: "Artist",
  fields: require("./Artist").default,
  interfaces: [nodeInterface],
});

export const GraphQLEvent = new GraphQLObjectType({
  name: "Event",
  fields: require("./Event").default,
  interfaces: [nodeInterface],
});

export const GraphQLGoods = new GraphQLObjectType({
  name: "Goods",
  fields: require("./Goods").default,
  interfaces: [nodeInterface],
});

export const GraphQLItem = new GraphQLObjectType({
  name: "Item",
  fields: require("./Item").default,
  interfaces: [nodeInterface],
});

export const {
  connectionType: ArtistConnection,
  edgeType: GraphQLArtistEdge,
} = connectionDefinitions({
  name: "Artist",
  nodeType: GraphQLArtist,
});

export const {
  connectionType: EventConnection,
  edgeType: GraphQLEventEdge,
} = connectionDefinitions({
  name: "Event",
  nodeType: GraphQLEvent,
});

export const {
  connectionType: GoodsConnection,
  edgeType: GraphQLGoodsEdge,
} = connectionDefinitions({
  name: "Goods",
  nodeType: GraphQLGoods,
});

export const {
  connectionType: ItemConnection,
  edgeType: GraphQLItemEdge,
} = connectionDefinitions({
  name: "Item",
  nodeType: GraphQLItem,
});

class Admin {}

export const GraphQLAdmin = new GraphQLObjectType({
  name: "Admin",
  fields: {
    id: globalIdField("Admin", (admin) => ""),
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: async (root, args, { user: { id } }) =>
        await getUserById({ _id: id }),
    },
    groups: {
      type: new GraphQLNonNull(ArtistConnection),
      args: connectionArgs,
      resolve: async (root, { after, before, first, last }) => {
        const groups = await getGroups();

        return connectionFromArray([...groups], { after, before, first, last });
      },
    },
    artists: {
      type: new GraphQLNonNull(ArtistConnection),
      args: {
        groupId: {
          type: GraphQLID,
        },
        goodsId: {
          type: GraphQLID,
        },
        ...connectionArgs,
      },
      resolve: async (
        root,
        { groupId, goodsId, after, before, first, last }
      ) => {
        let group;
        if (!groupId) {
          const goods = await getGoodsById({ _id: goodsId });
          groupId = goods.artist;
          group = await getArtistById({ _id: groupId });
        }
        const artists = await getArtists({ groupId });

        if (group) artists.push(group);

        return connectionFromArray([...artists], {
          after,
          before,
          first,
          last,
        });
      },
    },
    events: {
      type: new GraphQLNonNull(EventConnection),
      args: {
        artistId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        ...connectionArgs,
      },
      resolve: async (root, { artistId, after, before, first, last }) => {
        const events = await getEvents({ artistId });

        return connectionFromArray([...events], {
          after,
          before,
          first,
          last,
        });
      },
    },
    goodsCollection: {
      type: new GraphQLNonNull(GoodsConnection),
      args: {
        artistId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        eventId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        ...connectionArgs,
      },
      resolve: async (
        root,
        { artistId, eventId, after, before, first, last }
      ) => {
        const goodsCollection = await getGoodsCollection({ artistId, eventId });

        return connectionFromArray([...goodsCollection], {
          after,
          before,
          first,
          last,
        });
      },
    },
    items: {
      type: new GraphQLNonNull(ItemConnection),
      args: {
        goodsId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        ...connectionArgs,
      },
      resolve: async (root, { goodsId, after, before, first, last }) => {
        const items = await getItems({ goodsId });

        return connectionFromArray([...items], {
          after,
          before,
          first,
          last,
        });
      },
    },
  },
  interfaces: [nodeInterface],
});

class Viewer {}

export const GraphQLViewer = new GraphQLObjectType({
  name: "Viewer",
  fields: {
    id: globalIdField("Viewer", (viewer) => ""),
    viewer: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: async (viewer, args, { user: { id } }) =>
        await getUserById({ _id: id }),
    },
    events: {
      type: new GraphQLNonNull(EventConnection),
      args: {
        artistName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        ...connectionArgs,
      },
      resolve: async (viewer, { artistName, after, before, first, last }) => {
        const events = await getEventsByArtistName({ artistName });

        return connectionFromArray([...events], {
          after,
          before,
          first,
          last,
        });
      },
    },
    event: {
      type: new GraphQLNonNull(GraphQLEvent),
      args: {
        eventId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (viewer, { eventId }) => {
        return await getEventById({ _id: eventId });
      },
    },
    goodsCollection: {
      type: new GraphQLNonNull(GoodsConnection),
      args: {
        artistName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        eventId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        ...connectionArgs,
      },
      resolve: async (
        root,
        { artistName, eventId, after, before, first, last }
      ) => {
        const artist = await getArtistByName({ name: artistName });
        if (!artist) return null;

        const goodsCollection = await getGoodsCollection({
          artistId: artist._id,
          eventId,
        });

        return connectionFromArray([...goodsCollection], {
          after,
          before,
          first,
          last,
        });
      },
    },
    goods: {
      type: new GraphQLNonNull(GraphQLGoods),
      args: {
        goodsId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (root, { goodsId }) => {
        return await getGoodsById({ _id: goodsId });
      },
    },
    items: {
      type: new GraphQLNonNull(ItemConnection),
      args: {
        goodsId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        ...connectionArgs,
      },
      resolve: async (root, { goodsId, after, before, first, last }) => {
        const items = await getItems({
          goodsId,
        });

        return connectionFromArray([...items], {
          after,
          before,
          first,
          last,
        });
      },
    },
  },
  interfaces: [nodeInterface],
});
