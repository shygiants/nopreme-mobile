import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import TabBarIcon from "../components/TabBarIcon";
import BrowseTab from "./BrowseTab";

const BottomTab = createBottomTabNavigator();

export default function RootNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  return (
    <BottomTab.Navigator
      initialRouteName="Browse"
      //   tabBarOptions={{
      //     activeTintColor: colors.primary,
      //     showLabel: false,
      //   }}
    >
      <BottomTab.Screen
        name="Browse"
        component={BrowseTab}
        // options={{
        //   tabBarIcon: ({ color }) => <TabBarIcon color={color} name="md-search" />,
        // }}
      />
    </BottomTab.Navigator>
  );
}
