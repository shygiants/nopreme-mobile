import * as React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import BottomTabNavigator from "./BottomTabNavigator";
// import ItemPicker from "../screens/ItemPicker";
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
          //   headerShown: true,
          //   headerBackTitleVisible: false,
          //   headerLeftContainerStyle: {
          //     paddingHorizontal: 8,
          //   },
          //   headerRightContainerStyle: {
          //     paddingHorizontal: 8,
          //   },
          //   headerStyle: {
          //     shadowOffset: { width: 0, height: 0 },
          //   },
          //   headerTintColor: "black",
          gestureEnabled: false,
        }}
      />
    </Modal.Navigator>
  );
}
