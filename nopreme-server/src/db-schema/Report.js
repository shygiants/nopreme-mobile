import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReportType = [
  {
    name: "이벤트 잘못된 정보 제보",
    value: "EVENT_INCORRECT_INFO",
  },
  {
    name: "굿즈 잘못된 정보 제보",
    value: "GOODS_INCORRECT_INFO",
  },
  {
    name: "버그 제보",
    value: "BUG",
  },
];

const reportSchema = new mongoose.Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ReportType.map(({ value }) => value),
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  goods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
  },
  contents: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.model("Report", reportSchema);
