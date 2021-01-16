import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7755CC",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default function Button({ onPress, style, textStyle, children }) {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.container, style)}
      onPress={onPress}
    >
      <Text style={StyleSheet.compose(styles.text, textStyle)}>{children}</Text>
    </TouchableOpacity>
  );
}
