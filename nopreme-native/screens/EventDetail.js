import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import { LanguageContext } from "../contexts/LanguageContext";
import ImgBGScroll from "../components/ImgBGScroll";
import Stack from "../components/Stack";
import Badge from "../components/Badge";
import OptionModal from "../components/OptionModal";
import GoodsListItem from "../containers/GoodsListItem";
import { getEventName, getGoodsName } from "../utils/enum";

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

function EventDetail({ navigation, route, viewer }) {
  const langCtx = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { event, goodsCollection } = viewer;

  return (
    <ImgBGScroll
      navigation={navigation}
      imgSrc={event.img.src}
      headerTitle={event.name}
      onOptionPress={() => setModalVisible(true)}
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
              },
            }) => (
              <GoodsListItem
                key={goodsId}
                title={name}
                type={getGoodsName(type)}
                img={src}
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
      </Stack>
    </ImgBGScroll>
  );
}

const FragmentContainer = createFragmentContainer(EventDetail, {
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
          }
        }
      }
    }
  `,
});

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
