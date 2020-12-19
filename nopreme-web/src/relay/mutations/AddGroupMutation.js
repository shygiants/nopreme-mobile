import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddGroupMutation($input: AddGroupInput!) {
    addGroup(input: $input) {
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

async function commit(environment, { name, birthday, img }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          name,
          birthday,
          img,
        },
      },
      configs: [
        {
          type: "RANGE_ADD",
          parentID: adminId,
          connectionInfo: [
            {
              key: "Home_groups",
              rangeBehavior: "append",
            },
          ],
          edgeName: "groupEdge",
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
