
import React, { Component } from 'react'

import DefaultPreference from 'react-native-default-preference';
import { SP_FCM_TOKEN } from '../constants/AppConstants'
import { printLog } from './apputils';

export const saveValueInSharedPref=(key, value) =>{
    return new Promise((resolve, reject) => {
      try {
        DefaultPreference.set(key, value).then(function () {
          resolve(value)
        });
      } catch (error) {
        // console.log("Error: ", error)
        reject(error)
      }
    })

  }

  export const getSharedPrefValue=(key) =>{
    return new Promise((resolve, reject) => {
      try{
        DefaultPreference.get(key).then(function (value) {
          resolve(value);
        });
      }catch(error)
      {
        // console.log("Error: ", error)
        reject(error)
      }
    })
  }

  export const clearSharedPrefValue=(key) =>{
    DefaultPreference.clear(key).then(function () { printLog("clearSharedPrefValue","done") });
  }

  export const clearAllSharedPrefs=()=> {
    getSharedPrefValue(SP_FCM_TOKEN)
      .then((fcmToken) => {
        // set state in a non-mutating way
        DefaultPreference.clearAll().then(function () { printLog("clearAllSharedPrefs","done") });

        if (fcmToken != null && (typeof fcmToken != 'undefined')) {
          this.saveValueInSharedPref(SP_FCM_TOKEN, fcmToken)

        }
      });

  }