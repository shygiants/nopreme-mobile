import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

import { GraphQLArtistEdge } from "../nodes";
import { isAdmin } from "../../db-schema/User";
import { modifyArtist, getArtists } from "../../db-schema/Artist";
import { strToDate } from "../../utils/date";

export const ModifyArtistMutation = mutationWithClientMutationId({
  name: "ModifyArtist",
  inputFields: {
    artistId: {
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
    artistEdge: {
      type: new GraphQLNonNull(GraphQLArtistEdge),
      resolve: async ({ _id, name, birthday, img, belongsTo }) => {
        const artists = await getArtists({ groupId: belongsTo[0] });

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
    { artistId, name, birthday, img },
    { user: { id } }
  ) => {
    if (!(await isAdmin({ _id: id }))) return null;

    return await modifyArtist({
      _id: artistId,
      name,
      birthday: birthday && strToDate(birthday),
      img: img && [img],
    });
  },
});
