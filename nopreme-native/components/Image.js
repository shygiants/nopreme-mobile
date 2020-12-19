import React from "react";
import { Image as RNImage, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: { borderRadius: 20 },
});

export default function Image({ src, style, ...rest }) {
  const finalStyle = StyleSheet.flatten(
    StyleSheet.compose(styles.image, style)
  );
  return <RNImage style={finalStyle} source={{ uri: src }} {...rest} />;
}
