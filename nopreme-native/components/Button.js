import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7755CC",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default function Button({ onPress, children }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}
