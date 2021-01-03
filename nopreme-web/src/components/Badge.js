import React from "react";
import styled from "styled-components";

const Text = styled.div`
  font-size: 12px;
  color: #999999;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 8px;
  border: solid #999999;
  border-width: 1px;
  align-self: start;
  ${({ extStyle }) => extStyle}
`;

export default function Badge({ text, extStyle }) {
  return <Text extStyle={extStyle}>{text}</Text>;
}
