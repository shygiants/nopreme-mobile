export function mergeObjects(objs) {
  return objs.reduce((merged, obj) => Object.assign(obj, merged), {});
}
