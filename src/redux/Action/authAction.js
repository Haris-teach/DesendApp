import { LOGIN_REQUEST, LOGOUT_REQUEST } from "./actionTypes";

export function loginFun() {
  return { type: LOGIN_REQUEST };
}

export function logoutFun() {
  return { type: LOGOUT_REQUEST };
}
