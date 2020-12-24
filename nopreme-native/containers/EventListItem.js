import React, { useContext } from "react";

import { LanguageContext } from "../contexts/LanguageContext";
import ListItem from "../components/ListItem";
import { getEventName } from "../utils/enum";

export default function EventListItem({ name, type, img, numGoods, onPress }) {
  const langCtx = useContext(LanguageContext);

  return (
    <ListItem
      img={img}
      title={name}
      badgeTitle={getEventName(type)}
      subTitle={`${langCtx.dictionary.goods} ${numGoods}`}
      onPress={onPress}
    />
  );
}
