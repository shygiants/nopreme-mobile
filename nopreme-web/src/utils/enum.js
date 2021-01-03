import EventTypes from "../assets/enum/eventTypes.json";
import GoodsTypes from "../assets/enum/goodsTypes.json";

export function getEventName(val) {
  return EventTypes.find(({ value }) => value === val).name;
}

export function getGoodsName(val) {
  return GoodsTypes.find(({ value }) => value === val).name;
}

export function getEventTypes() {
  return EventTypes;
}

export function getGoodsTypes() {
  return GoodsTypes;
}
