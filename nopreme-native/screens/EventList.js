import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";

import EventListItem from "../containers/EventListItem";
import Stack from "../components/Stack";

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  container: {
    padding: 16,
  },
});

function EventList({ navigation, viewer }) {
  const { events } = viewer;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
          {events.edges.map(
            ({ node: { eventId, name, img, type, numGoods } }) => (
              <EventListItem
                key={eventId}
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
            )
          )}
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

const FragmentContainer = createFragmentContainer(EventList, {
  viewer: graphql`
    fragment EventList_viewer on Viewer {
      id
      events(
        artistName: "IZ*ONE"
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "EventList_events", filters: ["artistName"]) {
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
    query EventListQuery {
      viewer {
        ...EventList_viewer
      }
    }
  `
);
