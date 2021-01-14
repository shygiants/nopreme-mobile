import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileEditor from "../screens/ProfileEditor";
import ImagePicker from "../screens/ImagePicker";

const Stack = createStackNavigator();

export default function ProfileEditorNavigator() {
  return (
    // TODO: Change header button padding for Android
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
      <Stack.Screen name="ProfileEditor" component={ProfileEditor} />
      <Stack.Screen name="ImagePicker" component={ImagePicker} />
    </Stack.Navigator>
  );
}
