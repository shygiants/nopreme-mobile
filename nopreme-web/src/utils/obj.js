export function project(obj, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = getAttr(obj, key);
    return acc;
  }, {});
}

export function getAttr(obj, key) {
  const separator = ".";
  if (key.includes(separator)) {
    const tokens = key.split(separator);
    const prop = tokens[0];

    const root = getAttr(obj, prop);
    return root
      ? getAttr(root, tokens.slice(1, tokens.length).join(separator))
      : null;
  } else {
    return obj[isNumeric(key) ? Number(key) : key];
  }
}

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
