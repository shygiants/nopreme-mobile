import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

import Box from "../../components/Box";
import Button from "../../components/Button";
import { Table } from "../../components/Table";
import AddArtistMutation from "../../relay/mutations/AddArtistMutation";
import ModifyArtistMutation from "../../relay/mutations/ModifyArtistMutation";
import RemoveArtistMutation from "../../relay/mutations/RemoveArtistMutation";

function GroupEditor({
  relay,
  router,
  match: {
    params: { groupId },
  },
  admin,
}) {
  console.log(admin);

  async function addArtist({ name, birthday, img }) {
    console.log({ name, birthday, img });
    const resp = await AddArtistMutation.commit(
      relay.environment,
      { groupId, name, birthday, img },
      admin.id
    );
  }

  async function modifyArtist({ artistId, name, birthday, img }) {
    console.log({ artistId, name, birthday, img });

    const resp = await ModifyArtistMutation.commit(relay.environment, {
      artistId,
      name,
      birthday,
      img,
    });
  }

  async function removeArtist({ artistId }) {
    console.log({ artistId });

    const resp = await RemoveArtistMutation.commit(
      relay.environment,
      {
        groupId,
        artistId,
      },
      admin.id
    );
  }

  return (
    <Box pad={{ horizontal: "16px" }}>
      <h1>아티스트</h1>
      <Box direction="row">
        <Button onClick={() => router.go(-1)}>위로</Button>
        <Box width="4px" />
        <Button onClick={() => router.replace(`/groups/${groupId}/events`)}>
          이벤트
        </Button>
      </Box>

      <Table
        keys={["artistId"]}
        columns={[
          { property: "img", header: "이미지", type: "image" },
          { property: "name", header: "이름", type: "text" },
          { property: "birthday", header: "생일", type: "date" },
        ]}
        data={admin.artists.edges.map(({ node }) => node)}
        onAdd={(add) => addArtist({ ...add, img: add.img.imageId })}
        onEdit={(edit) =>
          modifyArtist({
            ...edit,
            artistId: edit.artistId,
            img: edit.img.imageId,
          })
        }
        onRemove={removeArtist}
        onRowClick={() => console.log("click")}
      />
    </Box>
  );
}

export default createFragmentContainer(GroupEditor, {
  admin: graphql`
    fragment GroupEditor_admin on Admin
    @argumentDefinitions(
      groupId: { type: "ID!" } # Required argument
    ) {
      id
      user {
        id
        name
      }
      artists(
        groupId: $groupId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "GroupEditor_artists", filters: ["groupId"]) {
        edges {
          node {
            id
            img {
              id
              imageId
              src
            }
            artistId
            name
            birthday
          }
        }
      }
    }
  `,
});
