import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Stack from "./Stack";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#7755CC",
    paddingHorizontal: 24,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 12,
  },
  icon: { color: "white" },
  number: { fontSize: 32, color: "white" },
});

export default function Counter({ name, count, onAdd, onSub }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, color: "white", paddingVertical: 12 }}>
          {name}
        </Text>
        <Stack style={StyleSheet.compose(styles.counter, { gap: 32 })}>
          <TouchableOpacity onPress={onSub}>
            <Ionicons style={styles.icon} name="md-remove" size={32} />
          </TouchableOpacity>
          <Text style={styles.number}>{count}</Text>
          <TouchableOpacity onPress={onAdd}>
            <Ionicons style={styles.icon} name="md-add" size={32} />
          </TouchableOpacity>
        </Stack>
      </View>
    </View>
  );
}
