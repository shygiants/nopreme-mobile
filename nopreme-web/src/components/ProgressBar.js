import React from "react";
import styled from "styled-components";

const Container = styled.div`
  border-radius: 18pt;
  background-color: #dddddd;
  display: flex;
  flex-direction: column;
`;
const Progress = styled.div`
  //   position: absolute;
  background-color: #7755cc;
  height: 100%;
  border-radius: 18pt;
  width: ${({ progress }) => progress};
`;

const ProgressText = styled.div`
  padding-top: 8pt;
  padding-bottom: 8pt;
  padding-left: 17pt;
  padding-right: 17pt;
  color: white;
  font-weight: bold;
  font-size: 16pt;
  ${({ extStyle }) => extStyle}
`;

export default function ProgressBar({ progress, extTextStyle }) {
  const percentage = `${(progress * 100).toFixed(0)}%`;
  return (
    <Container>
      <Progress progress={percentage}>
        <ProgressText extStyle={extTextStyle}>{percentage}</ProgressText>
      </Progress>
    </Container>
  );
}
