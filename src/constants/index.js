import React, { Component } from 'react'
import { Dimensions, Platform } from 'react-native'

export const APP_NANE = "ArgonTech RN Boilerplate"

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height

// Redux constants
export const COUNTER_CHANGE = 'COUNTER_CHANGE'
export const IS_LOADING = "IS_LOADING"
export const IS_CONNECTED = "IS_CONNECTED"
export const IS_SUBMITTING = "IS_SUBMITTING"
export const ASSIGN_USER_INFO = "ASSIGN_USER_INFO"
export const ASSIGN_JWT_TOKEN = "ASSIGN_JWT_TOKEN"
export const ASSIGN_BRANDS_INFO = "ASSIGN_BRANDS_INFO"
export const COUNTRIES_LIST = "COUNTRIES_LIST"
export const USER_CONFIG = "USER_CONFIG"


// VIEW LABELS
export const TERMS_CONDITIONS = 'I accept the Terms and Conditions'
export const LBL_REMEMBER = 'Remember Me'
export const LBL_FORGOT_PASSWORD = 'Forgot Password?'
export const LBL_NO_ACCOUNT = 'Don\'t have an account?'
export const LBL_REGISTER_NOW = 'Register Now'
export const LBL_ALREADY_ACCOUNT = 'Already have an account?'

// Sharedpreferences
export const SP_FCM_TOKEN = "SP_FCM_TOKEN"
export const SP_IS_LOGGED_IN = "SP_IS_LOGGED_IN"
export const SP_USER_INFO = 'SP_USER_INFO'
export const SP_SIDE_MENU_JSON_STR = "SP_SIDE_MENU_JSON_STR"
export const SP_JWT_TOKEN = "SP_JWT_TOKEN"
export const SP_USER_ID = "userID"
export const SP_USER_CONFIG="SP_USER_CONFIG";



// Messages
export const EXIT_MSG = 'Are you sure you want to exit?'
export const YES_MSG = 'YES'
export const NO_MSG = 'NO'
export const INVALID_EMAIL_ADDRESS = 'Please enter valid email address!'
export const ALL_FIELDS_REQUIRED = 'Please fill in all the required fields!'
export const OK = 'OK'
export const FILL_IN_ALL_FIELDS_APPROPRIATELY = "Please fill in all required field appropriately!"
export const NO_INTERNET = "Internet disconnected. Try again when internet connected!"
export const PASSWORD_EMPTY = 'Password empty!'
export const FULL_NAME_EMPTY = 'Fullname empty!'
export const REGISTRATION_SUCCESSFUL = 'Registration successful!'
export const PHONE_NUM_EMPTY = 'Phone number empty!'
export const ACCEPT_TERMS_CONDITIONS = 'Accept the terms and conditions'
export const PWD_CONF_PWD_NOT_SAME='Password and confirm password must be same!'
export const SUBMIT='Submit'
export const RESET_PASSWORD= 'Reset Password'
export const CONFIRM_EMAIL="Confirm your email and we\'ll send the instructions."
