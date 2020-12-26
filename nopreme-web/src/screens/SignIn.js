import React, { useEffect } from "react";

import KakaoLoginButton from "../components/KakaoLoginButton";
import { parseQuery } from "../utils/location";

export default function SignIn({ router, match }) {
  const { redirectUri } = parseQuery(match);

  useEffect(() => {
    if (!redirectUri) {
      router.replace({
        pathname: "/",
      });
    }
  }, []);

  return (
    <div>
      {/* TODO: Style */}
      <KakaoLoginButton state={redirectUri} />

      {redirectUri}
    </div>
  );
}
