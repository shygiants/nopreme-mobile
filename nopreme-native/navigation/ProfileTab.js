import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileHome from "../screens/ProfileHome";
import GoodsDetail from "../screens/GoodsDetail";

const Stack = createStackNavigator();

export default function ProfileTab() {
  return (
    <Stack.Navigator headerMode="float">
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GoodsDetail"
        component={GoodsDetail}
        options={{
          headerTitle: null,
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: {
            paddingHorizontal: 8,
          },
          headerRightContainerStyle: {
            paddingHorizontal: 8,
          },
        }}
      />
    </Stack.Navigator>
  );
}
