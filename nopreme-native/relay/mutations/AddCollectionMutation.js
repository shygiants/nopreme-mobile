import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddCollectionMutation($input: AddCollectionInput!) {
    addCollection(input: $input) {
      collectionEdge {
        cursor
        node {
          id
          collecting
          goods {
            id
            goodsId
            name
          }
          user {
            id
            userId
            name
          }
          wishes(
            first: 2147483647 # max GraphQLInt
          ) @connection(key: "GoodsDetail_wishes") {
            edges {
              node {
                id
                item {
                  id
                  itemId
                  img {
                    id
                    src
                  }
                  artist {
                    id
                    name
                  }
                  idx
                }
                num
                fulfilled
              }
            }
          }
          posessions(
            first: 2147483647 # max GraphQLInt
          ) @connection(key: "GoodsDetail_posessions") {
            edges {
              node {
                id
                item {
                  id
                  itemId
                  artist {
                    id
                    name
                  }
                  idx
                  img {
                    id
                    src
                  }
                }
                num
                wished
              }
            }
          }
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
      onError: reject,
    });
  });

  console.log(response);

  return response;
}

export default { commit };
