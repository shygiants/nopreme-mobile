import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileHome from "../screens/ProfileHome";

const Stack = createStackNavigator();

export default function ProfileTab() {
  return (
    <Stack.Navigator headerMode="float">
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
