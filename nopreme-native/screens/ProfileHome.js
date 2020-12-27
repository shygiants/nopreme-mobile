import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  SectionList,
} from "react-native";
import { graphql, createRefetchContainer } from "react-relay";
import { LinearGradient } from "expo-linear-gradient";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import Stack from "../components/Stack";
import Tabs from "../components/Tabs";
import HeaderButton from "../components/HeaderButton";
import GoodsListItem from "../containers/GoodsListItem";
import OptionModal from "../components/OptionModal";
import SortButton from "../components/SortButton";

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
  section: {
    paddingVertical: 8,
  },
  sectionText: {
    fontSize: 16,
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

function gap({ width, height }) {
  return () => <View style={{ width, height }} />;
}

function SectionHeader({ title }) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0)"]}
      style={styles.section}
    >
      <Text style={styles.sectionText}>{title}</Text>
    </LinearGradient>
  );
}

function ProfileHome({ navigation, route, relay, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [tabIdx, setTabIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { collections } = viewer;

  function refresh(cb) {
    setRefreshing(true);
    relay.refetch(route.params, null, () => {
      setRefreshing(false);
      if (cb) cb();
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <HeaderButton
          name="md-settings-outline"
          style={{ color: tintColor }}
          onPress={() => navigation.push("Settings")}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (route.params && route.params.update) {
      refresh(() => delete route.params.update);
    }
  }, [route.params]);

  function collToElem(item) {
    const {
      fulfilled,
      goods: { goodsId, name, img, type, numItems },
    } = item;

    return (
      <GoodsListItem
        name={name}
        img={img.src}
        type={type}
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

  function edgesToSections(edges) {
    const sections = [];
    edges.forEach(({ node }) => {
      const {
        goods: {
          event: { eventId, name },
        },
      } = node;

      const found = sections.find((event) => event.eventId === eventId);

      if (found) {
        found.data.push(node);
      } else {
        sections.push({ eventId, name, data: [node] });
      }
    });
    return sections;
  }

  const collectingGoods = collections.edges.filter(
    ({ node: { fulfilled } }) => fulfilled < 1
  );
  const collectedGoods = collections.edges.filter(
    ({ node: { fulfilled } }) => fulfilled === 1
  );

  function getTabSections() {
    switch (tabIdx) {
      case 0:
        return edgesToSections(collectingGoods);
      case 1:
        return edgesToSections(collectedGoods);
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <OptionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        options={[
          {
            title: langCtx.dictionary.latestEvent,
            onSelect: () => console.log("sort"),
          },
        ]}
      />
      <SectionList
        sections={getTabSections()}
        keyExtractor={({ goods: { goodsId } }) => goodsId}
        renderSectionHeader={({ section: { name } }) => (
          <SectionHeader title={name} />
        )}
        renderItem={({ item }) => collToElem(item)}
        style={{ paddingHorizontal: 16 }}
        ListHeaderComponent={() => (
          <Stack
            style={{
              paddingTop: 16,
              gap: 10,
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
            <SortButton
              title={langCtx.dictionary.latestEvent}
              onPress={() => setModalVisible(true)}
            />
          </Stack>
        )}
        ListFooterComponent={gap({ height: 16 })}
        SectionSeparatorComponent={({ leadingItem }) => (
          <View style={{ height: leadingItem ? 24 : 0 }} />
        )}
        ItemSeparatorComponent={gap({ height: 10 })}
        ListEmptyComponent={() => <Text>EMPTY</Text>}
        refreshing={refreshing}
        onRefresh={refresh}
      />
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
                event {
                  id
                  eventId
                  name
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
    query ProfileHomeRefetchQuery {
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
