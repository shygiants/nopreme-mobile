import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation RemoveGroupMutation($input: RemoveGroupInput!) {
    removeGroup(input: $input) {
      removedGroupId
    }
  }
`;

async function commit(environment, { groupId }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          groupId,
        },
      },
      configs: [
        {
          type: "RANGE_DELETE",
          parentID: adminId,
          connectionKeys: [
            {
              key: "Home_groups",
            },
          ],
          pathToConnection: ["admin", "groups"],
          deletedIDFieldName: "removedGroupId",
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
