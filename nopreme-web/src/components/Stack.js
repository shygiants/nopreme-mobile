import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  ${({ extStyle }) => extStyle}
`;
const Gap = styled.div`
  width: ${({ gap }) => gap}pt;
  height: ${({ gap }) => gap}pt;
`;

export default function Stack({ children, gap, direction, extStyle, onClick }) {
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
    <Container
      extStyle={extStyle}
      direction={direction ?? "column"}
      onClick={onClick}
    >
      {contents}
    </Container>
  );
}
