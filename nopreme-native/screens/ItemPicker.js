import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";
import { StatusBar } from "expo-status-bar";

import { createQueryRenderer } from "../relay";
import Grid from "../components/Grid";
import Progress from "../components/Progress";
import SelectionIndicator from "../components/SelectionIndicator";
import Counter from "../components/Counter";
import HeaderButton from "../components/HeaderButton";
import ItemCard from "../containers/ItemCard";
import { INTENTS } from "./GoodsDetail";
import { LanguageContext } from "../contexts/LanguageContext";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
});

function ItemPicker({ navigation, route, viewer }) {
  const langCtx = useContext(LanguageContext);
  const { items, goods } = viewer;

  function forwardable() {
    return Object.entries(selected).some(([_, count]) => count > 0);
  }

  function pickWish() {
    return route.name === "PickWish";
  }

  function initialSelected() {
    if (route.params.intent === INTENTS.UPDATE) {
      if (pickWish() && route.params.wishes) {
        return route.params.wishes;
      } else if (!pickWish() && route.params.posessions) {
        return route.params.posessions;
      }
    }

    return Object.fromEntries(
      items.edges.map(({ node: { itemId } }) => [itemId, 0])
    );
  }

  const [selected, setSelected] = useState(initialSelected());
  const [focus, setFocus] = useState(null);

  function isWish(itemId) {
    return route.params.wishes && route.params.wishes[itemId] > 0;
  }

  useEffect(
    () =>
      navigation.setOptions({
        title: pickWish()
          ? langCtx.dictionary.selectWishesTitle
          : langCtx.dictionary.selectPosessionsTitle,
        headerBackImage: ({ tintColor }) => (
          <HeaderButton
            name={pickWish() ? "md-close" : "md-arrow-back"}
            style={{ color: tintColor }}
          />
        ),
        headerRight: ({ tintColor }) => (
          <HeaderButton
            disabled={!forwardable()}
            name={pickWish() ? "md-arrow-forward" : "md-checkmark"}
            style={{ color: tintColor }}
            onPress={async () => {
              if (pickWish()) {
                navigation.push("PickPosession", {
                  goodsId: goods.goodsId,
                  wishes: selected,
                  posessions: route.params.posessions,
                  intent: route.params.intent,
                });
              } else {
                navigation.navigate("GoodsDetail", {
                  goodsId: goods.goodsId,
                  wishes: route.params.wishes,
                  posessions: selected,
                  intent: route.params.intent,
                });
              }
            }}
          />
        ),
      }),
    [selected]
  );

  function getItemById(id) {
    return items.edges.find(({ node: { itemId } }) => itemId === id);
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 32,
            paddingBottom: 120,
          }}
        >
          <Progress
            steps={[
              langCtx.dictionary.selectWishes,
              langCtx.dictionary.selectPosessions,
            ]}
            currIdx={pickWish() ? 0 : 1}
          />
          <Grid style={{ gap: 10 }} numCross={3}>
            {items.edges.map(({ node: { itemId, img: { src } } }) => (
              <SelectionIndicator
                key={itemId}
                focus={itemId === focus}
                onPress={() => {
                  setFocus(itemId);
                  if (selected[itemId] === 0)
                    setSelected({ ...selected, [itemId]: 1 });
                }}
                numSelected={selected[itemId]}
                wish={!pickWish() && isWish(itemId)}
              >
                <ItemCard img={src} aspectRatio={goods.width / goods.height} />
              </SelectionIndicator>
            ))}
          </Grid>
        </View>
      </ScrollView>
      {focus && (
        <Counter
          name={`${getItemById(focus).node.artist[0].name} ${
            getItemById(focus).node.idx + 1
          }`}
          count={selected[focus]}
          onAdd={() =>
            setSelected({ ...selected, [focus]: selected[focus] + 1 })
          }
          onSub={() => {
            const newCount = selected[focus] - 1;
            setSelected({ ...selected, [focus]: newCount });
            if (newCount === 0) setFocus(null);
          }}
        />
      )}
    </View>
  );
}

const FragmentContainer = createFragmentContainer(ItemPicker, {
  viewer: graphql`
    fragment ItemPicker_viewer on Viewer
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
      ) @connection(key: "ItemPicker_items", filters: ["goodsId"]) {
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
    query ItemPickerQuery($goodsId: ID!) {
      viewer {
        ...ItemPicker_viewer @arguments(goodsId: $goodsId)
      }
    }
  `
);
