import React from "react";
import { StyleSheet } from "react-native";

import Icon from "./Icon";

export default function TabBarIcon({ style, name }) {
  return (
    <Icon
      name={name}
      style={StyleSheet.compose(style, { size: 30, color: style.color })}
    />
  );
}
