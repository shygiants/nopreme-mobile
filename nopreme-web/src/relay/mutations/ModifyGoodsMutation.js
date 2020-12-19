import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyGoodsMutation($input: ModifyGoodsInput!) {
    modifyGoods(input: $input) {
      goodsEdge {
        cursor
        node {
          id
          goodsId
          name
          type
          img {
            id
            imageId
            src
          }
          width
          height
        }
      }
    }
  }
`;

async function commit(
  environment,
  { goodsId, name, type, img, width, height }
) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          goodsId,
          name,
          type,
          img,
          width,
          height,
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
