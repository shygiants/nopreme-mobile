import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyItemMutation($input: ModifyItemInput!) {
    modifyItem(input: $input) {
      itemEdge {
        cursor
        node {
          id
          itemId
          artist {
            id
            artistId
            name
          }
          idx
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

async function commit(environment, { itemId, artistId, idx, img }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          itemId,
          artistId,
          idx,
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
