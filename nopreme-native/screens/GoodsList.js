import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  SectionList,
} from "react-native";
import { graphql, createFragmentContainer } from "react-relay";
import { LinearGradient } from "expo-linear-gradient";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import SortButton from "../components/SortButton";
import OptionModal from "../components/OptionModal";
import GoodsListItem from "../containers/GoodsListItem";

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 8,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

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

function GoodsList({ navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { goodsCollection } = viewer;

  // TODO: navigation.setParams

  const sections = [];
  goodsCollection.edges.forEach(({ node }) => {
    const {
      event: { eventId, name },
    } = node;

    const found = sections.find((event) => event.eventId === eventId);

    if (found) {
      found.data.push(node);
    } else {
      sections.push({ eventId, name, data: [node] });
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
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
        sections={sections}
        keyExtractor={(item) => item.goodsId}
        renderSectionHeader={({ section: { name } }) => (
          <SectionHeader title={name} />
        )}
        renderItem={({
          item: { goodsId, name, img, type, numItems, collecting, fulfilled },
        }) => (
          <GoodsListItem
            name={name}
            type={type}
            img={img.src}
            numItems={numItems}
            collecting={collecting}
            fulfilled={fulfilled}
            onPress={() =>
              navigation.push("GoodsDetail", {
                goodsId,
              })
            }
          />
        )}
        style={styles.container}
        ListHeaderComponent={() => (
          <View style={{ paddingTop: 16 }}>
            <SortButton
              title={langCtx.dictionary.latestEvent}
              onPress={() => setModalVisible(true)}
            />
          </View>
        )}
        ListFooterComponent={gap({ height: 16 })}
        SectionSeparatorComponent={({ leadingItem }) => (
          <View style={{ height: leadingItem ? 24 : 0 }} />
        )}
        ItemSeparatorComponent={gap({ height: 10 })}
        ListEmptyComponent={() => <Text>EMPTY</Text>}
      />
    </SafeAreaView>
  );
}

const FragmentContainer = createFragmentContainer(GoodsList, {
  viewer: graphql`
    fragment GoodsList_viewer on Viewer
    @argumentDefinitions(goodsType: { type: "String" }) {
      id
      goodsCollection(
        artistName: "IZ*ONE"
        goodsType: $goodsType
        first: 2147483647 # max GraphQLInt
      )
        @connection(
          key: "BrowseHome_goodsCollection"
          filters: ["artistName", "goodsType"]
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
            numItems
            collecting
            fulfilled
            event {
              id
              eventId
              name
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
    query GoodsListQuery($type: String) {
      viewer {
        ...GoodsList_viewer @arguments(goodsType: $type)
      }
    }
  `
);
