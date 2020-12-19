import { GraphQLSchema, GraphQLObjectType } from "graphql";

import { nodeField, GraphQLViewer, GraphQLAdmin } from "./nodes";
import { getUserById } from "../db-schema/User";
import { AddGroupMutation } from "./mutations/AddGroupMutation";
import { ModifyGroupMutation } from "./mutations/ModifyGroupMutation";
import { RemoveGroupMutation } from "./mutations/RemoveGroupMutation";
import { AddArtistMutation } from "./mutations/AddArtistMutation";
import { ModifyArtistMutation } from "./mutations/ModifyArtistMutation";
import { RemoveArtistMutation } from "./mutations/RemoveArtistMutation";
import { AddEventMutation } from "./mutations/AddEventMutation";
import { ModifyEventMutation } from "./mutations/ModifyEventMutation";
import { RemoveEventMutation } from "./mutations/RemoveEventMutation";
import { AddGoodsMutation } from "./mutations/AddGoodsMutation";
import { ModifyGoodsMutation } from "./mutations/ModifyGoodsMutation";
import { RemoveGoodsMutation } from "./mutations/RemoveGoodsMutation";
import { AddItemMutation } from "./mutations/AddItemMutation";
import { ModifyItemMutation } from "./mutations/ModifyItemMutation";
import { RemoveItemMutation } from "./mutations/RemoveItemMutation";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => ({}),
    },
    admin: {
      type: GraphQLAdmin,
      resolve: () => ({}),
    },
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addGroup: AddGroupMutation,
    modifyGroup: ModifyGroupMutation,
    removeGroup: RemoveGroupMutation,
    addArtist: AddArtistMutation,
    modifyArtist: ModifyArtistMutation,
    removeArtist: RemoveArtistMutation,
    addEvent: AddEventMutation,
    modifyEvent: ModifyEventMutation,
    removeEvent: RemoveEventMutation,
    addGoods: AddGoodsMutation,
    modifyGoods: ModifyGoodsMutation,
    removeGoods: RemoveGoodsMutation,
    addItem: AddItemMutation,
    modifyItem: ModifyItemMutation,
    removeItem: RemoveItemMutation,
  },
});

export const schema = new GraphQLSchema({ query: Query, mutation: Mutation });
