import React from "react";
import styled from "styled-components";

const StyledNumberInput = styled.input.attrs((props) => ({
  type: "number",
}))`
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 1.2rem;
  padding: 6px;
`;

export default function NumberInput({ name, value, placeholder, onChange }) {
  return (
    <StyledNumberInput
      autoComplete="off"
      name={name}
      value={value}
      placeholder={placeholder || name}
      onChange={({ target: { value } }) => onChange(Number(value))}
    />
  );
}
