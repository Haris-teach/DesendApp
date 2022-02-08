import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// ====================== Local Import =======================

import { pngs } from "../../../assets/images/pngs/png";
import { colors } from "../../../assets/colors/colors";
import fonts from "../../../assets/fonts/fonts";
import RNButton from "../../../components/RNButton";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import FaceBook from "../../../assets/images/svgs/faceBook.svg";
import Twitter from "../../../assets/images/svgs/twitter.svg";
import Apple from "../../../assets/images/svgs/apple.svg";

// ====================== END =================================

const SplashScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ImageBackground
      source={pngs.splash}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[colors.splashLinear1, colors.splashLinear2]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextStyle}>LOGO</Text>
        </View>

        <View style={styles.subContainer}>
          <View style={styles.svgContainer}>
            <TouchableOpacity>
              <FaceBook />
            </TouchableOpacity>
            <TouchableOpacity>
              <Apple />
            </TouchableOpacity>
            <TouchableOpacity>
              <Twitter />
            </TouchableOpacity>
            <TouchableOpacity>
              <FaceBook />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <RNButton
            isLoading={isLoading}
            btnText="LogIn With Number"
            textColor={colors.black}
            btnColor={colors.loginBtnColor}
            height={hp(6.4)}
            marginHorizontal={hp(6)}
            borderRadius={wp(10)}
            marginTop={hp(3)}
            fontSize={wp(4)}
            fontFamily={fonts.medium}
            justifyContent="center"
            onPress={() => props.navigation.navigate("LoginScreen")}
          />
          <TouchableOpacity style={{ marginTop: hp(3) }}>
            <Text style={styles.registerTextStyle}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = {
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 0.6,
    justifyContent: "flex-end",
  },
  logoTextStyle: {
    alignSelf: "center",
    color: colors.white,
    fontSize: wp(15),
  },
  subContainer: {
    flex: 0.25,
    marginHorizontal: wp(25),
    justifyContent: "flex-end",
  },
  svgContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerContainer: { flex: 0.25 },
  registerTextStyle: {
    color: colors.loginBtnColor,
    fontSize: wp(5),
    fontFamily: fonts.medium,
    alignSelf: "center",
  },
};
