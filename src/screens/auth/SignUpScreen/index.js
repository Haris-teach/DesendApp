import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CountryPicker from "react-native-country-picker-modal";
import * as ImagePicker from "react-native-image-picker";
import Toast from "react-native-simple-toast";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { Formik } from "formik";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNTextInput from "../../../components/RNTextInput";
import RNButton from "../../../components/RNButton";
import { getOtp } from "../../../httputils/httputils";
import { SignUP } from "../../../../redux/actions/authActions";
// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import DownArrow from "../../../assets/images/svgs/downArrow.svg";
import Pen from "../../../assets/images/svgs/pen.svg";

// ====================== END =================================

const SignUpScreen = (props) => {
  const dispatch = useDispatch();

  const [countryCode, setCountryCode] = useState("PK");
  const [withFlag, setWithFlag] = useState(true);
  const [country, setCountry] = useState(null);
  const [withCallingCode, setWithCallingCode] = useState("92");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState([]);
  const [isNumber, setIsNumber] = useState("");
  const [withFilter, setWithFilter] = useState(true);

  //========================== country Picker ======================

  const onSelect = (country: Country) => {
    console.log("Country:  ", country);
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

  // ======================= Pick Image from Gallery ====================

  const PicImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };
    ImagePicker.launchImageLibrary(options, (res) => {
      console.log("PIC Responese:    ", res.assets[0]);
      setProfilePic(res.assets[0]);
    });
  };

  // ========================= END ===========================

  // ======================= GET OTP function ====================

  const getOTPFun = (v) => {
    setIsLoading(true);
    let params = {
      phone: `+${withCallingCode + v.phone}`,
    };

    getOtp(params).then((res) => {
      if (res.status == 1) {
        setIsLoading(false);
        props.navigation.navigate("OtpScreen", {
          otp: res.otp,
          phoneNumber: `+${withCallingCode + isNumber}`,
        });
        dispatch(
          SignUP(
            v.firstName,
            v.lastName,
            `+${withCallingCode + v.phone}`,
            profilePic.fileName,
            profilePic.type,
            profilePic.uri
          )
        );
      } else {
        setIsLoading(false);
        Toast.show(res.message, Toast.SHORT, ["UIAlertController"]);
      }
    });
  };

  // =======================  END ============================

  // ================= Validation funtion with formik ==========================
  const userInfo = {
    phone: "",
    firstName: "",
    lastName: "",
  };

  const validationSchema = yup.object({
    phone: yup.string().label("phone").required("Phone number is required"),
    lastName: yup.string().required("Last name is required"),
    firstName: yup
      .string()
      .label("password")
      .required("First name is required"),
  });

  // ================= END ===================================

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
      />
      <Text style={styles.loginTextStyle}>Welcome to Desend</Text>

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        <Formik
          initialValues={userInfo}
          validationSchema={validationSchema}
          onSubmit={(v, { resetForm }) => {
            getOTPFun(v);
            resetForm();
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
            const { firstName, lastName, phone } = values;
            return (
              <>
                <ScrollView
                  style={{ flex: 0.5 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.headingStyle}>
                    Enter your information
                  </Text>

                  <View style={styles.phoneInputStyle}>
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={styles.countryPickerStyle}
                    >
                      <View style={{ marginTop: hp(1) }}>
                        {Country_Picker()}
                      </View>

                      <Text style={styles.callingCodeStyle}>
                        +{withCallingCode}
                      </Text>
                      <DownArrow
                        alignSelf="center"
                        width={wp(3.5)}
                        height={hp(3.5)}
                      />
                    </TouchableOpacity>
                    <RNTextInput
                      keyboardType="phone-pad"
                      height={hp(6)}
                      width={wp(55)}
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
                    />
                  </View>
                  {touched.phone && errors.phone && (
                    <Text style={styles.warningStyle}>{errors.phone}</Text>
                  )}

                  <RNTextInput
                    height={hp(6)}
                    borderRadius={wp(3)}
                    placeholder="First Name"
                    placeholderTextColor={colors.lightBlack}
                    keyboardType="email-address"
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={firstName}
                    fontFamily={fonts.regular}
                    fontSize={wp(4)}
                    editable={true}
                    backgroundColor={colors.fieldsColor}
                    marginHorizontal={wp(8)}
                    marginTop={hp(2)}
                    marginLeft={wp(5)}
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.warningStyle}>{errors.firstName}</Text>
                  )}

                  <RNTextInput
                    height={hp(6)}
                    borderRadius={wp(3)}
                    placeholder="Last Name"
                    placeholderTextColor={colors.lightBlack}
                    keyboardType="email-address"
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={lastName}
                    fontFamily={fonts.regular}
                    fontSize={wp(4)}
                    editable={true}
                    backgroundColor={colors.fieldsColor}
                    marginHorizontal={wp(8)}
                    marginTop={hp(2)}
                    marginLeft={wp(5)}
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.warningStyle}>{errors.lastName}</Text>
                  )}

                  <View style={{ alignSelf: "center" }}>
                    <Image
                      source={{
                        uri:
                          profilePic.length == 0
                            ? "https://placeimg.com/140/140/any"
                            : profilePic.uri,
                      }}
                      style={{
                        width: wp(50),
                        height: hp(25),
                        marginTop: hp(2),
                        borderRadius: wp(5),
                      }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.black,
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        width: wp(8),
                        height: wp(8),
                        borderRadius: wp(8),
                        marginTop: hp(-2.5),
                      }}
                      onPress={() => PicImage()}
                    >
                      <Pen alignSelf="center" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.footerStyle}>
                    Already have an account?{" "}
                    <Text
                      onPress={() => props.navigation.navigate("LoginScreen")}
                      style={{ color: colors.black }}
                    >
                      Login
                    </Text>
                  </Text>

                  <View
                    style={{ height: Platform.OS == "ios" ? hp(50) : hp(10) }}
                  >
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
                      marginTop={hp(3)}
                      fontSize={wp(4)}
                      fontFamily={fonts.medium}
                      onPress={handleSubmit}
                    />
                  </View>
                </ScrollView>
              </>
            );
          }}
        </Formik>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    alignSelf: "center",
  },
  warningStyle: {
    marginHorizontal: wp(12),
    marginTop: hp("0.5%"),
    fontSize: wp("3.4%"),
    color: "red",
  },
};
