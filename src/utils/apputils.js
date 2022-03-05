import React from 'react';
import {Share, Linking, Alert, BackHandler} from 'react-native';

import {
  INVALID_EMAIL_ADDRESS,
  APP_NANE,
  EXIT_MSG,
  YES_MSG,
  NO_MSG,
} from '../constants';

export const openUrlInBrowser = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      printLog("Don't know how to open URI: ", url);
    }
  });
};

export const generalShareIntent = shareContent => {
  Share.share(shareContent, {
    // Android only:
    dialogTitle: shareContent.title,
    // iOS only:
    excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
  });
};

export const doPhoneCall = phoneNumber => {
  this.openUrlInBrowser(`tel:${phoneNumber}`);
};

export const sendSMS = (phoneNumber, message) => {
  this.openUrlInBrowser(`sms: ${phoneNumber}?body=${message}`);
};

export const validateEmail = emailAddress => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (reg.test(emailAddress) == true) {
    return true;
  } else {
    Alert.alert('Alert!', INVALID_EMAIL_ADDRESS);
    return false;
  }
};

export const showAlertMsg = message => {
  Alert.alert(APP_NANE, message);
};

export const showAlert = (title, body) => {
  Alert.alert(
    title,
    body,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};

export const getFontSize = font_size => {
  let locFontSize = 15;
  switch (font_size) {
    case 's':
      locFontSize = 10;
      break;
    case 'l':
      locFontSize = 18;
      break;
    case 'xl':
      locFontSize = 22;
      break;
    case 'xxl':
      locFontSize = 25;
      break;
  }
  return locFontSize;
};

export const onBackPress = () => {
  Alert.alert(
    APP_NANE,
    EXIT_MSG,
    [
      {
        text: YES_MSG,
        onPress: () => {
          BackHandler.exitApp();
        },
      },
      {
        text: NO_MSG,
        onPress: () => {},
      },
    ],
    {cancelable: false},
  );
  return true;
};

export const printLog = (key, msg) => {
  console.log(key, msg);
};
