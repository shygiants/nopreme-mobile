import React, { useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";

import Stack from "./Stack";

const styles = StyleSheet.create({
  tabTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

const ACTIVE_COLOR = "black";
const INACTIVE_COLOR = "#999999";

function Tab({ active, title, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text
        style={StyleSheet.compose(styles.tabTitle, {
          color: active ? ACTIVE_COLOR : INACTIVE_COLOR,
        })}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function Tabs({ tabTitles, tabIdx, onTabChange }) {
  return (
    <Stack style={{ flexDirection: "row", gap: 10 }}>
      {tabTitles.map((title, idx) => (
        <Tab
          key={`tab-${idx}`}
          active={tabIdx === idx}
          title={title}
          onPress={() => onTabChange(idx)}
        />
      ))}
    </Stack>
  );
}
