//=================================== React Native Import Files =====================

import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationPopup from "react-native-push-notification-popup";

//======================================= Local Import Files ===============================

import SplashScreen from "../screens/auth/splashScreen";
import LoginScreen from "../screens/auth/loginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import OTPScreen from "../screens/auth/optScreen";
import PinScreen1 from "../screens/auth/PinScreen1";
import PinScreen2 from "../screens/auth/PinScreen2";
import ChatRoom from "../screens/otherScreens/ChatRoom";
import TabScreen from "./BottomTabNavigator";
import ChatList from "../screens/otherScreens/ChatListScreen";
import ProfileScreen from "../screens/otherScreens/profileScreen";
import ResetPinScreen from "../screens/auth/resetPin1";
import ResetPin2Screen from "../screens/auth/resetPin2";
import BlockedScreen from "../screens/otherScreens/BlockedUser";
import FAQScreen from "../screens/otherScreens/FAQScreen";
import TermsScreen from "../screens/otherScreens/Terms&Condition";
import HelpScreen from "../screens/otherScreens/HelpScreen";
import ForgotScreen from "../screens/auth/forgotScreen";
import ForgotOtpScreen from "../screens/auth/forgotOTPScreen";
import CreateNewPass from "../screens/auth/CreateNewPassword";
import VideoViwer from "../screens/otherScreens/VideoViwer";
import GroupManagement from "../screens/otherScreens/GroupManagement";
import VideoCallScreen from "../screens/otherScreens/VideoCallScreen";
import AudioCallScreen from "../screens/otherScreens/AudioCallScreen";

// ======================= END ==============================

const RootStack = createNativeStackNavigator();

const Stack = () => {
  const isLogin = useSelector((state) => state.authReducer.isLogin);

  let popup = useRef(null);
  useEffect(() => {
    getToken();
  }, []);

  const getToken = () => {
    messaging()
      .getToken()
      .then((resp) => {
        AsyncStorage.setItem("fcmToken", resp);
        console.log("====================================");
        console.log("FCMToken:  ", resp);
        console.log("====================================");
      });
  };
  const requestUserPermission = async () => {
    await messaging().requestPermission();
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("initialNotifition MESSAGE:   ", remoteMessage);
        // handleNotification(remoteMessage);
      }
    })
    .catch((reason) => console.log("App::getInitialNotification", reason));

  messaging().setBackgroundMessageHandler((remoteMessage) => {
    console.log("Background notifications:    ", remoteMessage);
    handleNotification(remoteMessage);
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log("unSubcribe  MESSAGE:   ", remoteMessage);
      handleNotification(remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("onNotification open MESSAGE:   ", remoteMessage);
  });

  const handleNotification = (remoteMessage) => {
    let link = remoteMessage.notification.body;
    var media = link.split(":");
    popup.current.show({
      appIconSource: null,
      appTitle: "Desend",
      title: remoteMessage.notification.title,
      body:
        media[0] === "https"
          ? `${remoteMessage.notification.title} send you an attachment`
          : remoteMessage.notification.body,
      slideOutTime: 1000,
    });
  };

  const AfterLoginAppContainer = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerMode: "none",
            headerShown: false,
          }}
        >
          <RootStack.Screen name="Home" component={TabScreen} />
          <RootStack.Screen name="ChatRoom" component={ChatRoom} />
          <RootStack.Screen name="ChatList" component={ChatList} />
          <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
          <RootStack.Screen name="ResetPin" component={ResetPinScreen} />
          <RootStack.Screen name="ResetPin2" component={ResetPin2Screen} />
          <RootStack.Screen name="BlockedScreen" component={BlockedScreen} />
          <RootStack.Screen name="HelpScreen" component={HelpScreen} />
          <RootStack.Screen name="FAQScreen" component={FAQScreen} />
          <RootStack.Screen name="TermsScreen" component={TermsScreen} />
          <RootStack.Screen name="VideoViwer" component={VideoViwer} />
          <RootStack.Screen name="VideoCall" component={VideoCallScreen} />
          <RootStack.Screen name="AudioCall" component={AudioCallScreen} />
          <RootStack.Screen
            name="GroupManagementScreen"
            component={GroupManagement}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  };

  const BeforeLoginAppContainer = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerMode: "none",
            headerShown: false,
          }}
        >
          <RootStack.Screen name="SplashScreen" component={SplashScreen} />
          <RootStack.Screen name="LoginScreen" component={LoginScreen} />
          <RootStack.Screen name="SignUPScreen" component={SignUpScreen} />
          <RootStack.Screen name="OtpScreen" component={OTPScreen} />
          <RootStack.Screen name="PinScreen1" component={PinScreen1} />
          <RootStack.Screen name="PinScreen2" component={PinScreen2} />
          <RootStack.Screen name="ForgotScreen" component={ForgotScreen} />
          <RootStack.Screen name="CreateNewPass" component={CreateNewPass} />
          <RootStack.Screen
            name="ForgotOtpScreen"
            component={ForgotOtpScreen}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  };

  if (isLogin == false) {
    return <BeforeLoginAppContainer />;
  } else {
    return (
      <>
        <AfterLoginAppContainer />
        <NotificationPopup
          ref={popup}
          // renderPopupContent={renderCustomPopup}
          shouldChildHandleResponderStart={true}
          shouldChildHandleResponderMove={true}
        />
      </>
    );
  }
};
export default Stack;
