import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  SIGN_UP,
  SAVE_CONTACTS,
} from "./actionTypes";

export function SignIn(id, firstname, lastname, phone, profileimage, token) {
  return {
    type: LOGIN_REQUEST,
    payload: {
      id,
      firstname,
      lastname,
      phone,
      profileimage,
      token,
    },
  };
}

export function SignUP(firstname, lastname, phone, picname, pictype, picuri) {
  return {
    type: SIGN_UP,
    payload: { firstname, lastname, phone, picname, pictype, picuri },
  };
}

export function SignOut() {
  return { type: LOGOUT_REQUEST };
}

export function ContactSave(contacts) {
  return {
    type: SAVE_CONTACTS,
    payload: contacts,
  };
}
