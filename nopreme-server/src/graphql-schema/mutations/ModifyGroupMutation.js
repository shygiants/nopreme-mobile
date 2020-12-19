import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLArtistEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { modifyGroup, getGroups } from "../../db-schema/Artist";
import { strToDate } from "../../utils/date";

export const ModifyGroupMutation = mutationWithClientMutationId({
  name: "ModifyGroup",
  inputFields: {
    groupId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLString,
    },
    img: {
      type: GraphQLID,
    },
  },
  outputFields: {
    groupEdge: {
      type: new GraphQLNonNull(GraphQLArtistEdge),
      resolve: async ({ _id, name, birthday, img }) => {
        const groups = await getGroups();

        const groupIds = groups.map((group) => group._id.toString());
        const currGroupId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...groupIds], currGroupId),
          node: { _id, name, birthday, img },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { groupId, name, birthday, img },
    { user: { id } }
  ) => {
    if (!(await isAdmin({ _id: id }))) return null;

    return await modifyGroup({
      _id: groupId,
      name,
      birthday: birthday && strToDate(birthday),
      img: img && [img],
    });
  },
});
