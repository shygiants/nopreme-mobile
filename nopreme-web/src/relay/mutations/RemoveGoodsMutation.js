import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation RemoveGoodsMutation($input: RemoveGoodsInput!) {
    removeGoods(input: $input) {
      removedGoodsId
    }
  }
`;

async function commit(environment, { artistId, eventId, goodsId }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          goodsId,
        },
      },
      configs: [
        {
          type: "RANGE_DELETE",
          parentID: adminId,
          connectionKeys: [
            {
              key: "EventEditor_goodsCollection",
              filters: { artistId, eventId },
            },
          ],
          pathToConnection: ["admin", "goodsCollection"],
          deletedIDFieldName: "removedGoodsId",
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
