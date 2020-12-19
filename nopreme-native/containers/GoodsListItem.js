import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Stack from "../components/Stack";
import Image from "../components/Image";
import Badge from "../components/Badge";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    width: 130,
    height: 130,
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  titleText: { fontSize: 16, fontWeight: "bold", color: "black" },
});

export default function GoodsListItem({ title, type, img, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <Image style={styles.image} src={img} />
        <Stack style={styles.infoContainer}>
          <View style={{ flexDirection: "row" }}>
            <Badge text={type} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
        </Stack>
      </Stack>
    </TouchableOpacity>
  );
}
