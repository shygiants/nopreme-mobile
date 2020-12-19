import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation RemoveArtistMutation($input: RemoveArtistInput!) {
    removeArtist(input: $input) {
      removedArtistId
    }
  }
`;

async function commit(environment, { artistId, groupId }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          artistId,
        },
      },
      configs: [
        {
          type: "RANGE_DELETE",
          parentID: adminId,
          connectionKeys: [
            {
              key: "GroupEditor_artists",
              filters: { groupId },
            },
          ],
          pathToConnection: ["admin", "artists"],
          deletedIDFieldName: "removedArtistId",
        },
      ],
      onCompleted: resolve,
      onError: reject,
    });
  });

  console.log(response);

  return response;
}

export default { commit };
