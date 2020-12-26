import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileHome from "../screens/ProfileHome";
import GoodsDetail from "../screens/GoodsDetail";
import Settings from "../screens/Settings";

const Stack = createStackNavigator();

export default function ProfileTab() {
  return (
    <Stack.Navigator headerMode={Platform.OS === "ios" ? "float" : "screen"}>
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{
          headerTitle: "마이 페이지",
          headerRightContainerStyle: {
            paddingHorizontal: 8,
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: "설정",
          headerTintColor: "black",
          headerBackTitleVisible: false,
          headerRightContainerStyle: {
            paddingHorizontal: 8,
          },
        }}
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
