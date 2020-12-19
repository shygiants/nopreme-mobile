import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddGoodsMutation($input: AddGoodsInput!) {
    addGoods(input: $input) {
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
  { artistId, eventId, name, type, img, width, height },
  adminId
) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          artistId,
          eventId,
          name,
          type,
          img,
          width,
          height,
        },
      },
      configs: [
        {
          type: "RANGE_ADD",
          parentID: adminId,
          connectionInfo: [
            {
              key: "EventEditor_goodsCollection",
              rangeBehavior: "append",
              filters: { artistId, eventId },
            },
          ],
          edgeName: "goodsEdge",
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
