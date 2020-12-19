import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import { getGoodsName } from "../utils/enum";
import ImgBGScroll from "../components/ImgBGScroll";
import Stack from "../components/Stack";
import Badge from "../components/Badge";
import ItemCard from "../containers/ItemCard";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 20,
    color: "#555555",
  },
  collectButton: {
    backgroundColor: "#7755CC",
    paddingVertical: 8,
    paddingHorizontal: 27,
    borderRadius: 18,
  },
  collectButtonText: {
    color: "white",
    fontSize: 16,
  },
  itemList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

function GoodsDetail({ navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const { goods, items } = viewer;
  return (
    <ImgBGScroll
      navigation={navigation}
      imgSrc={goods.img.src}
      headerTitle={goods.name}
    >
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <View style={{ flexDirection: "row" }}>
          <Badge text={getGoodsName(goods.type)} />
        </View>
        <Text style={styles.titleText}>{goods.name}</Text>
        <Text style={styles.eventText}>{goods.event.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.collectButton}>
            <Text style={styles.collectButtonText}>
              {langCtx.dictionary.collect}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{ fontSize: 16, color: "#333333" }}
        >{`${items.edges.length} 종`}</Text>

        <Stack style={styles.itemList}>
          {items.edges.map(
            ({
              node: {
                itemId,
                artist: [{ name }],
                idx,
                img: { src },
              },
            }) => (
              <ItemCard
                key={itemId}
                img={src}
                aspectRatio={goods.width / goods.height}
              />
            )
          )}
        </Stack>
      </Stack>
    </ImgBGScroll>
  );
}

const FragmentContainer = createFragmentContainer(GoodsDetail, {
  viewer: graphql`
    fragment GoodsDetail_viewer on Viewer
    @argumentDefinitions(goodsId: { type: "ID!" }) {
      id
      viewer {
        id
        userId
        name
      }
      goods(goodsId: $goodsId) {
        id
        goodsId
        name
        type
        img {
          id
          imageId
          src
        }
        event {
          id
          eventId
          name
        }
        width
        height
      }
      items(
        goodsId: $goodsId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "GoodsDetail_items", filters: ["goodsId"]) {
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

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query GoodsDetailQuery($goodsId: ID!) {
      viewer {
        ...GoodsDetail_viewer @arguments(goodsId: $goodsId)
      }
    }
  `
);
