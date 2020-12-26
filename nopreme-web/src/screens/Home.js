import React, { useEffect } from "react";

import { parseQuery } from "../utils/location";

export default function Home({ router, match }) {
  const { code, redirectUri, state } = parseQuery(match);

  useEffect(() => {
    if (code) {
      router.replace({
        pathname: "/getToken",
        query: { code, redirectUri: state },
      });
    } else if (redirectUri) {
      router.replace({
        pathname: "/signIn",
        query: { redirectUri },
      });
    }
  }, []);

  // TODO: Style
  return "HOME";
}
