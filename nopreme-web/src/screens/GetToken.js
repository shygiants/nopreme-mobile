import React, { useEffect, useState } from "react";

import { getRootURL, moveTo, parseQuery } from "../utils/location";

export default function GetToken({ router, match }) {
  const { code, redirectUri } = parseQuery(match);

  const [redirect, setRedirect] = useState();

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

        if (token) {
          const finalUri = new URL(redirectUri);
          finalUri.searchParams.append("token", token);

          setRedirect(finalUri.href);

          return moveTo(finalUri.href);
        }
      }
      // TODO: Handle error
    } else {
      router.replace({
        pathname: "/",
      });
    }
  }, []);

  // TODO: Style
  return (
    <div>{(redirect && <a href={redirect}>done</a>) || "Getting token..."}</div>
  );
}
