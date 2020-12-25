import React from "react";

import ListTabNavigator from "./ListTabNavigator";
import EventList from "../screens/EventList";
import { getEventTypes } from "../utils/enum";

export default function EventListTabNavigator() {
  return <ListTabNavigator types={getEventTypes()} tabComponent={EventList} />;
}
