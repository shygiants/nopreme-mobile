import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Stack from "../components/Stack";
import Icon from "../components/Icon";

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    fontSize: 18,
  },
  settingRightIcon: {
    color: "#999999",
  },
});

function Setting({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>{title}</Text>
        <Icon
          style={StyleSheet.compose(styles.settingRightIcon, { size: 24 })}
          name="md-chevron-forward"
        />
      </View>
    </TouchableOpacity>
  );
}

export default function Settings() {
  const settings = [
    {
      title: "공지사항",
      onPress: () => console.log("notice"),
    },
    {
      title: "고객센터",
      onPress: () => console.log("help"),
    },
    {
      title: "정보",
      onPress: () => console.log("info"),
    },
    {
      title: "로그아웃",
      onPress: () => console.log("signout"),
    },
    {
      title: "탈퇴하기",
      onPress: () => console.log("exit"),
    },
  ];
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView style={{ height: "100%" }}>
        <Stack style={{ padding: 16, gap: 16 }}>
          {settings.map(({ title, onPress }, idx) => (
            <Setting key={`setting-${idx}`} title={title} onPress={onPress} />
          ))}
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
}
