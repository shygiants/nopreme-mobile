import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLArtistEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { getArtists, addArtist } from "../../db-schema/Artist";
import { strToDate } from "../../utils/date";

export const AddArtistMutation = mutationWithClientMutationId({
  name: "AddArtist",
  inputFields: {
    groupId: {
      type: new GraphQLNonNull(GraphQLID),
    },
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
    artistEdge: {
      type: new GraphQLNonNull(GraphQLArtistEdge),
      resolve: async ({ artist: { _id, name, birthday, img }, groupId }) => {
        const artists = await getArtists({ groupId });

        const artistIds = artists.map((artist) => artist._id.toString());
        const currArtistId = _id.toString();

        return {
          cursor: cursorForObjectInConnection([...artistIds], currArtistId),
          node: { _id, name, birthday, img },
        };
      },
    },
  },
  mutateAndGetPayload: async (
    { groupId, name, birthday, img },
    { user: { id } }
  ) => {
    // TODO: handle not authorized error
    if (!(await isAdmin({ _id: id }))) return null;

    const artist = await addArtist({
      belongsTo: [groupId],
      name,
      birthday: strToDate(birthday),
      img: img && [img],
    });

    return { artist, groupId };
  },
});
