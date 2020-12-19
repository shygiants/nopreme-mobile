const redirectUriKey = "redirectUri";

export function getRedirectUri() {
  return sessionStorage.getItem(redirectUriKey);
}

export function setRedirectUri(redirectUri) {
  sessionStorage.setItem(redirectUriKey, redirectUri);
}

export function deleteRedirectUri() {
  sessionStorage.removeItem(redirectUriKey);
}
