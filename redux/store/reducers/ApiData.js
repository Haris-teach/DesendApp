import React from 'react';
import {
  SET_LOGIN_DATA,
  SET_SIGNUP_DATA,
  SET_USER_TOKEN,
} from '../actions/ApiData';

const initialState = {
  loginData: '',
  signUpData: '',
  token:'',

};

const ApiData = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_DATA:
      state.loginData = action.response;
      return state;
    case SET_SIGNUP_DATA:
      state.signUpData = action.response;
      return state;
    case SET_USER_TOKEN:
      state.token = action.response;
      return state;

    default:
      return state;
  }
};

export default ApiData;
