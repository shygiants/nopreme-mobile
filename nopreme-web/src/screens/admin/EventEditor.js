import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

import Box from "../../components/Box";
import Button from "../../components/Button";
import { Table } from "../../components/Table";
import AddGoodsMutation from "../../relay/mutations/AddGoodsMutation";
import ModifyGoodsMutation from "../../relay/mutations/ModifyGoodsMutation";
import RemoveGoodsMutation from "../../relay/mutations/RemoveGoodsMutation";
import GoodsTypes from "../../assets/enum/goodsTypes.json";

function EventEditor({
  relay,
  router,
  match: {
    params: { eventId, artistId },
  },
  admin,
}) {
  console.log(admin);

  async function addGoods({ name, type, img, width, height }) {
    console.log({ name, type, img, width, height });
    const resp = await AddGoodsMutation.commit(
      relay.environment,
      { artistId, eventId, name, type, img, width, height },
      admin.id
    );
  }

  async function modifyGoods({ goodsId, name, type, img, width, height }) {
    console.log({ goodsId, name, type, img, width, height });

    const resp = await ModifyGoodsMutation.commit(relay.environment, {
      goodsId,
      name,
      type,
      img,
      width,
      height,
    });
  }

  async function removeGoods({ goodsId }) {
    console.log({ goodsId });

    const resp = await RemoveGoodsMutation.commit(
      relay.environment,
      {
        artistId,
        eventId,
        goodsId,
      },
      admin.id
    );
  }

  console.log(GoodsTypes);

  return (
    <Box pad={{ horizontal: "16px" }}>
      <h1>굿즈</h1>
      <Button onClick={() => router.go(-1)}>위로</Button>
      <Table
        keys={["goodsId"]}
        columns={[
          { property: "img", header: "이미지", type: "image" },
          { property: "name", header: "이름", type: "text" },
          {
            property: "type",
            header: "타입",
            type: "option",
            options: GoodsTypes,
          },
          { property: "width", header: "너비", type: "number" },
          { property: "height", header: "높이", type: "number" },
        ]}
        data={admin.goodsCollection.edges.map(({ node }) => node)}
        onAdd={(add) => addGoods({ ...add, img: add.img.imageId })}
        onEdit={(edit) =>
          modifyGoods({
            ...edit,
            img: edit.img.imageId,
          })
        }
        onRemove={removeGoods}
        onRowClick={({ goodsId }) => router.push(`/goods/${goodsId}`)}
      />
    </Box>
  );
}

export default createFragmentContainer(EventEditor, {
  admin: graphql`
    fragment EventEditor_admin on Admin
    @argumentDefinitions(artistId: { type: "ID!" }, eventId: { type: "ID!" }) {
      id
      user {
        id
        name
      }
      goodsCollection(
        artistId: $artistId
        eventId: $eventId
        first: 2147483647 # max GraphQLInt
      )
        @connection(
          key: "EventEditor_goodsCollection"
          filters: ["artistId", "eventId"]
        ) {
        edges {
          node {
            id
            goodsId
            name
            type
            img {
              id
              imageId
              src
            }
            width
            height
          }
        }
      }
    }
  `,
});
