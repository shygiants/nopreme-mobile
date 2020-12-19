import React, { useEffect } from "react";

import { getQueryParam, getRootURL, moveToRoot } from "../utils/location";
import { setToken } from "../utils/token";

export default function SignIn({ router }) {
  const code = getQueryParam("code");

  useEffect(async () => {
    if (code === null) {
      moveToRoot();
    } else {
      const form = new URLSearchParams();
      form.append("code", code);
      form.append("redirectUri", getRootURL());
      const resp = await fetch("/oauth", {
        method: "POST",
        body: form,
      });

      if (resp.ok) {
        const { token } = await resp.json();

        setToken(token);
        moveToRoot();
      }
      // TODO: Handle error
    }
  }, []);

  return <div>Processing...</div>;
}
