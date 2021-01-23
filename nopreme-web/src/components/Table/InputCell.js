import React from "react";

import { StyledTableCell } from "./Table";
import TextInput from "../TextInput";
import DatePicker from "../DatePicker";
import ImageInput from "../ImageInput";
import OptionInput from "../OptionInput";
import NumberInput from "../NumberInput";
import CheckboxInput from "../CheckboxInput";

export default function InputCell({
  name,
  property,
  type,
  value,
  onChange,
  options,
}) {
  switch (type) {
    case "text":
      return (
        <StyledTableCell key={property}>
          <TextInput name={property} value={value || ""} onChange={onChange} />
        </StyledTableCell>
      );
    case "number":
      return (
        <StyledTableCell key={property}>
          {/* TODO: default value */}
          <NumberInput name={property} value={value || 0} onChange={onChange} />
        </StyledTableCell>
      );
    case "date":
      return (
        <StyledTableCell key={property}>
          <DatePicker
            name={property}
            selected={value || null}
            onChange={onChange}
          />
        </StyledTableCell>
      );
    case "image":
      return (
        <StyledTableCell key={property}>
          <ImageInput
            name={property}
            value={value || { src: null }}
            onChange={onChange}
          />
        </StyledTableCell>
      );
    case "option":
      return (
        <StyledTableCell key={property}>
          <OptionInput
            name={property}
            visual={name}
            options={options}
            value={value}
            onChange={onChange}
          />
        </StyledTableCell>
      );
    case "boolean":
      return (
        <StyledTableCell key={property}>
          <CheckboxInput name={property} checked={value} onChange={onChange} />
        </StyledTableCell>
      );
    default:
      throw "Unsupported column type";
  }
}
