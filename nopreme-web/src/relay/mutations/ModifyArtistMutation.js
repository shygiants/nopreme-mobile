import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyArtistMutation($input: ModifyArtistInput!) {
    modifyArtist(input: $input) {
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

async function commit(environment, { artistId, name, birthday, img }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          artistId,
          name,
          birthday,
          img,
        },
      },
      onCompleted: resolve,
      onError: reject,
    });
  });

  console.log(response);

  return response;
}

export default { commit };
