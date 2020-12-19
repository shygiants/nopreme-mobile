import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation RemoveItemMutation($input: RemoveItemInput!) {
    removeItem(input: $input) {
      removedItemId
    }
  }
`;

async function commit(environment, { goodsId, itemId }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          itemId,
        },
      },
      configs: [
        {
          type: "RANGE_DELETE",
          parentID: adminId,
          connectionKeys: [
            {
              key: "GoodsEditor_items",
              filters: { goodsId },
            },
          ],
          pathToConnection: ["admin", "items"],
          deletedIDFieldName: "removedItemId",
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
