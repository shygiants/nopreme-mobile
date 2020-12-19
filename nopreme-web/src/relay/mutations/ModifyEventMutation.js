import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation ModifyEventMutation($input: ModifyEventInput!) {
    modifyEvent(input: $input) {
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

async function commit(environment, { eventId, name, date, type, img }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          eventId,
          name,
          date,
          type,
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
