import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ACCENT_COLOR = "#7755CC";

const styles = StyleSheet.create({
  container: { position: "absolute", width: "100%", height: "100%" },
  blur: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "white",
    opacity: 0.5,
  },

  progressContainer: {
    borderRadius: 18,
    backgroundColor: "#DDDDDD",
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
  },
  progress: {
    borderRadius: 18,
    backgroundColor: "#7755CC",
    position: "absolute",
    height: "100%",
  },
  progressText: {
    textAlign: "center",
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    paddingVertical: 1,
  },
});

function ProgressBar({ fulfilled, target }) {
  const progress = Math.min(fulfilled / target, 1);
  const percentage = `${(progress * 100).toFixed(0)}%`;

  return (
    <View style={styles.progressContainer}>
      <View
        style={StyleSheet.compose(styles.progress, {
          width: percentage,
        })}
      />
      <Text style={styles.progressText}>{`${fulfilled} / ${target}`}</Text>
    </View>
  );
}

export default function WishIndicator({ children, numWishes, fulfilled }) {
  return (
    <View>
      {children}

      {fulfilled < numWishes && (
        <View style={styles.container}>
          <View style={styles.blur} />
        </View>
      )}
      <ProgressBar fulfilled={fulfilled} target={numWishes} />
    </View>
  );
}
