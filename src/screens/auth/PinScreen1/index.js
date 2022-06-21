import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Toast from "react-native-simple-toast";
import OTPInputView from "@twotalltotems/react-native-otp-input";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNTextInput from "../../../components/RNTextInput";
import RNButton from "../../../components/RNButton";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Secure from "../../../assets/images/svgs/secure.svg";

// ====================== END =================================

const PinScreen1 = (props) => {
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ====================== Create PIN function =====================

  const OtpVerify = () => {
    setIsLoading(true);

    if (otpCode == "") {
      Toast.show("Enter pin code", Toast.SHORT, ["UIAlertController"]);
      setIsLoading(false);
    } else {
      props.navigation.navigate("PinScreen2", { pin: otpCode });
      setIsLoading(false);
    }
  };

  // ========================  END  ===============================

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
      />
      <Text style={styles.loginTextStyle}>Create Your Pin</Text>

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        <ScrollView style={{ flex: 0.5 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.headingStyle}>
            Enter your 4 digit PIN Code to keep your info encrypted
          </Text>

          <Secure alignSelf="center" />

          <View style={styles.otpCodeFullView}>
            <OTPInputView
              selectionColor={colors.black}
              secureTextEntry={true}
              // style={styles.otpInsideStyle}
              pinCount={4}
              codeInputFieldStyle={styles.otpCodeFieldStyle}
              onCodeFilled={(code) => {
                setOtpCode(code);
              }}
              autoFocusOnLoad={false}
            />
          </View>

          <View
            style={{
              height: Platform.OS === "ios" ? hp(50) : hp(10),
              marginTop: hp(25),
            }}
          >
            <RNButton
              flex={0}
              justifyContent="center"
              isLoading={isLoading}
              btnText="Next"
              textColor={colors.black}
              btnColor={colors.loginBtnColor}
              height={hp(6.4)}
              marginHorizontal={hp(6)}
              borderRadius={wp(10)}
              marginTop={hp(3)}
              fontSize={wp(4)}
              fontFamily={fonts.medium}
              onPress={() => OtpVerify()}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PinScreen1;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(7.5),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subContainerStyle: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  headingStyle: {
    color: "black",
    marginHorizontal: wp(8),
    marginVertical: hp(5),
    fontSize: wp(5.2),
    fontFamily: fonts.regular,
  },
  phoneInputStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(8),
  },
  countryPickerStyle: {
    backgroundColor: colors.fieldsColor,
    width: wp(25),
    height: hp(6),
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: wp(3),
  },
  callingCodeStyle: {
    alignSelf: "center",
    opacity: 0.34,
    color: colors.black,
    marginLeft: wp(-2),
    fontSize: wp(4),
  },
  footerStyle: {
    marginHorizontal: wp(8),
    color: colors.lightBlack,
    fontFamily: fonts.medium,
    marginTop: hp(2),
  },
  otpCodeFieldStyle: {
    backgroundColor: colors.otpBoxColor,
    borderRadius: wp(6),
    height: hp(10),
    width: wp(18),
    borderWidth: 0,
    color: colors.black,
    fontSize: Platform.OS == "ios" ? wp(6) : wp(10),
  },
  otpCodeFullView: {
    height: hp(9),
    //backgroundColor: 'red',
    marginTop: hp(3),
    marginHorizontal: wp(10),
  },
  otpResendViewStyle: {
    marginVertical: hp(5),
    marginHorizontal: wp(6),
  },
  otpResendRowView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  otpDigitStyle: {
    backgroundColor: "transparent",
  },
  otpDigitalTextStyle: {
    color: "#A3A3A3",
  },
  otpResendTextStyle: {
    fontFamily: fonts.regular,
    color: "black",
    fontWeight: "bold",
    marginLeft: wp(0.9),
  },
};
