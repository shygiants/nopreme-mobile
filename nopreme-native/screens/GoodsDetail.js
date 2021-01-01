import React, { useContext, useState, useEffect } from "react";
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
import OptionModal from "../components/OptionModal";
import ItemCard, { Padding } from "../containers/ItemCard";
import AddCollectionMutation from "../relay/mutations/AddCollectionMutation";
import UpdateCollectionMutation from "../relay/mutations/UpdateCollectionMutation";

import { CommonActions } from "@react-navigation/native";

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

export const INTENTS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
};

function GoodsDetail({ relay, navigation, route, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [tabIdx, setTabIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const { goods, items, collection } = viewer;
  const aspectRatio = goods.width / goods.height;

  function buildParams(edges) {
    return Object.fromEntries(
      edges.map(({ node: { item: { itemId }, num } }) => [itemId, num])
    );
  }

  function pickItems(intent) {
    navigation.push("ItemPicker", {
      screen: "PickWish",
      params: {
        goodsId: goods.goodsId,
        wishes: buildParams(collection.wishes.edges),
        posessions: buildParams(collection.posessions.edges),
        intent,
      },
    });
  }

  function dispatchUpdateEvent() {
    let parent = navigation;
    let root;
    do {
      root = parent;
      parent = parent.dangerouslyGetParent();
    } while (parent !== undefined);

    // TODO: Refetch more
    const inc = ["ProfileHome", "EventDetail"];

    function getScreens(root) {
      return root.routes
        .map((route) => {
          if (route.state) {
            return getScreens(route.state);
          } else {
            return inc.includes(route.name) ? [route.key] : [];
          }
        })
        .reduce((acc, curr) => acc.concat(curr), []);
    }

    const screens = getScreens(root.dangerouslyGetState());

    screens.forEach((screen) =>
      navigation.dispatch({
        ...CommonActions.setParams({ update: true }),
        source: screen,
      })
    );
  }

  useEffect(() => {
    if (route.params.wishes && route.params.posessions) {
      if (route.params.intent === INTENTS.ADD) {
        AddCollectionMutation.commit(relay.environment, {
          goodsId: goods.goodsId,
          wishes: route.params.wishes,
          posessions: route.params.posessions,
        }).then(dispatchUpdateEvent);
      } else if (route.params.intent === INTENTS.UPDATE) {
        UpdateCollectionMutation.commit(relay.environment, {
          goodsId: goods.goodsId,
          wishes: route.params.wishes,
          posessions: route.params.posessions,
        }).then(dispatchUpdateEvent);
      }
    }
  }, []);

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

  const options = [
    {
      title: langCtx.dictionary.reportIncorrect,
      onSelect: () => console.log("report"),
    },
  ];

  if (collection.collecting)
    options.splice(0, 0, {
      title: langCtx.dictionary.updateCollection,
      onSelect: () => pickItems(INTENTS.UPDATE),
    });

  return (
    <ImgBGScroll
      navigation={navigation}
      imgSrc={goods.img.src}
      headerTitle={goods.name}
      onOptionPress={() => setModalVisible(true)}
      enableFloatingActionButton={collection.collecting}
      FABTitle="교환"
      onFABPressed={() => console.log("exchange")}
    >
      <OptionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        options={options}
      />

      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <View style={{ flexDirection: "row" }}>
          <Badge text={getGoodsName(goods.type)} />
        </View>
        <Text style={styles.titleText}>{goods.name}</Text>
        <Text style={styles.eventText}>{goods.event.name}</Text>

        {collection.collecting || (
          <View style={{ flexDirection: "row" }}>
            <Button onPress={() => pickItems(INTENTS.ADD)}>
              {langCtx.dictionary.collect}
            </Button>
          </View>
        )}
        {collection.collecting || (
          <Text
            style={styles.numItemsText}
          >{`${items.edges.length} ${langCtx.dictionary.ea}`}</Text>
        )}

        {collection.collecting && (
          <Tabs
            tabTitles={[
              `${langCtx.dictionary.wish} ${wishCards.length}`,
              `${langCtx.dictionary.posession} ${posessionCards.length}`,
              `${langCtx.dictionary.total} ${items.edges.length}`,
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
      goods(goodsId: $goodsId) {
        id
        goodsId
        name
        type
        img {
          id
          src
        }
        event {
          id
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
              name
            }
            idx
            img {
              id
              src
            }
          }
        }
      }
      collection(goodsId: $goodsId) {
        id
        collecting
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
