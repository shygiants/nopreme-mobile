import React, { useContext } from "react";
import { StyleSheet } from "react-native";

import { LanguageContext } from "../contexts/LanguageContext";
import Card from "../components/Card";
import { getGoodsName } from "../utils/enum";

const styles = StyleSheet.create({
  container: { flexDirection: "column", borderWidth: 0 },
  image: { height: 300, width: 300, borderRadius: 20 },
  infoContainer: { flexDirection: "column", width: 300 },
  titleText: { fontSize: 20, fontWeight: "bold" },
  subText: { fontSize: 12, fontWeight: "bold", color: "#555555" },
});

export default function GoodsCard({ name, type, img, numItems, onPress }) {
  const langCtx = useContext(LanguageContext);

  return (
    <Card
      title={name}
      badgeTitle={getGoodsName(type)}
      img={img}
      subTitle={`${numItems} ${langCtx.dictionary.ea}`}
      style={{ width: 240 }}
      onPress={onPress}
    />
  );
}
