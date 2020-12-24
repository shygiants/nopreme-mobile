import React from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Stack from "../components/Stack";
import Image from "../components/Image";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  image: {
    width: 130,
    height: 130,
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    flexShrink: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  subText: { fontSize: 12, fontWeight: "bold", color: "#555555" },
  progressBar: {
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
});

export default function ListItem({
  img,
  title,
  badgeTitle,
  subTitle,
  showProgress,
  progress,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <Image style={styles.image} src={img} />
        <Stack
          style={StyleSheet.compose(styles.infoContainer, {
            gap: 4,
          })}
        >
          <View style={{ flexDirection: "row" }}>
            <Badge text={badgeTitle} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
          {showProgress && (
            <ProgressBar textStyle={styles.progressBar} progress={progress} />
          )}
          <Text style={styles.subText}>{subTitle}</Text>
        </Stack>
      </Stack>
    </TouchableOpacity>
  );
}
