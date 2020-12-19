import React, { useState, useEffect } from "react";

import Button from "../Button";
import ConfirmButton from "../ConfirmButton";
import Box from "../Box";
import RowInput from "./RowInput";
import { StyledTableRow, StyledTableCell } from "./Table";
import CellContent from "./CellContent";
import { project, getAttr } from "../../utils/obj";

export default function EditableRow({
  columns,
  row,
  onEdit,
  onRemove,
  onClick,
}) {
  const rowOfInterest = project(
    row,
    columns.map(({ property }) => property)
  );

  const [newRow, setNewRow] = useState(rowOfInterest);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setNewRow(rowOfInterest);
  }, [row]);

  return editing ? (
    <RowInput
      columns={columns}
      values={newRow}
      onChange={setNewRow}
      onComplete={() => {
        onEdit(newRow);
        setEditing(false);
        setNewRow(rowOfInterest);
      }}
      onCancel={() => {
        setEditing(false);
        setNewRow(rowOfInterest);
      }}
    />
  ) : (
    <StyledTableRow onClick={onClick}>
      {columns.map(({ property, ...rest }) => {
        return (
          <StyledTableCell key={`${row.id}-${property}`}>
            <CellContent row={row} property={property} {...rest} />
          </StyledTableCell>
        );
      })}
      <StyledTableCell>
        <Box direction="row">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              setEditing(true);
            }}
          >
            수정
          </Button>
          <Box width="4px"></Box>
          <ConfirmButton onClick={onRemove}>삭제</ConfirmButton>
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
}
