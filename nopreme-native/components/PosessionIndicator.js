import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import Badge from "./Badge";
import { LanguageContext } from "../contexts/LanguageContext";

const ACCENT_COLOR = "#7755CC";

const styles = StyleSheet.create({
  container: { position: "absolute", width: "100%", height: "100%" },
  wish: {
    position: "absolute",
    left: 7,
    bottom: 7,
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  wishText: {
    color: "white",
  },
  badge: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
  },
  badgeText: { fontWeight: "bold", color: "white" },
});

export default function PosessionIndicator({
  children,
  numPosessions,
  wished,
}) {
  const langCtx = useContext(LanguageContext);

  return (
    <View>
      {children}

      {numPosessions > 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{numPosessions}</Text>
        </View>
      )}

      {wished > 0 && (
        <Badge
          badgeStyle={styles.wish}
          badgeTextStyle={styles.wishText}
          text={langCtx.dictionary.wish}
        />
      )}
    </View>
  );
}
