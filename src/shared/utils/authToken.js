const TOKEN_KEY = 'access_token';

export function setAccessToken(token) {
  try {
    if (token == null) return;
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export function getAccessToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

export default {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};
