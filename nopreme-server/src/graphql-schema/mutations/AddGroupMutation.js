import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLArtistEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { addGroup, getGroups } from "../../db-schema/Artist";
import { strToDate } from "../../utils/date";

export const AddGroupMutation = mutationWithClientMutationId({
  name: "AddGroup",
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLString),
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
  mutateAndGetPayload: async ({ name, birthday, img }, { user: { id } }) => {
    // TODO: handle not authorized error
    if (!(await isAdmin({ _id: id }))) return null;

    return await addGroup({
      name,
      birthday: strToDate(birthday),
      img: img && [img],
    });
  },
});
