import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { getArtistByName } from "./Artist";
import { buildUpdate, buildFind } from "../utils/db";
import EventTypes from "../assets/enum/eventTypes.json";

const eventSchema = new mongoose.Schema({
  name: String,
  img: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  date: Date,
  artist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  type: {
    type: String,
    enum: EventTypes.map(({ value }) => value),
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model("Event", eventSchema);

export async function getEventById({ _id }) {
  return await Event.findById(_id).exec();
}

export async function addEvent({ name, img, date, type, artist }) {
  return await new Event({
    name,
    img,
    date,
    artist,
    type,
  }).save();
}

export async function getEvents(
  { artistId, eventType },
  sort = { sortBy: "date", order: -1 }
) {
  const { sortBy, order } = sort;

  return await Event.find(buildFind({ artist: artistId, type: eventType }))
    .sort({ [sortBy]: order })
    .exec();
}

export async function modifyEvent({ _id, name, date, img, type, published }) {
  const update = { name, date, img, type, published };

  const modifiedEvent = await Event.findOneAndUpdate(
    { _id },
    buildUpdate(update),
    { new: true }
  ).exec();

  return modifiedEvent;
}

export async function removeEvent({ _id }) {
  //TODO: { n: 1, ok: 1, deletedCount: 1 }
  const res = await Event.deleteOne({ _id }).exec();

  return _id;
}

export async function getEventsByArtistName(
  { artistName, eventType },
  sort = { sortBy: "date", order: -1 }
) {
  const artist = await getArtistByName({ name: artistName });

  if (!artist) return null;

  return await getEvents({ artistId: artist._id, eventType }, sort);
}
