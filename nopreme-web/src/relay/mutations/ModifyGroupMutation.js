import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyGroupMutation($input: ModifyGroupInput!) {
    modifyGroup(input: $input) {
      groupEdge {
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

async function commit(environment, { groupId, name, birthday, img }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          groupId,
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
