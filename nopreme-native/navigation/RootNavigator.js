import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
import ItemPickerNavigator from "./ItemPickerNavigator";
import ProfileEditorNavigator from "./ProfileEditorNavigator";
import ReporterNavigator from "./ReporterNavigator";

const Modal = createStackNavigator();

export default function RootNavigator({ navigation, route }) {
  return (
    <Modal.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Modal.Screen name="Tabs" component={BottomTabNavigator} />
      <Modal.Screen
        name="ItemPicker"
        component={ItemPickerNavigator}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
      <Modal.Screen
        name="ProfileEditor"
        component={ProfileEditorNavigator}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
      <Modal.Screen
        name="Reporter"
        component={ReporterNavigator}
        options={{
          ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: true,
        }}
      />
    </Modal.Navigator>
  );
}
