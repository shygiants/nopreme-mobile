import React, { useState, useEffect, useContext } from "react";
import Button from "./Button";

import { LanguageContext } from "../contexts/LanguageContext";
import { getRootURL } from "../utils/location";

import Kakao from "../utils/kakao";

const CHECK_INIT_INTERVAL = 100;

export default function KakaoLoginButton({ redirectUri, state }) {
  const [initialized, setInitialized] = useState(Kakao.isInitialized());

  useEffect(() => {
    if (!initialized) {
      Kakao.init(process.env.KAKAO_JS_KEY);

      const intervalId = setInterval(() => {
        if (Kakao.isInitialized()) {
          clearInterval(intervalId);
          setInitialized(true);
        }
      }, CHECK_INIT_INTERVAL);

      return () => clearInterval(intervalId);
    }
  }, []);

  const langCtx = useContext(LanguageContext);

  function login() {
    Kakao.Auth.authorize({
      redirectUri: redirectUri || getRootURL(),
      state,
    });
  }

  if (initialized) {
    return (
      <Button primary color="yellow" textColor="black" onClick={login}>
        {langCtx.dictionary.kakaoLoginButtonText}
      </Button>
    );
  } else {
    return (
      <Button disabled>{langCtx.dictionary.kakaoLoginInitializingText}</Button>
    );
  }
}
