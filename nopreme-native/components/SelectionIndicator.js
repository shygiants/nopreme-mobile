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
    backgroundColor: "black",
    opacity: 0.3,
  },
  border: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderColor: ACCENT_COLOR,
  },
  badge: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
  },
  badgeText: { fontWeight: "bold", color: "white" },
  wish: {
    position: "absolute",
    left: 7,
    top: 7,
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  wishText: {
    color: "white",
  },
});

export default function SelectionIndicator({
  children,
  numSelected,
  onPress,
  focus,
  wish,
}) {
  return (
    <Pressable onPress={onPress}>
      {children}

      {numSelected > 0 && (
        <View style={styles.container}>
          <View style={styles.blur} />
          <View
            style={StyleSheet.compose(styles.border, {
              borderWidth: focus ? 6 : 5,
              opacity: focus ? 1 : 0.6,
            })}
          />
          <View
            style={StyleSheet.compose(styles.badge, {
              opacity: focus ? 1 : 0.6,
            })}
          >
            <Text style={styles.badgeText}>{numSelected}</Text>
          </View>
        </View>
      )}
      {wish && (
        <Badge
          badgeStyle={styles.wish}
          badgeTextStyle={styles.wishText}
          text="희망"
        />
      )}
    </Pressable>
  );
}
