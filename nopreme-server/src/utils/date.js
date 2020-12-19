import moment from "moment-timezone";
import "moment/locale/ko";
moment.locale("ko");

const timezone = "Asia/Seoul";
const format = "LL";

export function dateToStr(date) {
  return moment.tz(date, timezone).format(format);
}

export function strToDate(date) {
  return moment.tz(date, format, timezone);
}
