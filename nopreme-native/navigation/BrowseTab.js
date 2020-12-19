import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";

import BrowseHome from "../screens/BrowseHome";
import EventDetail from "../screens/EventDetail";
import GoodsDetail from "../screens/GoodsDetail";

const Stack = createStackNavigator();

export default function BrowseTab() {
  return (
    <Stack.Navigator headerMode="float">
      <Stack.Screen
        name="BrowseHome"
        component={BrowseHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{
          headerTitle: null,
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="GoodsDetail"
        component={GoodsDetail}
        options={{
          headerTitle: null,
          headerTransparent: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
