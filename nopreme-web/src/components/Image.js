import React from "react";
import styled from "styled-components";

import { edgeStyle } from "./common";

const StyledImage = styled.img`
  ${(props) => props.width && edgeStyle("width", props.width)}
  ${(props) => props.height && edgeStyle("height", props.height)}
`;

export default function Image(props) {
  return <StyledImage {...props} />;
}
