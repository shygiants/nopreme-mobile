import React, { useEffect } from "react";
import styled from "styled-components";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

import { strToDate, dateToStr } from "../utils/date";

const StyledReactDatePicker = styled(ReactDatePicker)`
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 1.2rem;
  padding: 6px;
`;

export default function DatePicker({ name, selected, onChange }) {
  return (
    <StyledReactDatePicker
      locale="ko"
      dateFormat={ko.formatLong.date({ width: "long" })}
      selected={selected && strToDate(selected).toDate()}
      onChange={(val) => onChange(dateToStr(val))}
      placeholderText={name}
    />
  );
}
