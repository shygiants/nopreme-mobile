import React, { useEffect } from "react";
import styled from "styled-components";

import KakaoLoginButton from "../components/KakaoLoginButton";
import { parseQuery } from "../utils/location";

const Window = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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
    <Window>
      {/* TODO: Style */}
      <KakaoLoginButton state={redirectUri} />

      {redirectUri}
    </Window>
  );
}
