import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import EventList from "../screens/EventList";
import { getEventTypes } from "../utils/enum";

const Tab = createMaterialTopTabNavigator();

export default function EventListTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "white",
        inactiveTintColor: "rgba(0,0,0,0.5)",
        indicatorStyle: {
          height: "auto",
          borderRadius: 20,
          backgroundColor: "black",
          top: 8,
          bottom: 8,
        },
        indicatorContainerStyle: {
          paddingVertical: 8,
          marginHorizontal: 16,
        },
        tabStyle: {
          width: "auto",
        },
        labelStyle: {
          fontWeight: "bold",
        },
        scrollEnabled: true,
        style: {
          paddingHorizontal: 16,
          overflow: true,
        },
      }}
    >
      {[{ name: "전체", value: "all" }, ...getEventTypes()].map(
        ({ name, value }) => (
          <Tab.Screen
            key={value}
            name={value}
            component={EventList}
            options={{ tabBarLabel: name }}
            initialParams={{ eventType: value === "all" ? null : value }}
          />
        )
      )}
    </Tab.Navigator>
  );
}
