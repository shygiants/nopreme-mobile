import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import HomeScreen from "./screens/HomeScreen";
import RootNavigator from "./navigation/RootNavigator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={RootNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
