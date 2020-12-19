import * as SecureStore from "expo-secure-store";

const TokenKey = "jwt";

export async function getToken() {
  return await SecureStore.getItemAsync(TokenKey);
}

export async function setToken(token) {
  await SecureStore.setItemAsync(TokenKey, token);
}
