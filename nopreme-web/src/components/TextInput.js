import React from "react";
import styled from "styled-components";

const StyledTextInput = styled.input`
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 1.2rem;
  padding: 6px;
`;

export default function TextInput({ name, value, placeholder, onChange }) {
  return (
    <StyledTextInput
      autoComplete="off"
      name={name}
      value={value}
      placeholder={placeholder || name}
      onChange={({ target: { value } }) => onChange(value)}
    />
  );
}
