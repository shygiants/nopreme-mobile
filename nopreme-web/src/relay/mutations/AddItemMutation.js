import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddItemMutation($input: AddItemInput!) {
    addItem(input: $input) {
      itemEdge {
        cursor
        node {
          id
          itemId
          idx
          artist {
            id
            name
            birthday
          }
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

async function commit(environment, { goodsId, artistId, idx, img }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          goodsId,
          artistId,
          idx,
          img,
        },
      },
      configs: [
        {
          type: "RANGE_ADD",
          parentID: adminId,
          connectionInfo: [
            {
              key: "GoodsEditor_items",
              rangeBehavior: "append",
              filters: { goodsId },
            },
          ],
          edgeName: "itemEdge",
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
