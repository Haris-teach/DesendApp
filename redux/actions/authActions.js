import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  SIGN_UP,
  SAVE_CONTACTS,
  CLIPBOARD,
  UPDATEPROFILE,
  SETTINGSUPDATE,
  BLOCKARRAY,
} from "./actionTypes";

export function SignIn(
  id,
  firstname,
  lastname,
  phone,
  profileimage,
  token,
  usersetting
) {
  return {
    type: LOGIN_REQUEST,
    payload: {
      id,
      firstname,
      lastname,
      phone,
      profileimage,
      token,
      usersetting,
    },
  };
}

export function SignUP(firstname, lastname, phone, picname, pictype, picuri) {
  return {
    type: SIGN_UP,
    payload: {
      firstname,
      lastname,
      phone,
      picname,
      pictype,
      picuri,
    },
  };
}

export function SignOut(token) {
  return { type: LOGOUT_REQUEST, payload: token };
}

export function ContactSave(contacts) {
  return {
    type: SAVE_CONTACTS,
    payload: contacts,
  };
}

export function ProfileUpdate(uri, fname, lname, status) {
  return {
    type: UPDATEPROFILE,
    payload: { uri, fname, lname, status },
  };
}

export function SettingsUpdate(user) {
  return {
    type: SETTINGSUPDATE,
    payload: user,
  };
}

export function BlockArr(arr) {
  return {
    type: BLOCKARRAY,
    payload: arr,
  };
}
