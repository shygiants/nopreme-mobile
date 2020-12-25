import React from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Stack from "./Stack";
import Image from "./Image";
import Badge from "./Badge";

const styles = StyleSheet.create({
  container: { flexDirection: "column", borderWidth: 0, width: 300 },
  image: { width: "100%", aspectRatio: 1, borderRadius: 20 },
  infoContainer: { flexDirection: "column", width: "100%" },
  titleText: { fontSize: 20, fontWeight: "bold" },
  subText: { fontSize: 12, fontWeight: "bold", color: "#555555" },
});

export default function Card({
  title,
  badgeTitle,
  img,
  subTitle,
  style,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack
        style={StyleSheet.compose(styles.container, { gap: 10, ...style })}
      >
        <Image style={styles.image} src={img} />
        <Stack style={StyleSheet.compose(styles.infoContainer, { gap: 4 })}>
          <View style={{ flexDirection: "row" }}>
            <Badge text={badgeTitle} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subText}>{subTitle}</Text>
        </Stack>
      </Stack>
    </TouchableOpacity>
  );
}
