import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import Image from "../components/Image";

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
});

export default function ItemCard({ img, aspectRatio }) {
  const window = useWindowDimensions();
  const width = (window.width - 16 * 4) / 3;
  return (
    <Image
      style={StyleSheet.compose(styles.image, {
        width,
        height: width / (aspectRatio || 1),
      })}
      src={img}
    />
  );
}

export function Padding() {
  const window = useWindowDimensions();
  const width = (window.width - 16 * 4) / 3;
  return (
    <View
      style={StyleSheet.compose(styles.image, {
        width,
      })}
    />
  );
}
