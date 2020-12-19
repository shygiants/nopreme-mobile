import React from "react";
import styled from "styled-components";

import { StyledTableRow } from "./Table";

const StyledTableHeader = styled.thead``;
const StyledTableHeaderCell = styled.th`
  text-align: left;
  border-bottom: 1px solid #333;
  padding: 8px;
`;

export default function TableHeader({ columns }) {
  return (
    <StyledTableHeader>
      <StyledTableRow>
        {columns.map(({ header, property }) => (
          <StyledTableHeaderCell key={property}>{header}</StyledTableHeaderCell>
        ))}
        <StyledTableHeaderCell></StyledTableHeaderCell>
      </StyledTableRow>
    </StyledTableHeader>
  );
}
