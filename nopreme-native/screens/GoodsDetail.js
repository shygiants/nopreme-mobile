import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import { getGoodsName } from "../utils/enum";
import ImgBGScroll from "../components/ImgBGScroll";
import Stack from "../components/Stack";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Grid from "../components/Grid";
import Tabs from "../components/Tabs";
import WishIndicator from "../components/WishIndicator";
import PosessionIndicator from "../components/PosessionIndicator";
import ProgressBar from "../components/ProgressBar";
import ItemCard, { Padding } from "../containers/ItemCard";

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
  numItemsText: { fontSize: 16, fontWeight: "bold", color: "#333333" },
});

function GoodsDetail({ navigation, route, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [tabIdx, setTabIdx] = useState(0);

  const { goods, items, collection } = viewer;
  const aspectRatio = goods.width / goods.height;

  function pickItems() {
    navigation.navigate("ItemPicker", {
      screen: "PickWish",
      params: {
        goodsId: goods.goodsId,
      },
    });
  }

  let wishCards;
  let posessionCards;
  let fulfilledRatio;
  if (collection.collecting) {
    const collectionStatus = collection.wishes.edges
      .map(({ node: { num, fulfilled } }) => ({ num, fulfilled }))
      .reduce(
        (accum, { num, fulfilled }) => ({
          num: accum.num + num,
          fulfilled: accum.fulfilled + Math.min(fulfilled, num),
        }),
        { num: 0, fulfilled: 0 }
      );
    fulfilledRatio = collectionStatus.fulfilled / collectionStatus.num;
    wishCards = collection.wishes.edges
      .map(({ node: { item, num, fulfilled } }) => ({ item, num, fulfilled }))
      .filter(({ num }) => num > 0)
      .map(({ item, num, fulfilled }) => (
        <WishIndicator key={item.itemId} numWishes={num} fulfilled={fulfilled}>
          <ItemCard img={item.img.src} aspectRatio={aspectRatio} />
        </WishIndicator>
      ));
    posessionCards = collection.posessions.edges
      .map(({ node: { item, num, wished } }) => ({ item, num, wished }))
      .filter(({ num }) => num > 0)
      .map(({ item, num, wished }) => (
        <PosessionIndicator
          key={item.itemId}
          numPosessions={num}
          wished={wished}
        >
          <ItemCard img={item.img.src} aspectRatio={aspectRatio} />
        </PosessionIndicator>
      ));
  }

  const allItemCards = items.edges.map(({ node: { itemId, img: { src } } }) => (
    <ItemCard key={itemId} img={src} aspectRatio={aspectRatio} />
  ));

  function getTabContent() {
    switch (tabIdx) {
      case 0:
        return wishCards;
      case 1:
        return posessionCards;
      case 2:
        return allItemCards;
    }
  }

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

        {collection.collecting || (
          <View style={{ flexDirection: "row" }}>
            <Button onPress={pickItems}>{langCtx.dictionary.collect}</Button>
          </View>
        )}
        {collection.collecting || (
          <Text style={styles.numItemsText}>{`${items.edges.length} 종`}</Text>
        )}

        {collection.collecting && (
          <Tabs
            tabTitles={[
              `희망 ${wishCards.length}`,
              `보유 ${posessionCards.length}`,
              `전체 ${items.edges.length}`,
            ]}
            tabIdx={tabIdx}
            onTabChange={setTabIdx}
          />
        )}
        {fulfilledRatio !== undefined && (
          <ProgressBar progress={fulfilledRatio} />
        )}
        <Grid style={{ gap: 10 }} numCross={3} padding={Padding}>
          {collection.collecting ? getTabContent() : allItemCards}
        </Grid>
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
      collection(goodsId: $goodsId) {
        id
        collecting
        goods {
          id
          goodsId
          name
        }
        user {
          id
          userId
          name
        }
        wishes(
          first: 2147483647 # max GraphQLInt
        ) @connection(key: "GoodsDetail_wishes") {
          edges {
            node {
              id
              item {
                id
                itemId
                img {
                  id
                  src
                }
                artist {
                  id
                  name
                }
                idx
              }
              num
              fulfilled
            }
          }
        }
        posessions(
          first: 2147483647 # max GraphQLInt
        ) @connection(key: "GoodsDetail_posessions") {
          edges {
            node {
              id
              item {
                id
                itemId
                artist {
                  id
                  name
                }
                idx
                img {
                  id
                  src
                }
              }
              num
              wished
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
