import React from "react";
import { View, StyleSheet } from "react-native";

import Stack from "./Stack";

const styles = StyleSheet.create({
  main: { flexDirection: "column" },
  cross: { justifyContent: "space-between" },
});

export default function Grid({ children, style, numCross, padding }) {
  const PaddingType = padding;

  let contents = [];
  let cross = [];
  children.forEach((child, idx) => {
    cross.push(child);
    if (idx % numCross === numCross - 1) {
      contents.push(cross);
      cross = [];
    }
  });

  if (cross.length > 0) {
    const numPaddings = numCross - cross.length;

    for (var i = 0; i < numPaddings; i++) {
      cross.push(<PaddingType key={`padding-${i}`} />);
    }

    contents.push(cross);
  }

  const mainStyle = StyleSheet.flatten(StyleSheet.compose(styles.main, style));

  return (
    <Stack style={mainStyle}>
      {contents.map((cross, idx) => (
        <Stack
          key={`cross-${idx}`}
          style={StyleSheet.compose(styles.cross, {
            flexDirection: mainStyle.flexDirection === "row" ? "column" : "row",
          })}
        >
          {cross}
        </Stack>
      ))}
    </Stack>
  );
}
