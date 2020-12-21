import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flexDirection: "column" },
});

export default function Stack({ children, style }) {
  let contents = children;

  const finalStyle = StyleSheet.flatten(
    StyleSheet.compose(styles.container, style)
  );

  if (finalStyle.gap) {
    const { gap } = finalStyle;

    contents = [];

    children.forEach((child, idx) => {
      if (idx !== 0 && child !== true) {
        contents.push(
          <View
            key={`gap-${idx}`}
            style={
              finalStyle.flexDirection === "row"
                ? { width: gap }
                : { height: gap }
            }
          />
        );
      }
      contents.push(child);
    });
  }

  return <View style={finalStyle}>{contents}</View>;
}
