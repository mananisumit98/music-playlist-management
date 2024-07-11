export function isAuth() {
  const isToken = localStorage.getItem("user_token");
  if (isToken) {
    return true;
  }
  return false;
}