import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  ${({ extStyle }) => extStyle}
`;
const Gap = styled.div`
  width: ${({ gap }) => gap}pt;
  height: ${({ gap }) => gap}pt;
`;

export default function Stack({ children, gap, flexDirection, extStyle }) {
  let contents = children;

  if (gap) {
    contents = [];
    children.flat().forEach((child, idx) => {
      if (idx !== 0 && child !== true) {
        contents.push(<Gap key={`gap-${idx}`} gap={gap} />);
      }

      contents.push(child);
    });
  }

  return (
    <Container extStyle={extStyle} flexDirection={flexDirection ?? "column"}>
      {contents}
    </Container>
  );
}
