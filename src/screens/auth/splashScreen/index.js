import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import auth from "@react-native-firebase/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

// ====================== Local Import =======================

import { pngs } from "../../../assets/images/pngs/png";
import { colors } from "../../../constants/colors";
import fonts from "../../../assets/fonts/fonts";
import RNButton from "../../../components/RNButton";
import FaceBook from "../../../assets/images/svgs/faceBook.svg";
import Twitter from "../../../assets/images/svgs/twitter.svg";
import Apple from "../../../assets/images/svgs/apple.svg";
import Google from "../../../assets/images/svgs/google.svg";
// ====================== END =================================
GoogleSignin.configure({
  webClientId:
    "902895208558-8ukl5coips26qa12ngrqkl69qeuj1okq.apps.googleusercontent.com",
});
const SplashScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  GoogleSignin.configure({
    webClientId:
      "902895208558-8ukl5coips26qa12ngrqkl69qeuj1okq.apps.googleusercontent.com",
  });

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darker : colors.lighter,
  };

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const { accessToken } = await GoogleSignin.getTokens();
    let accesstoken = accessToken;
    let authentication = await auth().signInWithCredential(googleCredential);

    // Sign-in the user with the credential
    console.log({ accessToken: accesstoken, auth: authentication });
  };

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    console.log(await auth().signInWithCredential(facebookCredential));
  };

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
          {/* <Text style={styles.logoTextStyle}>LOGO</Text> */}
        </View>

        <View style={styles.subContainer}>
          <View style={styles.svgContainer}>
            <TouchableOpacity onPress={() => onFacebookButtonPress()}>
              <FaceBook />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onGoogleButtonPress()}>
              <Google />
            </TouchableOpacity>
            <TouchableOpacity>
              <Apple />
            </TouchableOpacity>
            <TouchableOpacity>
              <Twitter />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <RNButton
            isLoading={isLoading}
            btnText="Login With Number"
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
          <TouchableOpacity
            style={{ marginTop: hp(3) }}
            onPress={() => props.navigation.navigate("SignUPScreen")}
          >
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
