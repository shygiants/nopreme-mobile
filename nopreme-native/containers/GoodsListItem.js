import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { LanguageContext } from "../contexts/LanguageContext";
import Stack from "../components/Stack";
import Image from "../components/Image";
import Badge from "../components/Badge";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    width: 130,
    height: 130,
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  titleText: { fontSize: 16, fontWeight: "bold", color: "black" },
  subText: { fontSize: 12, fontWeight: "bold", color: "#555555" },
});

export default function GoodsListItem({ title, type, img, numItems, onPress }) {
  const langCtx = useContext(LanguageContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <Stack style={StyleSheet.compose(styles.container, { gap: 10 })}>
        <Image style={styles.image} src={img} />
        <Stack style={StyleSheet.compose(styles.infoContainer, { gap: 4 })}>
          <View style={{ flexDirection: "row" }}>
            <Badge text={type} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <Text
            style={styles.subText}
          >{`${numItems} ${langCtx.dictionary.ea}`}</Text>
        </Stack>
      </Stack>
    </TouchableOpacity>
  );
}
