import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import SortButton from "../components/SortButton";
import OptionModal from "../components/OptionModal";
import EventListItem from "../containers/EventListItem";

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 16,
  },
});

function gap({ width, height }) {
  return () => <View style={{ width, height }} />;
}

function EventList({ navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { events } = viewer;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OptionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        options={[
          {
            title: langCtx.dictionary.latest,
            onSelect: () => console.log("sort"),
          },
        ]}
      />
      <FlatList
        data={events.edges}
        keyExtractor={(item) => item.node.eventId}
        renderItem={({
          item: {
            node: { eventId, name, img, type, numGoods },
          },
        }) => (
          <EventListItem
            name={name}
            type={type}
            img={img.src}
            numGoods={numGoods}
            onPress={() =>
              navigation.push("EventDetail", {
                eventId,
              })
            }
          />
        )}
        style={styles.container}
        ListHeaderComponent={() => (
          <View style={{ paddingTop: 16 }}>
            <SortButton
              title={langCtx.dictionary.latest}
              onPress={() => setModalVisible(true)}
            />
          </View>
        )}
        ListFooterComponent={gap({ height: 16 })}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={() => <Text>EMPTY</Text>}
      />
    </SafeAreaView>
  );
}

const FragmentContainer = createFragmentContainer(EventList, {
  viewer: graphql`
    fragment EventList_viewer on Viewer
    @argumentDefinitions(eventType: { type: "String" }) {
      id
      events(
        artistName: "IZ*ONE"
        eventType: $eventType
        first: 2147483647 # max GraphQLInt
      )
        @connection(
          key: "EventList_events"
          filters: ["artistName", "eventType"]
        ) {
        edges {
          node {
            id
            eventId
            name
            date
            type
            img {
              id
              imageId
              src
            }
            numGoods(artistName: "IZ*ONE")
          }
        }
      }
    }
  `,
});

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query EventListQuery($type: String) {
      viewer {
        ...EventList_viewer @arguments(eventType: $type)
      }
    }
  `
);
