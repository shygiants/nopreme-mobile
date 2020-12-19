import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { getHost, getLinkingUri } from "./url";

export async function login() {
  return await new Promise((resolve, reject) => {
    Linking.addEventListener("url", ({ url }) => {
      WebBrowser.dismissBrowser();

      const queryParams = /[A-z0-9\.:\/]+\?(.+)/.exec(url)[1];
      const token = queryParams.split("=")[1];
      resolve(token);
    });

    const host = getHost();
    const login_url = new URL(host);
    login_url.searchParams.append("redirectUri", getLinkingUri());

    WebBrowser.openBrowserAsync(login_url.href, {
      dismissButtonStyle: "cancel",
    }).then();
  });
}
