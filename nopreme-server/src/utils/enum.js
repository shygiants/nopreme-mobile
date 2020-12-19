export function toGraphQLEnum(enu) {
  return enu.reduce(
    (acc, { name, value }) => Object.assign({ [name]: { value } }, acc),
    {}
  );
}
