import React, { useEffect, useState } from "react";
import { graphql, createFragmentContainer } from "react-relay";

import Box from "../../components/Box";
import { Table } from "../../components/Table";
import AddGroupMutation from "../../relay/mutations/AddGroupMutation";
import ModifyGroupMutation from "../../relay/mutations/ModifyGroupMutation";
import RemoveGroupMutation from "../../relay/mutations/RemoveGroupMutation";

function Home({ relay, router, admin }) {
  console.log(admin);

  async function addGroup({ name, birthday, img }) {
    console.log({ name, birthday, img });
    const resp = await AddGroupMutation.commit(
      relay.environment,
      { name, birthday, img },
      admin.id
    );
  }

  async function modifyGroup({ groupId, name, birthday, img }) {
    console.log({ groupId, name, birthday, img });

    const resp = await ModifyGroupMutation.commit(relay.environment, {
      groupId,
      name,
      birthday,
      img,
    });
  }

  async function removeGroup({ groupId }) {
    console.log({ groupId });

    const resp = await RemoveGroupMutation.commit(
      relay.environment,
      {
        groupId,
      },
      admin.id
    );
  }

  return (
    <Box pad={{ horizontal: "16px" }}>
      <h1>그룹</h1>
      <Table
        keys={["artistId"]}
        columns={[
          { property: "img", header: "이미지", type: "image" },
          { property: "name", header: "이름", type: "text" },
          { property: "birthday", header: "데뷔일", type: "date" },
        ]}
        data={admin.groups.edges.map(({ node }) => node)}
        onAdd={(add) => addGroup({ ...add, img: add.img.imageId })}
        onEdit={(edit) =>
          modifyGroup({
            ...edit,
            groupId: edit.artistId,
            img: edit.img.imageId,
          })
        }
        onRemove={({ artistId }) => removeGroup({ groupId: artistId })}
        onRowClick={({ artistId }) => router.push(`/groups/${artistId}`)}
      />
    </Box>
  );
}

export default createFragmentContainer(Home, {
  admin: graphql`
    fragment Home_admin on Admin {
      id
      user {
        id
        name
      }
      groups(
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "Home_groups") {
        edges {
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
  `,
});
