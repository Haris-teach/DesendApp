//=================================== React Native Import Files =====================

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// ======================= END ==============================

const RootStack = createNativeStackNavigator();

const Stack = () => {
  const isLogin = useSelector((state) => state.authReducer.isLogin);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = () => {
    messaging()
      .getToken()
      .then((resp) => {
        AsyncStorage.setItem("fcmToken", resp);
        console.log("====================================");
        console.log(resp);
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
        //handleNotification(remoteMessage);
      }
    })
    .catch((reason) => console.log("App::getInitialNotification", reason));

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Background notifications:    ", remoteMessage);
  });

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage((remoteMessage) => {
  //     console.log("unSubcribe  MESSAGE:   ", remoteMessage);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

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
        </RootStack.Navigator>
      </NavigationContainer>
    );
  };

  if (isLogin == false) {
    return <BeforeLoginAppContainer />;
  } else {
    return <AfterLoginAppContainer />;
  }
};
export default Stack;
