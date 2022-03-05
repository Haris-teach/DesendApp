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
          <RootStack.Screen name={"Home"} component={TabScreen} />
          <RootStack.Screen name={"ChatRoom"} component={ChatRoom} />
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
