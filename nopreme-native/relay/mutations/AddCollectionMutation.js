import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddCollectionMutation($input: AddCollectionInput!) {
    addCollection(input: $input) {
      collectionEdge {
        cursor
        node {
          id
          collecting
        }
      }
    }
  }
`;

function buildInput(selected) {
  return Object.entries(selected)
    .map(([itemId, num]) => ({
      itemId,
      num,
    }))
    .filter(({ num }) => num > 0);
}

async function commit(environment, { goodsId, wishes, posessions }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          goodsId,
          wishes: buildInput(wishes),
          posessions: buildInput(posessions),
        },
      },
      onCompleted: resolve,
      onError: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });

  console.log(response);

  return response;
}

export default { commit };
