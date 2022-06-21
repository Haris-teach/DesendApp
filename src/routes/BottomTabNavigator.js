import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// =======================local import=========================

import { colors } from "../constants/colors";

import ChatMainScreen from "../screens/otherScreens/ChatMainScreen";
import SettingScreen from "../screens/otherScreens/SettingScreen";
import ContactScreen from "../screens/otherScreens/ContactScreen";
import BookScreen from "../screens/otherScreens/BookScreen";

//==============================================================

// ===================SVGS====================

import Contact from "../assets/images/svgs/contact.svg";
import Msg from "../assets/images/svgs/msg.svg";
import Setting from "../assets/images/svgs/setting.svg";
import BContact from "../assets/images/svgs/bContact.svg";
import BMsg from "../assets/images/svgs/bMsg.svg";
import BSetting from "../assets/images/svgs/bSetting.svg";
import Wallet from "../assets/images/svgs/wallet.svg";
import BWallet from "../assets/images/svgs/bWallet.svg";
//=================================================

const Tab = createBottomTabNavigator();
const customTabBarStyle = {
  //tabBarActiveBackgroundColor: 'red',
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.otpBoxColor,
    borderRadius: wp(10),
    marginHorizontal: wp(6),
    position: "absolute",
    bottom: 0,
    elevation: 20,
    height: hp(6.5),
    borderTopWidth: 0,
    marginBottom: hp(2),
    justifyContent: "center",
    alignSelf: "center",
  },
};

const height_screen = Dimensions.get("window").height;
console.log("HEIGHT:   ", height_screen);

const TabScreen = () => {
  return (
    <Tab.Navigator screenOptions={customTabBarStyle}>
      <Tab.Screen
        name="Call"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            //dispatch(GetTabLocation('Call'));
            return !focused ? <Contact /> : <BContact />;
          },

          tabBarItemStyle: {
            borderRadius: 15,
            alignSelf: "center",
            height: hp("7%"),
            marginLeft: wp("3%"),
            marginRight: wp("3%"),
            marginBottom:
              Platform.OS === "ios"
                ? height_screen < 675
                  ? hp(1)
                  : height_screen == 736
                  ? hp(0)
                  : -hp(3.5)
                : hp(1),
          },
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            //dispatch(GetTabLocation('Call'));
            return !focused ? <Wallet /> : <BWallet />;
          },

          tabBarItemStyle: {
            borderRadius: 15,
            alignSelf: "center",
            height: hp("7%"),
            marginLeft: wp("3%"),
            marginRight: wp("3%"),
            marginBottom:
              Platform.OS === "ios"
                ? height_screen < 675
                  ? hp(1)
                  : height_screen == 736
                  ? hp(0)
                  : -hp(3.5)
                : hp(1),
          },
        }}
      />
      <Tab.Screen
        name="Message"
        component={ChatMainScreen}
        options={{
          tabBarActiveTintColor: "white",
          tabBarIcon: ({ focused }) => {
            return !focused ? <Msg /> : <BMsg />;
          },

          tabBarItemStyle: {
            borderRadius: 15,
            height: hp("7%"),
            alignSelf: "center",
            marginLeft: wp("3%"),
            marginRight: wp("3%"),
            alignItems: "center",
            alignContent: "center",
            marginBottom:
              Platform.OS === "ios"
                ? height_screen < 675
                  ? hp(1)
                  : height_screen == 736
                  ? hp(0)
                  : -hp(3.5)
                : hp(1),
          },
        }}
      />
      <Tab.Screen
        name="Mail"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return !focused ? <Setting /> : <BSetting />;
          },
          tabBarItemStyle: {
            borderRadius: 15,
            height: hp("7%"),
            alignSelf: "center",
            marginLeft: wp("3%"),
            marginRight: wp("3%"),
            marginBottom:
              Platform.OS === "ios"
                ? height_screen < 675
                  ? hp(1)
                  : height_screen == 736
                  ? hp(0)
                  : -hp(3.5)
                : hp(1),
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  iconStyle: {
    width: wp("5%"),
    height: hp("3%"),
  },
});
