import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

import { createQueryRenderer } from "../relay";

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

function HomeScreen({ viewer }) {
  if (viewer) console.log(`viewer: ${JSON.stringify(viewer)}`);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

const FragmentContainer = createFragmentContainer(HomeScreen, {
  viewer: graphql`
    fragment HomeScreen_viewer on Viewer {
      id
      viewer {
        id
        userId
        name
      }
    }
  `,
});

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query HomeScreenQuery {
      viewer {
        ...HomeScreen_viewer
      }
    }
  `
);
