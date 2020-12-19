import { mergeObjects } from "./obj";

export function buildUpdate(update) {
  const copied = { ...update };
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
