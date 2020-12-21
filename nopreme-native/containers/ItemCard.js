import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Image from "../components/Image";

const styles = StyleSheet.create({
  image: {
    width: 109,
    borderRadius: 12,
  },
});

export default function ItemCard({ img, aspectRatio }) {
  return (
    <Image
      style={StyleSheet.compose(styles.image, {
        height: styles.image.width / (aspectRatio || 1),
      })}
      src={img}
    />
  );
}

export function Padding() {
  return <View style={styles.image} />;
}
