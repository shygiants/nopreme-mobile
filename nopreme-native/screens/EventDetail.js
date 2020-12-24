import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { graphql, createRefetchContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import ImgBGScroll from "../components/ImgBGScroll";
import Stack from "../components/Stack";
import Badge from "../components/Badge";
import OptionModal from "../components/OptionModal";
import GoodsListItem from "../containers/GoodsListItem";
import { getEventName } from "../utils/enum";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 20,
    color: "#555555",
  },
});

function EventDetail({ navigation, route, relay, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { event, goodsCollection } = viewer;

  function refresh(cb) {
    setRefreshing(true);
    relay.refetch(route.params, null, () => {
      setRefreshing(false);
      if (cb) cb();
    });
  }

  useEffect(() => {
    if (route.params && route.params.update) {
      refresh(() => delete route.params.update);
    }
  }, [route.params]);

  return (
    <ImgBGScroll
      navigation={navigation}
      imgSrc={event.img.src}
      headerTitle={event.name}
      onOptionPress={() => setModalVisible(true)}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      <OptionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        options={[
          {
            title: langCtx.dictionary.reportIncorrect,
            onSelect: () => console.log("report"),
          },
        ]}
      />
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <View style={{ flexDirection: "row" }}>
          <Badge text={getEventName(event.type)} />
        </View>
        <Text style={styles.titleText}>{event.name}</Text>
        <Text style={styles.dateText}>{event.date}</Text>
        <Stack style={{ gap: 10, paddingTop: 10 }}>
          {goodsCollection.edges.map(
            ({
              node: {
                goodsId,
                name,
                type,
                img: { src },
                numItems,
                collecting,
                fulfilled,
              },
            }) => (
              <GoodsListItem
                key={goodsId}
                name={name}
                type={type}
                img={src}
                numItems={numItems}
                collecting={collecting}
                fulfilled={fulfilled}
                onPress={() =>
                  navigation.push("GoodsDetail", {
                    goodsId,
                  })
                }
              />
            )
          )}
        </Stack>
      </Stack>
    </ImgBGScroll>
  );
}

const FragmentContainer = createRefetchContainer(
  EventDetail,
  {
    viewer: graphql`
      fragment EventDetail_viewer on Viewer
      @argumentDefinitions(eventId: { type: "ID!" }) {
        id
        viewer {
          id
          userId
          name
        }
        event(eventId: $eventId) {
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
        }
        goodsCollection(
          artistName: "IZ*ONE"
          eventId: $eventId
          first: 2147483647 # max GraphQLInt
        )
          @connection(
            key: "EventDetail_goodsCollection"
            filters: ["artistName", "eventId"]
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
  },
  graphql`
    query EventDetailRefetchQuery($eventId: ID!) {
      viewer {
        ...EventDetail_viewer @arguments(eventId: $eventId)
      }
    }
  `
);

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query EventDetailQuery($eventId: ID!) {
      viewer {
        ...EventDetail_viewer @arguments(eventId: $eventId)
      }
    }
  `
);
