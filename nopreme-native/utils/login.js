import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { getHost, getLinkingUri } from "./url";

export async function login() {
  function queryToToken(url) {
    const queryParams = /[A-z0-9\.:\/]+\?(.+)/.exec(url)[1];
    return queryParams.split("=")[1];
  }

  function loginPromise() {
    const host = getHost();
    const login_url = new URL(host);
    login_url.searchParams.append("redirectUri", getLinkingUri());

    return WebBrowser.openAuthSessionAsync(login_url.href);
  }

  if (Platform.OS === "ios") {
    const { type, url } = await loginPromise();

    if (type === "cancel") {
      throw "Login canceled by user";
    } else if (type === "success") {
      return queryToToken(url);
    }
  } else {
    return await new Promise((resolve, reject) => {
      Linking.addEventListener("url", ({ url }) => resolve(queryToToken(url)));

      const host = getHost();
      const login_url = new URL(host);
      login_url.searchParams.append("redirectUri", getLinkingUri());

      loginPromise().then(console.log);
    });
  }
}
