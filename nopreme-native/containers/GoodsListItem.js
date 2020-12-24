import React, { useContext } from "react";

import { LanguageContext } from "../contexts/LanguageContext";
import ListItem from "../components/ListItem";
import { getGoodsName } from "../utils/enum";

export default function GoodsListItem({
  name,
  type,
  img,
  numItems,
  collecting,
  fulfilled,
  onPress,
}) {
  const langCtx = useContext(LanguageContext);

  return (
    <ListItem
      img={img}
      title={name}
      badgeTitle={getGoodsName(type)}
      subTitle={`${numItems} ${langCtx.dictionary.ea}`}
      showProgress={collecting}
      progress={fulfilled}
      onPress={onPress}
    />
  );
}
