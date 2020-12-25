import { mergeObjects } from "./obj";
import mongoose from "mongoose";

export function buildUpdate(update) {
  const copied = { ...update };
  for (let [k, v] of Object.entries(copied)) {
    if (v === undefined || v === null) {
      delete copied[k];
    }
  }

  return copied;
}

export function buildFind(find) {
  const copied = { ...find };
  for (let [k, v] of Object.entries(copied)) {
    if (v === undefined || v === null) {
      delete copied[k];
    }
  }

  return copied;
}

export function buildSort(sort) {
  if (sort instanceof Array) return mergeObjects(sort.map(buildSort).reverse());
  const { sortBy, order } = sort;
  return { [sortBy]: order };
}

export function isObjectId(idOrObj) {
  return idOrObj instanceof mongoose.Types.ObjectId;
}
