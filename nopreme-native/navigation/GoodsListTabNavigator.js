import React from "react";

import ListTabNavigator from "./ListTabNavigator";
import GoodsList from "../screens/GoodsList";
import { getGoodsTypes } from "../utils/enum";

export default function GoodsListTabNavigator() {
  return <ListTabNavigator types={getGoodsTypes()} tabComponent={GoodsList} />;
}
