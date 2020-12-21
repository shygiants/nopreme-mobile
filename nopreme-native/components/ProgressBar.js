import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { LanguageContext } from "../contexts/LanguageContext";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#DDDDDD",
  },
  progress: {
    borderRadius: 18,
    backgroundColor: "#7755CC",
    position: "absolute",
    height: "100%",
  },
  progressText: {
    paddingHorizontal: 17,
    paddingVertical: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default function ProgressBar({ progress }) {
  const langCtx = useContext(LanguageContext);
  const percentage = `${progress * 100}%`;
  return (
    <View style={styles.container}>
      <View
        style={StyleSheet.compose(styles.progress, {
          width: percentage,
        })}
      />
      <Text
        style={styles.progressText}
      >{`${percentage} ${langCtx.dictionary.achieved}`}</Text>
    </View>
  );
}
