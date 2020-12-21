import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";

import Badge from "./Badge";

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
  wish: {
    position: "absolute",
    right: 7,
    top: 7,
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  wishText: {
    color: "white",
  },
});

export default function WishIndicator({ children, numWishes, fulfilled }) {
  return (
    <View>
      {children}

      {fulfilled < numWishes && (
        <View style={styles.container}>
          <View style={styles.blur} />
        </View>
      )}
      {
        <Badge
          badgeStyle={styles.wish}
          badgeTextStyle={styles.wishText}
          text={`${fulfilled} / ${numWishes}`}
        />
      }
    </View>
  );
}
