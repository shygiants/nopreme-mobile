import React from "react";
import styled from "styled-components";

const StyledCheckbox = styled.input.attrs((props) => ({
  type: "checkbox",
}))`
  transform: scale(2);
`;

export default function CheckboxInput({ name, checked, readOnly, onChange }) {
  return (
    <StyledCheckbox
      name={name}
      checked={checked}
      readOnly={readOnly}
      onChange={({ target: { checked } }) => onChange(checked)}
    />
  );
}
