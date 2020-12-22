import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TabBarIcon from "../components/TabBarIcon";
import BrowseTab from "./BrowseTab";
import Profile from "../screens/Profile";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  return (
    <BottomTab.Navigator
      initialRouteName="Browse"
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "#999999",
        showLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Browse"
        component={BrowseTab}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon style={{ color }} name="md-search" />
          ),
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon style={{ color }} name="md-person" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
