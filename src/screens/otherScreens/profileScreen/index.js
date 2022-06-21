import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import DocumentPicker from "react-native-document-picker";
import Toast from "react-native-simple-toast";
var FormData = require("form-data");
import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNButton from "../../../components/RNButton";
import RNTextInput from "../../../components/RNTextInput";
import { UpdateProfile } from "../../../httputils/httputils";
import { ProfileUpdate } from "../../../../redux/actions/authActions";
// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Pen from "../../../assets/images/svgs/pen.svg";

// ====================== END =================================

const ProfileScreen = (props) => {
  const dispatch = useDispatch();

  const profileUri = useSelector((state) => state.authReducer.uri);
  const FirstName = useSelector((state) => state.authReducer.firstName);
  const LastName = useSelector((state) => state.authReducer.lastName);
  const Status = useSelector((state) => state.authReducer.status);
  const token = useSelector((state) => state.authReducer.token);

  const [isName, setIsName] = useState(FirstName);
  const [lastName, setLastName] = useState(LastName);
  const [isStatus, setIsStatus] = useState(Status);
  const [isImage, setIsImage] = useState(profileUri);
  const [isProfile, setIsProfile] = useState(profileUri);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsName(FirstName);
    setLastName(LastName);
    // setIsProfile(null);
    setIsStatus(Status);
  }, []);

  // ======================= Pick Image from Gallery ====================

  const PicImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        presentationStyle: "fullScreen",
      });

      setIsProfile({
        name: res[0].name,
        uri: res[0].uri,
        type: res[0].type,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and mo
        Toast.showWithGravity(
          "Picture is not select",
          Toast.SHORT,
          Toast.BOTTOM
        );
        Toast;
      }
    }
  };

  // ========================= END ===========================

  const ProfileSetting = () => {
    setIsLoading(true);
    var data = new FormData();
    if (isProfile != null) {
      data.append("profileImg", isProfile);
      data.append("firstName", isName);
      data.append("lastName", lastName);
      data.append("statusMessage", isStatus);
    } else {
      data.append("firstName", isName);
      data.append("statusMessage", isStatus);
      data.append("lastName", lastName);
    }

    UpdateProfile(data, token)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 1) {
          dispatch(
            ProfileUpdate(
              res.user.profileImg,
              res.user.firstName,
              res.user.lastName,
              res.user.statusMessage
            )
          );
          setIsProfile(null);
        }
        props.navigation.goBack();
        Toast.showWithGravity(
          "User updated successfully",
          Toast.SHORT,
          Toast.BOTTOM
        );
      })
      .catch((e) => {
        Toast.show("Request is not successful", Toast.SHORT, [
          "UIAlertController",
        ]);
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 0.2 }}>
        <RNHeader
          leftIcon={<BackArrow alignSelf="center" />}
          leftOnPress={() => props.navigation.goBack()}
          headerText="   "
        />
        <Text style={styles.loginTextStyle}>Profile Settings</Text>
      </View>
      <View style={styles.subContainerStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.DPStyle}>
            <Image
              source={
                isProfile.uri === undefined
                  ? isProfile !== ""
                    ? { uri: isProfile }
                    : require("../../../assets/images/pngs/profile1.png")
                  : { uri: isProfile.uri }
              }
              style={styles.DPStyle}
            />

            <TouchableOpacity
              style={{
                backgroundColor: colors.black,
                alignSelf: "flex-end",
                justifyContent: "center",
                width: wp(8),
                height: wp(8),
                borderRadius: wp(8),
                marginTop: hp(-3.5),
              }}
              onPress={PicImage}
            >
              <Pen alignSelf="center" />
            </TouchableOpacity>
          </View>

          <RNTextInput
            height={hp(6)}
            borderRadius={wp(3)}
            placeholder="Username"
            placeholderTextColor={colors.lightBlack}
            keyboardType="email-address"
            onChangeText={(text) => setIsName(text)}
            value={isName}
            fontFamily={fonts.regular}
            fontSize={wp(4)}
            editable={true}
            backgroundColor={colors.fieldsColor}
            marginHorizontal={wp(8)}
            marginTop={hp(8)}
            marginLeft={wp(5)}
          />
          <RNTextInput
            height={hp(6)}
            borderRadius={wp(3)}
            placeholder="Last Name"
            placeholderTextColor={colors.lightBlack}
            keyboardType="email-address"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            fontFamily={fonts.regular}
            fontSize={wp(4)}
            editable={true}
            backgroundColor={colors.fieldsColor}
            marginHorizontal={wp(8)}
            marginTop={hp(2)}
            marginLeft={wp(5)}
          />

          <RNTextInput
            height={hp(6)}
            borderRadius={wp(3)}
            placeholder="UserStatus"
            placeholderTextColor={colors.lightBlack}
            keyboardType="email-address"
            onChangeText={(text) => setIsStatus(text)}
            value={isStatus}
            fontFamily={fonts.regular}
            fontSize={wp(4)}
            editable={true}
            backgroundColor={colors.fieldsColor}
            marginHorizontal={wp(8)}
            marginTop={hp(2)}
            marginLeft={wp(5)}
            marginBottom={hp(5)}
          />

          <RNButton
            justifyContent="center"
            btnText="Save"
            textColor={colors.black}
            btnColor={colors.loginBtnColor}
            height={hp(6.4)}
            marginHorizontal={hp(6)}
            borderRadius={wp(10)}
            marginVertical={hp(5)}
            fontSize={wp(4)}
            fontFamily={fonts.medium}
            marginTop={hp(18)}
            onPress={ProfileSetting}
            isLoading={isLoading}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(7.5),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    padding: wp(2),
  },
  DPStyle: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35),
    alignSelf: "center",

    borderWidth: 1,
    borderColor: colors.gray,
  },
  profileViewStyle: {
    width: wp(35),
    justifyContent: "center",
    alignSelf: "center",
  },
  editPenStyle: {
    backgroundColor: colors.black,
    alignSelf: "flex-end",
    justifyContent: "center",
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    marginTop: hp(-3.5),
  },
  saveBtnStyle: {
    marginBottom: hp(5),
    backgroundColor: "red",
    flex: 1,
    justifyContent: "flex-end",
  },
};
