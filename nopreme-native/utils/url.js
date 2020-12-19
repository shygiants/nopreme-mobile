import Constants from "expo-constants";

export function getHost() {
  const hostname = /[a-z]+:\/\/([A-z0-9\.]+):[0-9]*/.exec(getLinkingUri())[1];

  return `http://${hostname}:4000`;
}

export function getLinkingUri() {
  return Constants.linkingUri;
}
