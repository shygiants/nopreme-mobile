import React, { useContext } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { LanguageContext } from "../contexts/LanguageContext";
import BrowseHome from "../screens/BrowseHome";
import EventDetail from "../screens/EventDetail";
import GoodsDetail from "../screens/GoodsDetail";
import EventListTabNavigator from "../navigation/EventListTabNavigator";
import GoodsListTabNavigator from "../navigation/GoodsListTabNavigator";

const Stack = createStackNavigator();

export default function BrowseTab() {
  const langCtx = useContext(LanguageContext);

  return (
    <Stack.Navigator headerMode={Platform.OS === "ios" ? "float" : "screen"}>
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
          headerLeftContainerStyle: {
            paddingHorizontal: 8,
          },
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

      <Stack.Screen
        name="EventList"
        component={EventListTabNavigator}
        options={{
          headerTitle: langCtx.dictionary.event,
          headerTintColor: "black",
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
        }}
      />
      <Stack.Screen
        name="GoodsList"
        component={GoodsListTabNavigator}
        options={{
          headerTitle: langCtx.dictionary.goods,
          headerTintColor: "black",
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
        }}
      />
    </Stack.Navigator>
  );
}
