import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { LanguageContext } from "../contexts/LanguageContext";
import Stack from "../components/Stack";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100vw - (16px * 4)) / 3);
  height: calc(
    ((100vw - (16px * 4)) / 3) / ${({ aspectRatio }) => aspectRatio ?? 1}
  );
  background-image: url("${({ bg }) => bg}");
  background-size: contain;
  border-radius: 12px;
  justify-content: flex-end;
  filter: ${({ active }) => (active ? "brightness(95%)" : "opacity(50%)")};
`;

const Badge = styled.div`
  font-size: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 8px;
  border-width: 1px;
  align-self: start;
  border: solid white;
  background-color: white;
  color: #999999;
`;

const WishBadge = styled(Badge)`
  border: solid white;
  background-color: white;
  color: #7755cc;
`;

const PosessionBadge = styled(Badge)`
  border: solid #7755cc;
  background-color: #7755cc;
  color: white;
`;

export default function ItemCard({ img, aspectRatio, wished, posessed }) {
  const langCtx = useContext(LanguageContext);
  return (
    <Container
      aspectRatio={aspectRatio}
      bg={img.src}
      active={wished > 0 || posessed > 0}
    >
      <Stack
        direction="row"
        gap={4}
        extStyle={css`
          padding: 8px;
        `}
      >
        {wished > posessed && <WishBadge>{langCtx.dictionary.wish}</WishBadge>}
        {wished < posessed && (
          <PosessionBadge>{langCtx.dictionary.posession}</PosessionBadge>
        )}
        {wished > 0 && wished === posessed && (
          <Badge>{langCtx.dictionary.collected}</Badge>
        )}
      </Stack>
    </Container>
  );
}
