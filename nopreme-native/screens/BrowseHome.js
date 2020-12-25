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
import HorizontalListView from "../components/HorizontalListView";
import EventCard from "../containers/EventCard";
import GoodsCard from "../containers/GoodsCard";

const styles = StyleSheet.create({
  scroll: { height: "100%" },
  container: { flexDirection: "column", width: "100%", padding: 16 },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: { fontSize: 28, fontWeight: "bold" },
});

function BrowseHome({ navigation, relay, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [refreshing, setRefreshing] = useState(false);

  const { events, photoCards, photos } = viewer;

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
          <HorizontalListView
            title={langCtx.dictionary.event}
            onMorePress={() => navigation.push("EventList")}
          >
            <Stack style={{ gap: 10, flexDirection: "row" }}>
              {events.edges.map(
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
                    name={name}
                    type={type}
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
          </HorizontalListView>

          <HorizontalListView
            title={langCtx.dictionary.photocard}
            onMorePress={() => navigation.push("GoodsList", { screen: "CARD" })}
          >
            <Stack style={{ gap: 10, flexDirection: "row" }}>
              {photoCards.edges.map(
                ({
                  node: {
                    goodsId,
                    name,
                    img: { src },
                    type,
                    numItems,
                  },
                }) => (
                  <GoodsCard
                    key={goodsId}
                    img={src}
                    name={name}
                    type={type}
                    numItems={numItems}
                    onPress={() =>
                      navigation.push("GoodsDetail", {
                        goodsId,
                      })
                    }
                  />
                )
              )}
            </Stack>
          </HorizontalListView>

          <HorizontalListView
            title={langCtx.dictionary.photo}
            onMorePress={() =>
              navigation.push("GoodsList", { screen: "PHOTO" })
            }
          >
            <Stack style={{ gap: 10, flexDirection: "row" }}>
              {photos.edges.map(
                ({
                  node: {
                    goodsId,
                    name,
                    img: { src },
                    type,
                    numItems,
                  },
                }) => (
                  <GoodsCard
                    key={goodsId}
                    img={src}
                    name={name}
                    type={type}
                    numItems={numItems}
                    onPress={() =>
                      navigation.push("GoodsDetail", {
                        goodsId,
                      })
                    }
                  />
                )
              )}
            </Stack>
          </HorizontalListView>
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
        photoCards: goodsCollection(
          artistName: "IZ*ONE"
          goodsType: "CARD"
          first: 3 # max GraphQLInt
        )
          @connection(
            key: "BrowseHome_photoCards"
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
            }
          }
        }
        photos: goodsCollection(
          artistName: "IZ*ONE"
          goodsType: "PHOTO"
          first: 3 # max GraphQLInt
        )
          @connection(
            key: "BrowseHome_photos"
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
