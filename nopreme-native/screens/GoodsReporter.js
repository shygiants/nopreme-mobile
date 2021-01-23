import React, { useEffect, useState, useContext } from "react";
import { Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { graphql, createRefetchContainer } from "react-relay";

import { LanguageContext } from "../contexts/LanguageContext";
import { createQueryRenderer } from "../relay";
import Stack from "../components/Stack";
import HeaderButton from "../components/HeaderButton";
import ListItem from "../components/ListItem";
import { getGoodsName } from "../utils/enum";
import AddGoodsReportMutation from "../relay/mutations/AddGoodsReportMutation";

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold" },
  comment: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 80,
    borderRadius: 10,
    borderColor: "#DDDDDD",
  },
});

function GoodsReporter({ relay, navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const { goods } = viewer;
  const [comment, setComment] = useState();

  async function report() {
    await AddGoodsReportMutation.commit(relay.environment, {
      goodsId: goods.goodsId,
      contents: comment,
    });

    navigation.goBack();
  }

  useEffect(() => {
    navigation.setOptions({
      headerBackImage: ({ tintColor }) => (
        <HeaderButton name="md-close" style={{ color: tintColor }} />
      ),
      headerRight: ({ tintColor }) => (
        <HeaderButton
          name="md-checkmark"
          style={{ color: tintColor }}
          onPress={report}
        />
      ),
    });
  }, [comment]);

  return (
    <ScrollView style={{ width: window.width, backgroundColor: "white" }}>
      <StatusBar style={"dark"} />
      <Stack style={{ gap: 20, padding: 16 }}>
        <Text style={styles.title}>{langCtx.dictionary.reportIncorrect}</Text>
        <Text>{langCtx.dictionary.goodsReportInstruction}</Text>
        <ListItem
          img={goods.img.src}
          title={goods.name}
          badgeTitle={getGoodsName(goods.type)}
          subTitle={goods.event.name}
        />

        <TextInput
          style={styles.comment}
          placeholder={langCtx.dictionary.reportPlaceholder}
          multiline
          textAlignVertical="top"
          numberOfLines={10}
          value={comment}
          onChangeText={setComment}
        />
      </Stack>
    </ScrollView>
  );
}

const FragmentContainer = createRefetchContainer(GoodsReporter, {
  viewer: graphql`
    fragment GoodsReporter_viewer on Viewer
    @argumentDefinitions(goodsId: { type: "ID!" }) {
      id
      goods(goodsId: $goodsId) {
        id
        goodsId
        name
        type
        img {
          id
          imageId
          src
        }
        event {
          id
          name
        }
      }
    }
  `,
});

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query GoodsReporterQuery($goodsId: ID!) {
      viewer {
        ...GoodsReporter_viewer @arguments(goodsId: $goodsId)
      }
    }
  `
);
