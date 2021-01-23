import React, { useEffect, useState, useContext } from "react";
import { Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { graphql, createRefetchContainer } from "react-relay";

import { LanguageContext } from "../contexts/LanguageContext";
import { createQueryRenderer } from "../relay";
import Stack from "../components/Stack";
import HeaderButton from "../components/HeaderButton";
import ListItem from "../components/ListItem";
import { getEventName } from "../utils/enum";
import AddEventReportMutation from "../relay/mutations/AddEventReportMutation";

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

function EventReporter({ relay, navigation, viewer }) {
  const langCtx = useContext(LanguageContext);
  const { event } = viewer;
  const [comment, setComment] = useState();

  async function report() {
    await AddEventReportMutation.commit(relay.environment, {
      eventId: event.eventId,
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
        <Text>{langCtx.dictionary.eventReportInstruction}</Text>
        <ListItem
          img={event.img.src}
          title={event.name}
          badgeTitle={getEventName(event.type)}
          subTitle={event.date}
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

const FragmentContainer = createRefetchContainer(EventReporter, {
  viewer: graphql`
    fragment EventReporter_viewer on Viewer
    @argumentDefinitions(eventId: { type: "ID!" }) {
      id
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
    }
  `,
});

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query EventReporterQuery($eventId: ID!) {
      viewer {
        ...EventReporter_viewer @arguments(eventId: $eventId)
      }
    }
  `
);
