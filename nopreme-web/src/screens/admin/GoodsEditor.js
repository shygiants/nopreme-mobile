import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

import Box from "../../components/Box";
import Button from "../../components/Button";
import { Table } from "../../components/Table";
import AddItemMutation from "../../relay/mutations/AddItemMutation";
import ModifyItemMutation from "../../relay/mutations/ModifyItemMutation";
import RemoveItemMutation from "../../relay/mutations/RemoveItemMutation";

function GoodsEditor({
  relay,
  router,
  match: {
    params: { goodsId },
  },
  admin,
}) {
  console.log(admin);

  async function addItem({ artistId, idx, img }) {
    console.log({ idx, img });
    const resp = await AddItemMutation.commit(
      relay.environment,
      { goodsId, idx, img, artistId },
      admin.id
    );
  }

  async function modifyItem({ itemId, artistId, idx, img }) {
    console.log({ itemId, artistId, idx, img });

    const resp = await ModifyItemMutation.commit(relay.environment, {
      itemId,
      artistId,
      idx,
      img,
    });
  }

  async function removeItem({ itemId }) {
    console.log({ itemId });

    const resp = await RemoveItemMutation.commit(
      relay.environment,
      {
        goodsId,
        itemId,
      },
      admin.id
    );
  }

  return (
    <Box pad={{ horizontal: "16px" }}>
      <h1>아이템</h1>
      <Button onClick={() => router.go(-1)}>위로</Button>
      <Table
        keys={["itemId"]}
        columns={[
          { property: "img", header: "이미지", type: "image" },
          {
            property: "artist.0.artistId",
            header: "아티스트",
            type: "option",
            options: admin.artists.edges.map(({ node }) => ({
              name: node.name,
              value: node.artistId,
            })),
          },
          { property: "idx", header: "IDX", type: "number" },
        ]}
        data={admin.items.edges.map(({ node }) => node)}
        onAdd={(add) =>
          addItem({
            ...add,
            img: add.img.imageId,
            artistId: add["artist.0.artistId"],
          })
        }
        onEdit={(edit) =>
          modifyItem({
            ...edit,
            img: edit.img.imageId,
            artistId: edit["artist.0.artistId"],
          })
        }
        onRemove={removeItem}
        onRowClick={() => console.log("click")}
      />
    </Box>
  );
}

export default createFragmentContainer(GoodsEditor, {
  admin: graphql`
    fragment GoodsEditor_admin on Admin
    @argumentDefinitions(goodsId: { type: "ID!" }) {
      id
      user {
        id
        name
      }
      artists(
        goodsId: $goodsId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "GoodsEditor_artists", filters: ["goodsId"]) {
        edges {
          node {
            id
            artistId
            name
            birthday
          }
        }
      }
      items(
        goodsId: $goodsId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "GoodsEditor_items", filters: ["goodsId"]) {
        edges {
          node {
            id
            itemId
            artist {
              id
              artistId
              name
            }
            idx
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
