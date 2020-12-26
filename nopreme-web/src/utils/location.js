export function parseQuery(match) {
  const params = new URL(window.document.location).searchParams;

  return { ...match.location.query, ...Object.fromEntries(params.entries()) };
}

export function getRootURL() {
  const url = new URL(window.document.location);

  const protocol = url.protocol;
  const host = url.host;

  return `${protocol}//${host}`;
}

export function moveToRoot() {
  moveTo(getRootURL());
}

export function moveTo(url) {
  window.location.href = url;
}
