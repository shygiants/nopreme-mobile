import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";

import { isAdmin } from "../../db-schema/User";
import { removeArtist } from "../../db-schema/Artist";

export const RemoveArtistMutation = mutationWithClientMutationId({
  name: "RemoveArtist",
  inputFields: {
    artistId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    removedArtistId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ removedArtistId }) => toGlobalId("Artist", removedArtistId),
    },
  },
  mutateAndGetPayload: async ({ artistId }, { user: { id } }) => {
    if (!(await isAdmin({ _id: id }))) return null;

    const removedArtistId = await removeArtist({ _id: artistId });

    return { removedArtistId };
  },
});
