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
  return doPost("api/v1/auth/phoneno-registraion", params, "");
}

export function contactsync(params, token) {
  return HitApi("api/v1/user/sync-contacts", "post", params, token);
}

export function getContact(params, token) {
  return HitApi("api/v1/user/contacts", "post", params, token);
}

export function GetMediaUrl(params) {
  return doPost("api/v1/user/media", params, "");
}

export function ResetPin(params) {
  return HitApi("api/v1/user/reset-password", "post", params, "");
}

export function UpdateSetting(params, token) {
  return HitApi("api/v1/user/setting-update", "PUT", params, token);
}

export function DeleteUser(token) {
  return HitApi("api/v1/user/delete-user", "Delete", "", token);
}

export function VerifyOTP(params) {
  return HitApi("api/v1/auth/verify-otp", "post", params, "");
}

export function LogOut(token) {
  return HitApi("api/v1/user/logout", "post", "", token);
}

export function UserBlock(params, token) {
  return HitApi("api/v1/user/block-contact", "post", params, token);
}

export function BlockList(token) {
  return HitApi("api/v1/user/block-contact-list", "get", "", token);
}

export function UpdateProfile(formData, token) {
  return doPost("api/v1/user/user-update", formData, token);
}

export function PushNotification(params, token) {
  return HitApi("api/v1/user/send-message-notification", "post", params, token);
}

export function UserReport(params, token) {
  return HitApi("api/v1/user/reportuser", "post", params, token);
}

export function ForgotPasswprd(params) {
  return HitApi("api/v1/auth/forgot-password", "post", params);
}

export function UpdatePassword(params) {
  return HitApi("api/v1/auth//update-Password", "post", params);
}
