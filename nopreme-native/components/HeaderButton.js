import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderButton({ style, name, disabled, onPress }) {
  const icon = (
    <Ionicons
      name={name}
      style={StyleSheet.compose(
        {
          opacity: disabled ? 0.3 : 1,
        },
        style
      )}
      size={32}
    />
  );

  return onPress ? (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  ) : (
    icon
  );
}
