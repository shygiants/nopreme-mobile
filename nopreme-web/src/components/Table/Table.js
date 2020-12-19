import React, { useState } from "react";
import styled from "styled-components";

import Button from "../Button";
import TableHeader from "./TableHeader";
import RowInput from "./RowInput";
import EditableRow from "./EditableRow";
import { project } from "../../utils/obj";

const StyledTable = styled.table`
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;
`;
const StyledTableBody = styled.tbody``;
const StyledTableFooter = styled.tfoot``;
export const StyledTableRow = styled.tr`
  ${(props) => props.onClick && ":hover {background: #eee;}"}
`;
export const StyledTableCell = styled.td`
  padding: 8px;
  font-size: 1.2rem;
`;

export function Table({
  keys,
  columns,
  data,
  onAdd,
  onEdit,
  onRemove,
  onRowClick,
}) {
  const [newRow, setNewRow] = useState({});
  const [adding, setAdding] = useState(false);

  function closeAddingRow() {
    setNewRow({});
    setAdding(false);
  }

  function extractKeys(row) {
    return keys.map((key) => row[key]);
  }

  return (
    <StyledTable>
      <TableHeader columns={columns} />
      <StyledTableBody>
        {data.map((row) => {
          const rowKeys = extractKeys(row);
          const keyObj = project(row, keys);
          return (
            <EditableRow
              key={rowKeys.join("_")}
              columns={columns}
              row={row}
              onEdit={(edit) => onEdit({ ...edit, ...keyObj })}
              onRemove={() => onRemove(keyObj)}
              onClick={() => onRowClick(row)}
            />
          );
        })}
      </StyledTableBody>
      <StyledTableFooter>
        {adding ? (
          <RowInput
            columns={columns}
            values={newRow}
            onChange={setNewRow}
            onComplete={() => {
              onAdd(newRow);
              closeAddingRow();
            }}
            onCancel={closeAddingRow}
          />
        ) : (
          <StyledTableRow onClick={() => setAdding(true)}>
            <StyledTableCell colSpan={columns.length + 1}>
              + 새로운 행 추가
            </StyledTableCell>
          </StyledTableRow>
        )}
      </StyledTableFooter>
    </StyledTable>
  );
}
