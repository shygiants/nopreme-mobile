import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Icon({ name, style }) {
  const flatten = StyleSheet.flatten(style);
  const size = flatten.size;
  const color = flatten.color;
  delete flatten.size;
  delete flatten.color;

  return <Ionicons name={name} style={flatten} size={size} color={color} />;
}
