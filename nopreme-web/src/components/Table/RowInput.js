import React, { useState, useEffect } from "react";

import { StyledTableRow, StyledTableCell } from "./Table";
import InputCell from "./InputCell";
import Button from "../Button";
import Box from "../Box";

export default function RowInput({
  columns,
  values,
  onChange,
  onComplete,
  onCancel,
}) {
  const [initialValues, setinitialValues] = useState(values);

  function checkEmpty() {
    return columns.some(
      ({ property }) =>
        values[property] === undefined ||
        values[property] === null ||
        values[property] === ""
    );
  }

  function checkChanged() {
    return columns.some(
      ({ property }) => values[property] !== initialValues[property]
    );
  }

  function completable() {
    return !checkEmpty() && checkChanged();
  }

  return (
    <StyledTableRow>
      {columns.map(({ property, type, options, header }) => (
        <InputCell
          key={property}
          name={header}
          property={property}
          type={type}
          value={values[property]}
          options={options}
          onChange={(val) => onChange({ ...values, [property]: val })}
        />
      ))}
      <StyledTableCell>
        <Box direction="row">
          <Button disabled={!completable()} onClick={onComplete}>
            완료
          </Button>
          <Box width="4px"></Box>
          <Button onClick={onCancel}>취소</Button>
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
}
