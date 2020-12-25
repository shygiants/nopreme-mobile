import React from "react";
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

import EventListItem from "../containers/EventListItem";

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

function EventList({ navigation, viewer }) {
  const { events } = viewer;
  const window = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListEmptyComponent={() => <Text>EMPTY</Text>}
        ListFooterComponent={() => <View style={{ height: 32 }} />}
        style={{ width: window.width, padding: 16 }}
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
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
