import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Stack from "../components/Stack";
import Image from "../components/Image";
import Badge from "../components/Badge";
import kr from "../assets/lang/kr.json";

const styles = StyleSheet.create({
  container: { flexDirection: "column", borderWidth: 0 },
  image: { height: 300, width: 300, borderRadius: 20 },
  infoContainer: { flexDirection: "column", width: 300 },
  titleText: { fontSize: 20, fontWeight: "bold" },
  subText: { fontSize: 12, fontWeight: "bold", color: "#555555" },
});

export default function EventCard({ title, type, img, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <Image style={styles.image} src={img} />
        <Stack style={StyleSheet.compose(styles.infoContainer, { gap: 4 })}>
          <View style={{ flexDirection: "row" }}>
            <Badge text={type} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subText}>{kr.goods} 2</Text>
        </Stack>
      </Stack>
    </TouchableOpacity>
  );
}
