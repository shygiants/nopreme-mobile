import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

import Box from "../../components/Box";
import Button from "../../components/Button";
import { Table } from "../../components/Table";
import AddEventMutation from "../../relay/mutations/AddEventMutation";
import ModifyEventMutation from "../../relay/mutations/ModifyEventMutation";
import RemoveEventMutation from "../../relay/mutations/RemoveEventMutation";
import EventTypes from "../../assets/enum/eventTypes.json";

function ArtistEditor({
  relay,
  router,
  match: {
    params: { groupId },
  },
  admin,
}) {
  console.log(admin);

  async function addEvent({ name, date, type, img }) {
    console.log({ name, date, type, img });
    const resp = await AddEventMutation.commit(
      relay.environment,
      { artistId: groupId, name, date, type, img },
      admin.id
    );
  }

  async function modifyEvent({ eventId, name, date, type, img }) {
    console.log({ eventId, name, date, type, img });

    const resp = await ModifyEventMutation.commit(relay.environment, {
      eventId,
      name,
      date,
      type,
      img,
    });
  }

  async function removeEvent({ eventId }) {
    console.log({ eventId });

    const resp = await RemoveEventMutation.commit(
      relay.environment,
      {
        artistId: groupId,
        eventId,
      },
      admin.id
    );
  }

  return (
    <Box pad={{ horizontal: "16px" }}>
      <h1>이벤트</h1>
      <Box direction="row">
        <Button onClick={() => router.go(-1)}>위로</Button>
        <Box width="4px" />
        <Button onClick={() => router.replace(`/groups/${groupId}/artists`)}>
          아티스트
        </Button>
      </Box>

      <Table
        keys={["eventId"]}
        columns={[
          { property: "img", header: "이미지", type: "image" },
          { property: "name", header: "이름", type: "text" },
          { property: "date", header: "날짜", type: "date" },
          {
            property: "type",
            header: "타입",
            type: "option",
            options: EventTypes,
          },
        ]}
        data={admin.events.edges.map(({ node }) => node)}
        onAdd={(add) => addEvent({ ...add, img: add.img.imageId })}
        onEdit={(edit) =>
          modifyEvent({
            ...edit,
            img: edit.img.imageId,
          })
        }
        onRemove={removeEvent}
        onRowClick={({ eventId }) =>
          router.push(`/events/${eventId}/${groupId}`)
        }
      />
    </Box>
  );
}

export default createFragmentContainer(ArtistEditor, {
  admin: graphql`
    fragment ArtistEditor_admin on Admin
    @argumentDefinitions(
      artistId: { type: "ID!" } # Required argument
    ) {
      id
      user {
        id
        name
      }
      events(
        artistId: $artistId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "ArtistEditor_events", filters: ["artistId"]) {
        edges {
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
  `,
});
