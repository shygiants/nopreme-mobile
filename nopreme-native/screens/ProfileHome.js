import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { graphql, createRefetchContainer } from "react-relay";

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

function ProfileHome({ navigation, relay, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [tabIdx, setTabIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { collections } = viewer;

  function collToElem({
    node: {
      fulfilled,
      goods: { goodsId, name, img, type, numItems },
    },
  }) {
    return (
      <GoodsListItem
        key={goodsId}
        title={name}
        img={img.src}
        type={getGoodsName(type)}
        collecting
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
    .filter(({ node: { fulfilled } }) => fulfilled < 1)
    .map(collToElem);
  const collectedGoods = collections.edges
    .filter(({ node: { fulfilled } }) => fulfilled === 1)
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
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              relay.refetch(null, null, () => setRefreshing(false))
            }
          />
        }
      >
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
          <Stack style={{ gap: 10 }}>{getTabContent()}</Stack>
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

const FragmentContainer = createRefetchContainer(
  ProfileHome,
  {
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
              fulfilled
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
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query ProfileHomeQuery {
      viewer {
        ...ProfileHome_viewer
      }
    }
  `
);

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
