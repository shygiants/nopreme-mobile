import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  View,
} from "react-native";
import { graphql, createRefetchContainer } from "react-relay";
import { StatusBar } from "expo-status-bar";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import Stack from "../components/Stack";
import IconButton from "../components/IconButton";
import EventCard from "../containers/EventCard";
import { getEventName } from "../utils/enum";

const styles = StyleSheet.create({
  scroll: { height: "100%" },
  container: { flexDirection: "column", width: "100%", padding: 16 },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventText: { fontSize: 28, fontWeight: "bold" },
});

function BrowseHome({ navigation, relay, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              relay.refetch(null, null, () => setRefreshing(false));
            }}
          />
        }
      >
        <Stack style={StyleSheet.compose(styles.container, { gap: 16 })}>
          <View style={styles.title}>
            <Text style={styles.eventText}>{langCtx.dictionary.event}</Text>
            <IconButton
              style={{ color: "#333333", paddingLeft: 64 }}
              name="md-chevron-forward"
              onPress={() => navigation.push("EventList")}
            />
          </View>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%", overflow: "visible" }}
            horizontal
          >
            <Stack style={{ gap: 10, flexDirection: "row" }}>
              {viewer.events.edges.map(
                ({
                  node: {
                    eventId,
                    name,
                    img: { src },
                    type,
                    numGoods,
                  },
                }) => (
                  <EventCard
                    key={eventId}
                    img={src}
                    title={name}
                    type={getEventName(type)}
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
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}

const FragmentContainer = createRefetchContainer(
  BrowseHome,
  {
    viewer: graphql`
      fragment BrowseHome_viewer on Viewer {
        id
        viewer {
          id
          userId
          name
        }
        events(
          artistName: "IZ*ONE"
          first: 3 # TODO: Max num events
        ) @connection(key: "BrowseHome_events", filters: ["artistName"]) {
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
  },
  graphql`
    query BrowseHomeRefetchQuery {
      viewer {
        ...BrowseHome_viewer
      }
    }
  `
);

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query BrowseHomeQuery {
      viewer {
        ...BrowseHome_viewer
      }
    }
  `
);
