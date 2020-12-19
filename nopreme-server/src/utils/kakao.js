import fetch from "node-fetch";

const KAKAO_AUTH_HOST = "https://kauth.kakao.com";
const KAKAO_API_HOST = "https://kapi.kakao.com";

export async function getToken(authorizationCode, redirectUri) {
  const form = new URLSearchParams();
  form.append("grant_type", "authorization_code");
  form.append("client_id", process.env.KAKAO_REST_KEY);
  form.append("redirect_uri", redirectUri);
  form.append("code", authorizationCode);

  // TODO: Handle Error
  return await fetch(new URL("/oauth/token", KAKAO_AUTH_HOST), {
    method: "POST",
    body: form,
  }).then((res) => res.json());
}

export async function getUserInfo({ access_token }) {
  return await fetch(new URL("/v2/user/me", KAKAO_API_HOST), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
}
