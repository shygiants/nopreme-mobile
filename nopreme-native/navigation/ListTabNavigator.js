import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { LanguageContext } from "../contexts/LanguageContext";

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  indicator: {
    height: "auto",
    borderRadius: 20,
    backgroundColor: "black",
    top: 8,
    bottom: 8,
  },
  indicatorContainer: {
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  tab: {
    width: "auto",
  },
  label: {
    fontWeight: "bold",
  },
  navigator: {
    paddingHorizontal: 16,
    overflow: "visible",
  },
});

export default function ListTabNavigator({ types, tabComponent }) {
  const langCtx = useContext(LanguageContext);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "white",
        inactiveTintColor: "rgba(0,0,0,0.5)",
        indicatorStyle: styles.indicator,
        indicatorContainerStyle: styles.indicatorContainer,
        tabStyle: styles.tab,
        labelStyle: styles.label,
        scrollEnabled: true,
        style: styles.navigator,
      }}
    >
      {[{ name: langCtx.dictionary.all, value: "all" }, ...types].map(
        ({ name, value }) => (
          <Tab.Screen
            key={value}
            name={value}
            component={tabComponent}
            options={{ tabBarLabel: name }}
            initialParams={{ type: value === "all" ? null : value }}
          />
        )
      )}
    </Tab.Navigator>
  );
}
