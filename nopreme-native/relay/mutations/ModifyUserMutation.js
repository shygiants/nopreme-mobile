import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyUserMutation($input: ModifyUserInput!) {
    modifyUser(input: $input) {
      userEdge {
        cursor
        node {
          id
          userId
          name
          profile {
            id
            imageId
            src
          }
        }
      }
    }
  }
`;

async function commit(environment, { name, profile }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          name,
          profile,
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
