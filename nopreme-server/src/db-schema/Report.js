import mongoose from "mongoose";
const Schema = mongoose.Schema;

import ReportTypes from "../assets/enum/reportTypes.json";

const reportSchema = new mongoose.Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ReportTypes.map(({ value }) => value),
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

export async function getReportById({ _id }) {
  return await Report.findById(_id).exec();
}

export async function addReport({ reporter, type, event, goods, contents }) {
  return await new Report({
    reporter,
    type,
    event,
    goods,
    contents,
  }).save();
}

export async function getReports(
  { type },
  sort = { sortBy: "createdAt", order: -1 }
) {
  const { sortBy, order } = sort;
  return await Report.find({ type })
    .sort({ [sortBy]: order })
    .exec();
}

export async function getEventReports() {
  return await getReports({ type: "EVENT_INCORRECT_INFO" });
}

export async function getGoodsReports() {
  return await getReports({ type: "GOODS_INCORRECT_INFO" });
}
