import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    borderColor: "#999999",
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 12, color: "#999999" },
});

export default function Badge({ text, badgeStyle, badgeTextStyle }) {
  return (
    <View style={StyleSheet.compose(styles.badge, badgeStyle)}>
      <Text style={StyleSheet.compose(styles.badgeText, badgeTextStyle)}>
        {text}
      </Text>
    </View>
  );
}
