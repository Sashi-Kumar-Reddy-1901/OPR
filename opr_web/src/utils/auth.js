import { redirect } from "react-router-dom";

export function getAuthToken() {
  const token = sessionStorage.getItem("token");
  return token;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/");
  }

  return null;
}
