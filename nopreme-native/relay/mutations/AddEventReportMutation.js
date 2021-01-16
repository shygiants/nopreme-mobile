import { graphql, commitMutation } from "react-relay";

const mutation = graphql`
  mutation AddEventReportMutation($input: AddEventReportInput!) {
    addEventReport(input: $input) {
      eventReportEdge {
        cursor
        node {
          id
          reporter {
            id
            userId
            name
          }
          event {
            id
            eventId
            name
          }
          contents
        }
      }
    }
  }
`;

async function commit(environment, { eventId, contents }) {
  const response = await new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables: {
        input: {
          eventId,
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
