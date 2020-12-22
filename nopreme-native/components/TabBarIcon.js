import * as React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderButton({ style, name }) {
  return <Ionicons name={name} style={style} size={30} color={style.color} />;
}
