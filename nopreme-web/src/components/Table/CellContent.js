import React from "react";

import Image from "../Image";
import CheckboxInput from "../CheckboxInput";
import { getAttr } from "../../utils/obj";

export default function CellContent({ row, property, type, options }) {
  const colVal = getAttr(row, property);

  function val2name(val) {
    return options.find(({ value }) => value === val).name;
  }

  switch (type) {
    case "image":
      return <Image height="100px" src={colVal && colVal.src} />;
    case "option":
      return val2name(colVal);
    case "boolean":
      return <CheckboxInput checked={colVal} readOnly />;
    default:
      return colVal;
  }
}
