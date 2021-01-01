import React from "react";
import styled from "styled-components";

const Text = styled.div`
  font-size: 12pt;
  color: #999999;
  padding-top: 2pt;
  padding-bottom: 2pt;
  padding-left: 6pt;
  padding-right: 6pt;
  border-radius: 8pt;
  border: solid #999999;
  border-width: 1pt;
  align-self: start;
`;

export default function Badge({ text }) {
  return <Text>{text}</Text>;
}
