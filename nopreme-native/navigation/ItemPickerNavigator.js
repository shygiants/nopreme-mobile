import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ItemPicker from "../screens/ItemPicker";

const Stack = createStackNavigator();

export default function ItemPickerNavigator() {
  return (
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
      }}
    >
      <Stack.Screen name="PickWish" component={ItemPicker} />
      <Stack.Screen name="PickPosession" component={ItemPicker} />
    </Stack.Navigator>
  );
}
