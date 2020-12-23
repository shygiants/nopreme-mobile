import * as React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
import ItemPickerNavigator from "./ItemPickerNavigator";

const Modal = createStackNavigator();

export default function RootNavigator({ navigation, route }) {
  return (
    <Modal.Navigator mode="modal" screenOptions={{ headerShown: false }}>
      <Modal.Screen name="Tabs" component={BottomTabNavigator} />
      <Modal.Screen
        name="ItemPicker"
        component={ItemPickerNavigator}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
    </Modal.Navigator>
  );
}
