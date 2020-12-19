import React, { useEffect, useState } from "react";

import KakaoLoginButton from "../components/KakaoLoginButton";
import Button from "../components/Button";
import { getQueryParam, moveTo } from "../utils/location";
import { getToken, deleteToken } from "../utils/token";
import {
  getRedirectUri,
  setRedirectUri,
  deleteRedirectUri,
} from "../utils/redirect";

export default function Home({ router }) {
  const code = getQueryParam("code");
  const redirectUri = getQueryParam("redirectUri");

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [clicked, setClicked] = useState(false);

  useEffect(async () => {
    if (redirectUri) setRedirectUri(redirectUri);

    if (code !== null) {
      router.push({
        pathname: "/signin",
        query: { code },
      });
    } else if (token !== null) {
      // TODO: Validate token
      const form = new URLSearchParams();
      form.append("token", token);
      const resp = await fetch("/user", {
        method: "POST",
        body: form,
      });

      if (resp.ok) {
        const user = await resp.json();
        if (!user || user.error) {
          deleteToken();
          setToken(null);
        } else {
          setUser(user);
        }
      }

      const redirectUri = getRedirectUri();
      if (redirectUri && token !== null) {
        deleteRedirectUri();
        const finalUri = new URL(redirectUri);
        finalUri.searchParams.append("token", token);

        return moveTo(finalUri);
      }
    }
  }, []);

  if (token !== null) {
    return (
      <div>
        {JSON.stringify(user) || "Processing..."}
        <Button onClick={deleteToken}>토큰 제거</Button>
        <Button onClick={deleteRedirectUri}>리다이렉 제거</Button>
        {redirectUri}
      </div>
    );
  } else {
    return (
      <div>
        <KakaoLoginButton />
        <Button
          onClick={() => {
            setClicked(true);
            window.location.href = redirectUri;
          }}
        >
          {clicked ? "clicked" : "테스트"}
        </Button>
        {redirectUri}
      </div>
    );
  }
}
