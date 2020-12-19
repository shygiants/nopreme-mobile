import React from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  border: 1px solid #333;
  font-size: 1.2rem;
  padding: 6px;
`;

const StyledOption = styled.option``;

export default function OptionInput({
  name,
  visual,
  value,
  options,
  onChange,
}) {
  return (
    <StyledSelect
      name={name}
      value={value}
      onChange={({ target: { value } }) => {
        console.log(value);
        onChange(value);
      }}
    >
      <StyledOption>{visual} 선택</StyledOption>
      {options.map(({ value, name }) => (
        <StyledOption key={value} value={value}>
          {name}
        </StyledOption>
      ))}
    </StyledSelect>
  );
}
