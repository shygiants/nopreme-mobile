import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Icon from "./Icon";

const COLOR = "#555555";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
  },
  text: { fontSize: 12, color: COLOR },
  icon: { color: COLOR },
});

export default function SortButton({ title, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
        <Icon
          name="md-chevron-down"
          style={StyleSheet.compose(styles.icon, { size: 14 })}
        />
      </TouchableOpacity>
    </View>
  );
}
