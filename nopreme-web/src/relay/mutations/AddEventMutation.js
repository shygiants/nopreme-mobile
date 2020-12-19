import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddEventMutation($input: AddEventInput!) {
    addEvent(input: $input) {
      eventEdge {
        cursor
        node {
          id
          eventId
          name
          date
          type
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

async function commit(
  environment,
  { artistId, name, date, type, img },
  adminId
) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          artistId,
          name,
          date,
          type,
          img,
        },
      },
      configs: [
        {
          type: "RANGE_ADD",
          parentID: adminId,
          connectionInfo: [
            {
              key: "ArtistEditor_events",
              rangeBehavior: "append",
              filters: { artistId },
            },
          ],
          edgeName: "eventEdge",
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
