import React, { useContext } from "react";

import { LanguageContext } from "../contexts/LanguageContext";
import Card from "../components/Card";
import { getEventName } from "../utils/enum";

export default function EventCard({ name, type, img, numGoods, onPress }) {
  const langCtx = useContext(LanguageContext);

  return (
    <Card
      title={name}
      badgeTitle={getEventName(type)}
      img={img}
      subTitle={`${langCtx.dictionary.goods} ${numGoods}`}
      onPress={onPress}
    />
  );
}
