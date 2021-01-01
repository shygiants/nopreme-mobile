import React from "react";
import styled from "styled-components";

import Stack from "./Stack";

export default function Grid({ children, direction, numCross, gap, padding }) {
  const PaddingType = padding;

  const mainDirection = direction ?? "column";
  const crossDirection = mainDirection === "column" ? "row" : "column";

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

  return (
    <Stack direction={mainDirection} gap={gap}>
      {contents.map((cross, idx) => (
        <Stack key={`cross-${idx}`} direction={crossDirection} gap={gap}>
          {cross}
        </Stack>
      ))}
    </Stack>
  );
}
