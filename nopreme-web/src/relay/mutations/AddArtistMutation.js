import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddArtistMutation($input: AddArtistInput!) {
    addArtist(input: $input) {
      artistEdge {
        cursor
        node {
          id
          artistId
          name
          birthday
          img {
            id
            imageId
            src
          }
        }
      }
    }
  }
`;

async function commit(environment, { groupId, name, birthday, img }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          groupId,
          name,
          birthday,
          img,
        },
      },
      configs: [
        {
          type: "RANGE_ADD",
          parentID: adminId,
          connectionInfo: [
            {
              key: "GroupEditor_artists",
              rangeBehavior: "append",
              filters: { groupId },
            },
          ],
          edgeName: "artistEdge",
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
