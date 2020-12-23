import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import Stack from "../components/Stack";
import Tabs from "../components/Tabs";
import GoodsListItem from "../containers/GoodsListItem";
import { getGoodsName } from "../utils/enum";

const styles = StyleSheet.create({
  scroll: { height: "100%", width: "100%" },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "gray",
  },
  profileText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

function Profile({ name }) {
  return (
    <Stack style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <View style={styles.circle} />
      <Text style={styles.profileText}>{name}</Text>
    </Stack>
  );
}

function ProfileHome({ navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [tabIdx, setTabIdx] = useState(0);
  const { collections } = viewer;

  function collToElem({
    node: {
      goods: { goodsId, name, img, type, numItems, fulfilled },
    },
  }) {
    return (
      <GoodsListItem
        key={goodsId}
        title={name}
        img={img.src}
        type={getGoodsName(type)}
        numItems={numItems}
        fulfilled={fulfilled}
        onPress={() =>
          navigation.push("GoodsDetail", {
            goodsId,
          })
        }
      />
    );
  }

  const collectingGoods = collections.edges
    .filter(
      ({
        node: {
          goods: { fulfilled },
        },
      }) => fulfilled < 1
    )
    .map(collToElem);
  const collectedGoods = collections.edges
    .filter(
      ({
        node: {
          goods: { fulfilled },
        },
      }) => fulfilled === 1
    )
    .map(collToElem);

  function getTabContent() {
    switch (tabIdx) {
      case 0:
        return collectingGoods;
      case 1:
        return collectedGoods;
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.scroll}>
        <Stack
          style={{
            gap: 10,
            padding: 16,
          }}
        >
          <Profile name={viewer.viewer.name} />
          <Tabs
            tabTitles={[
              `${langCtx.dictionary.collecting} ${collectingGoods.length}`,
              `${langCtx.dictionary.collected} ${collectedGoods.length}`,
            ]}
            tabIdx={tabIdx}
            onTabChange={setTabIdx}
          />
          {getTabContent()}
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

const FragmentContainer = createFragmentContainer(ProfileHome, {
  viewer: graphql`
    fragment ProfileHome_viewer on Viewer {
      id
      viewer {
        id
        userId
        name
      }
      collections(
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "ProfileHome_collections") {
        edges {
          node {
            id
            collecting
            goods {
              id
              goodsId
              name
              img {
                id
                src
              }
              type
              numItems
              fulfilled
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
    query ProfileHomeQuery {
      viewer {
        ...ProfileHome_viewer
      }
    }
  `
);
