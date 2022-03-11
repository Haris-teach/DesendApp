import { Dimensions, Platform } from "react-native";
import HitApi, {
  checkConnectivity,
  doPost,
  doGetAPICall,
  Multipart,
  formDataAPi,
} from "./httpservices";

export function userLoginAPICall(params) {
  checkConnectivity();
  return HitApi("api/v1/auth/login", "post", params, "");
}

export function userRegisterAPICall(formData) {
  return doPost("auth/register", formData);
}

export function logoutFromApp(jwtToken) {
  let formData = new FormData();
  formData.append("jwtToken", "" + jwtToken);
  return doPost("auth/logout", formData, jwtToken);
}

export function getUserConfig(jwtToken) {
  return doGetAPICall("users/getConfig", jwtToken);
}

export function getMyProfile(jwtToken) {
  return doGetAPICall("users/myProfile", jwtToken);
}

export function getOtp(params) {
  return HitApi("api/v1/auth/sendOtp", "post", params, "");
}

export function userRegister(params) {
  return doPost("api/v1/auth/phoneno-registraion", params);
}

export function contactsync(params, token) {
  return HitApi("api/v1/user/sync-contacts", "post", params, token);
}

export function getContact(params, token) {
  return HitApi("api/v1/user/contacts", "post", params, token);
}

export function GetMediaUrl(params) {
  return doPost("api/v1/user/media", params);
}
