import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddGoodsReportMutation($input: AddGoodsReportInput!) {
    addGoodsReport(input: $input) {
      goodsReportEdge {
        cursor
        node {
          id
          reporter {
            id
            userId
            name
          }
          goods {
            id
            goodsId
            name
          }
          contents
        }
      }
    }
  }
`;

async function commit(environment, { goodsId, contents }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          goodsId,
          contents,
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
