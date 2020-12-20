import React from "react";
import { Image as RNImage, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  image: { borderRadius: 20, opacity: 0.96 },
  background: { backgroundColor: "black" },
});

export default function Image({ src, style, ...rest }) {
  const finalStyle = StyleSheet.flatten(
    StyleSheet.compose(styles.image, style)
  );
  return (
    <View
      style={StyleSheet.compose(styles.background, {
        borderRadius: finalStyle.borderRadius + 1,
      })}
    >
      <RNImage style={finalStyle} source={{ uri: src }} {...rest} />
    </View>
  );
}
