const tokenKey = "jwt";

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function deleteToken() {
  localStorage.removeItem(tokenKey);
}
