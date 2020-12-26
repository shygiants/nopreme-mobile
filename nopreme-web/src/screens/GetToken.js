import React, { useEffect } from "react";

import { getRootURL, moveTo, parseQuery } from "../utils/location";

export default function GetToken({ router, match }) {
  const { code, redirectUri } = parseQuery(match);

  useEffect(async () => {
    if (code && redirectUri) {
      const form = new URLSearchParams();
      form.append("code", code);
      form.append("redirectUri", getRootURL());
      const resp = await fetch("/oauth", {
        method: "POST",
        body: form,
      });

      if (resp.ok) {
        const { token } = await resp.json();

        const finalUri = new URL(redirectUri);
        finalUri.searchParams.append("token", token);

        return moveTo(finalUri);
      }
      // TODO: Handle error
    } else {
      router.replace({
        pathname: "/",
      });
    }
  }, []);

  return "Getting token...";
}
