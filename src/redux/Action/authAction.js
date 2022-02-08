import { LOGIN_REQUEST, LOGOUT_REQUEST } from "./actionTypes";

export function Login() {
  return { type: LOGIN_REQUEST };
}

export function logout() {
  return { type: LOGOUT_REQUEST };
}
