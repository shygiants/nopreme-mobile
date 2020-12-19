import styled, { css } from "styled-components";

import { edgeStyle } from "./common";

const Box = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  ${(props) => props.pad && edgeStyle("padding", props.pad)}
  ${(props) => props.width && edgeStyle("width", props.width)}
  font-family: "Roboto", sans-serif;
`;

export default Box;
