import React from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";

import Stack from "../components/Stack";
import IconButton from "../components/IconButton";

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: { fontSize: 28, fontWeight: "bold" },
  moreButton: { color: "#333333", paddingLeft: 64 },
  scroll: { width: "100%", overflow: "visible" },
});

export default function HorizontalListView({ title, onMorePress, children }) {
  return (
    <Stack style={{ gap: 16 }}>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
        <IconButton
          style={styles.moreButton}
          name="md-chevron-forward"
          onPress={onMorePress}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {children}
      </ScrollView>
    </Stack>
  );
}
