import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation RemoveEventMutation($input: RemoveEventInput!) {
    removeEvent(input: $input) {
      removedEventId
    }
  }
`;

async function commit(environment, { eventId, artistId }, adminId) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          eventId,
        },
      },
      configs: [
        {
          type: "RANGE_DELETE",
          parentID: adminId,
          connectionKeys: [
            {
              key: "ArtistEditor_events",
              filters: { artistId },
            },
          ],
          pathToConnection: ["admin", "events"],
          deletedIDFieldName: "removedEventId",
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
