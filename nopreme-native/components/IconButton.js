import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "./Icon";

export default function IconButton({ style, name, disabled, onPress }) {
  const icon = (
    <Icon
      name={name}
      style={StyleSheet.compose(
        {
          opacity: disabled ? 0.3 : 1,
        },
        { ...style, size: 32 }
      )}
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
