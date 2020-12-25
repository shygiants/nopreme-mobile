import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
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
    width: "100%",
    padding: 16,
  },
});

function GoodsList({ navigation, viewer }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { goodsCollection } = viewer;
  const window = useWindowDimensions();

  // TODO: navigation.setParams

  return (
    <SafeAreaView style={styles.safeArea}>
      <OptionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        options={[
          { title: "최근 이벤트 순", onSelect: () => console.log("sort") },
        ]}
      />
      <FlatList
        ListHeaderComponent={() => (
          <SortButton
            title="최근 이벤트 순"
            onPress={() => setModalVisible(true)}
          />
        )}
        ListFooterComponent={() => <View style={{ height: 32 }} />}
        ListEmptyComponent={() => <Text>EMPTY</Text>}
        style={{ width: window.width, padding: 16 }}
        data={goodsCollection.edges}
        keyExtractor={(item) => item.node.goodsId}
        renderItem={({
          item: {
            node: { goodsId, name, img, type, numItems, collecting, fulfilled },
          },
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
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
