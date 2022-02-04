export const SET_LOGIN_DATA = 'SET_LOGIN_DATA';
export const SET_SIGNUP_DATA = 'SET_SIGNUP_DATA';
export const SET_USER_TOKEN = 'SET_USER_TOKEN';

export const SetLoginData = res => {
  return {type: SET_LOGIN_DATA, response: res};
};

export const SetSignUpData = res => {
  return {type: SET_SIGNUP_DATA, response: res};
};

export const SetUserToken = res => {
  return {type: SET_USER_TOKEN, response: res};
};
