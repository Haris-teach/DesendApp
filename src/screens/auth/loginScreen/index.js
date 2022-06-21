import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNTextInput from "../../../components/RNTextInput";
import RNButton from "../../../components/RNButton";
import { SignIn } from "../../../../redux/actions/authActions";
import { userLoginAPICall } from "../../../httputils/httputils";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import DownArrow from "../../../assets/images/svgs/downArrow.svg";

// ====================== END =================================

const Login = (props) => {
  const dispatch = useDispatch();

  const [countryCode, setCountryCode] = useState("US");
  const [withFlag, setWithFlag] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [country, setCountry] = useState(null);
  const [withCallingCode, setWithCallingCode] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  //========================== country Picker ======================

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    setWithCallingCode(country.callingCode[0]);
  };

  const [isVisible, setIsVisible] = useState(false);

  const Country_Picker = () => {
    return (
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          onSelect,
        }}
        onClose={() => setIsVisible(false)}
        visible={isVisible}
      />
    );
  };

  // ======================== END ==================================

  // ================= Validation funtion with formik ==========================
  const userInfo = {
    phone: "",
    pin: "",
  };

  const validationSchema = yup.object({
    phone: yup.string().label("phone").required("Phone number is required"),
    pin: yup.string().label("pin").required("Pin is required"),
  });

  // ================= END ===================================

  // ========================= Login Function ===================

  const LoginUser = async (v) => {
    setIsLoading(true);
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    let params = {
      phone: `+${withCallingCode + v.phone}`,
      password: v.pin,
      fcmToken: fcmToken,
    };
    userLoginAPICall(params)
      .then((res) => {
        if (res.status == 1) {
          dispatch(
            SignIn(
              res.user.id,
              res.user.firstName,
              res.user.lastName,
              res.user.phone,
              res.user.profileImg,
              res.accessToken,
              res.user.userSetting
            )
          );
          Toast.showWithGravity(
            "User Login successfully",
            Toast.SHORT,
            Toast.BOTTOM
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
          Toast.showWithGravity(res.message, Toast.SHORT, Toast.BOTTOM);
        }
      })
      .catch((e) => {
        Toast.show("Request is not successful", Toast.SHORT, [
          "UIAlertController",
        ]);
        setIsLoading(false);
      });
    //dispatch(SignIn("234", "Muhammad", "Haris", "+923174011082", "", ""));
  };

  // ========================= END ============================

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
      />
      <Text style={styles.loginTextStyle}>LogIn</Text>

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        <Formik
          initialValues={userInfo}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            resetForm();
            LoginUser(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => {
            const { phone, pin } = values;
            return (
              <ScrollView>
                <Text style={styles.headingStyle}>Enter your information</Text>

                <View style={styles.phoneInputStyle}>
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    style={styles.countryPickerStyle}
                  >
                    <View style={{ marginTop: hp(1) }}>{Country_Picker()}</View>

                    <Text style={styles.callingCodeStyle}>
                      +{withCallingCode}
                    </Text>
                    <DownArrow
                      alignSelf="center"
                      width={wp(3)}
                      height={hp(3)}
                      marginTop={hp(0.4)}
                    />
                  </TouchableOpacity>
                  <RNTextInput
                    keyboardType="phone-pad"
                    height={hp(6)}
                    width={wp(60)}
                    marginLeft={wp(5)}
                    borderRadius={wp(3)}
                    placeholder="Enter Your Number"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={phone}
                    placeholderTextColor={colors.lightBlack}
                    fontFamily={fonts.regular}
                    fontSize={wp(4)}
                    editable={true}
                    backgroundColor={colors.fieldsColor}
                    maxLength={10}
                  />
                </View>
                {touched.phone && errors.phone && (
                  <Text style={styles.warningStyle}>{errors.phone}</Text>
                )}

                <RNTextInput
                  height={hp(6)}
                  borderRadius={wp(3)}
                  placeholder="Enter Your Pin Code"
                  onChangeText={handleChange("pin")}
                  onBlur={handleBlur("pin")}
                  value={pin}
                  placeholderTextColor={colors.lightBlack}
                  fontFamily={fonts.regular}
                  fontSize={wp(4)}
                  editable={true}
                  backgroundColor={colors.fieldsColor}
                  marginHorizontal={wp(8)}
                  marginTop={hp(2)}
                  marginLeft={wp(5)}
                  secureTextEntry={true}
                  maxLength={4}
                />

                {touched.pin && errors.pin && (
                  <Text style={styles.warningStyle}>{errors.pin}</Text>
                )}
                <Text
                  onPress={() => props.navigation.navigate("ForgotScreen")}
                  style={{
                    color: colors.black,
                    alignSelf: "flex-end",
                    marginHorizontal: wp(8),
                    marginVertical: hp(1),
                  }}
                >
                  Forgot password ?
                </Text>

                <Text style={styles.footerStyle}>
                  Don't have an account?{" "}
                  <Text
                    onPress={() => props.navigation.navigate("SignUPScreen")}
                    style={{ color: colors.black }}
                  >
                    Get Registered
                  </Text>
                </Text>

                <RNButton
                  flex={0}
                  justifyContent="center"
                  isLoading={isLoading}
                  btnText="Continue"
                  textColor={colors.black}
                  btnColor={colors.loginBtnColor}
                  height={hp(6.4)}
                  marginHorizontal={hp(6)}
                  borderRadius={wp(10)}
                  marginTop={hp(1)}
                  marginBottom={hp(2)}
                  fontSize={wp(4)}
                  fontFamily={fonts.medium}
                  onPress={handleSubmit}
                />
              </ScrollView>
            );
          }}
        </Formik>
      </View>
    </View>
  );
};

export default Login;

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
    backgroundColor: colors.otpBoxColor,
    width: wp(22),
    height: hp(6),
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: wp(3),
  },
  callingCodeStyle: {
    alignSelf: "center",
    opacity: 0.34,
    color: colors.black,
    marginLeft: wp(-4),
    fontSize: wp(3.5),
  },
  footerStyle: {
    marginHorizontal: wp(8),
    color: colors.lightBlack,
    fontFamily: fonts.medium,
    marginTop: hp(2),
    marginBottom: hp(18),
  },
  warningStyle: {
    marginHorizontal: wp(12),
    marginTop: hp("0.5%"),
    fontSize: wp("3.4%"),
    color: "red",
  },
};
