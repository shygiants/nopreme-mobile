import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EventReporter from "../screens/EventReporter";
import GoodsReporter from "../screens/GoodsReporter";

const Stack = createStackNavigator();

export default function ReporterNavigator() {
  return (
    // TODO: Change header button padding for Android
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingHorizontal: 8,
        },
        headerRightContainerStyle: {
          paddingHorizontal: 8,
        },
        headerStyle: {
          shadowOffset: { width: 0, height: 0 },
        },
        headerTintColor: "black",
        headerStatusBarHeight: 8,
        headerTitle: null,
      }}
    >
      <Stack.Screen name="EventReporter" component={EventReporter} />
      <Stack.Screen name="GoodsReporter" component={GoodsReporter} />
    </Stack.Navigator>
  );
}
