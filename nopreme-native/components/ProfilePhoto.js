import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from "react-native";

import Icon from "./Icon";

const styles = StyleSheet.create({
  profilePhotoContainer: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BBBBBB",
  },
  profilePhoto: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    position: "absolute",
  },
  editProfilePhotoBadge: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1 },
  },
});

export default function ProfilePhoto({ img, editable }) {
  return (
    <View style={styles.profilePhotoContainer}>
      <Icon name="md-person" style={{ size: 50, color: "white" }} />
      <Image style={styles.profilePhoto} source={{ uri: img?.uri }} />
      {editable && (
        <View style={styles.editProfilePhotoBadge}>
          <Icon
            name="md-camera"
            style={{
              size: 20,
            }}
          />
        </View>
      )}
    </View>
  );
}
