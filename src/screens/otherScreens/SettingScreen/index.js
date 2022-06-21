import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Toast from "react-native-simple-toast";
import { Dialog } from "react-native-simple-dialogs";
import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNTextInput from "../../../components/RNTextInput";
import {
  DeleteUser,
  UpdateSetting,
  LogOut,
} from "../../../httputils/httputils";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import RightArrow from "../../../assets/images/svgs/rightArrow.svg";
import { SettingsUpdate, SignOut } from "../../../../redux/actions/authActions";

// ====================== END =================================

const SettingScreen = (props) => {
  const dispatch = useDispatch();
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const phone = useSelector((state) => state.authReducer.isPhone);
  const profileUri = useSelector((state) => state.authReducer.uri);

  const token = useSelector((state) => state.authReducer.token);
  const UserSettings = useSelector((state) => state.authReducer.userSetting);
  const Status = useSelector((state) => state.authReducer.status);
  const [isSpinner, setIsSpinner] = useState(false);
  const [isPushNoti, setIsPushNoti] = useState(UserSettings.pushNotification);
  const [isChat, setIsChat] = useState(UserSettings.chatBackup);
  const [isDisapper, setIsDisapper] = useState(
    UserSettings.disappearingMessages
  );
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(true);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const RenderModal = () => {
    return (
      <Dialog
        visible={isDialogVisible}
        title="Exit?"
        titleStyle={{ alignSelf: "center" }}
        onTouchOutside={() => setIsDialogVisible(false)}
        dialogStyle={{ borderRadius: wp(4) }}
      >
        <Text style={{ color: colors.black }}>
          Are you sure you want to logout?
        </Text>
        <View style={styles.dialogBtnContainerStyle}>
          <TouchableOpacity
            style={[
              styles.dialogBtnStyle,
              { backgroundColor: colors.fieldsColor },
            ]}
            onPress={() => {
              setIsSpinner(false);
              setIsDialogVisible(false);
            }}
          >
            <Text style={{ alignSelf: "center", color: colors.black }}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dialogBtnStyle,
              { backgroundColor: colors.loginBtnColor },
            ]}
            onPress={() => {
              setIsSpinner(true);
              LogOut(token)
                .then((res) => {
                  if (res.status == 1) {
                    setIsSpinner(false);
                    // Toast.show(res.message, Toast.SHORT, ["UIAlertController"]);
                    dispatch(SignOut());
                  } else {
                    setIsSpinner(false);
                  }
                })
                .catch((e) => {
                  setIsSpinner(false);
                  Toast.show("Request is not Successfull", Toast.SHORT, [
                    "UIAlertController",
                  ]);
                });
            }}
          >
            {isSpinner ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={{ alignSelf: "center", color: colors.black }}>
                Yes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  // Setting Update function
  const SettingUpdate = (push, chat, dis) => {
    let params = {
      pushNotification: push,
      chatBackup: chat,
      disappearingMessages: dis,
    };
    UpdateSetting(params, token)
      .then((res) => {
        if (res.status == 1) {
          dispatch(SettingsUpdate(res.user));
          // Toast.showWithGravity(res.message, Toast.SHORT, Toast.BOTTOM);
        }
      })
      .catch((e) => {
        Toast.show("Request is not successful", Toast.SHORT, [
          "UIAlertController",
        ]);
        setIsLoading(false);
      });
  };
  //  E   N   D

  // Delete user function
  const UserDelete = () => {
    setIsLoading(true);
    dispatch(SignOut(token));
  };
  //  E   N   D

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
      />

      <Text style={styles.loginTextStyle}>Settings</Text>
      <View style={styles.subContainerStyle}>
        <View style={{ height: hp(72) }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {profileUri == "" ? (
              <View style={styles.DPStyle}>
                <Image
                  source={require("../../../assets/images/pngs/profile1.png")}
                  style={styles.DPStyle}
                />
              </View>
            ) : (
              <View style={styles.DPStyle}>
                <Image
                  source={{
                    uri: profileUri,
                  }}
                  imageStyle={styles.DPStyle}
                  style={styles.DPStyle}
                  onLoadEnd={() => setLoad(false)}
                />
                {/* {!load ? null : (
                  <ActivityIndicator
                    size={"small"}
                    color={colors.button_text}
                    style={{ alignSelf: "center" }}
                  />
                )} */}
              </View>
            )}
            <Text style={styles.contactNameStyle}>
              {firstName + " " + lastName}
            </Text>
            <Text style={styles.phoneNumberStyle}>{phone}</Text>
            <Text style={styles.descriptionStyle}>{Status}</Text>

            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(4)}
              text="Profile"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
              mainPress={() => props.navigation.navigate("ProfileScreen")}
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Blocked Contacts"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
              mainPress={() => props.navigation.navigate("BlockedScreen")}
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Reset Pin"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
              mainPress={() => props.navigation.navigate("ResetPin2")}
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Wallet Settings"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Push Notifications"
              isToggel={true}
              offColor={colors.white}
              onColor={colors.white}
              bgOnColor={colors.white}
              bgoffColor={colors.black}
              swithContorl={() => {
                setIsPushNoti(!isPushNoti);
                SettingUpdate(!isPushNoti, isChat, isDisapper);
              }}
              on={isPushNoti}
              borderColor={colors.lightBlack}
              circleBColor={!isPushNoti ? colors.black : colors.lightBlack}
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Chat BackUp"
              isToggel={true}
              offColor={colors.white}
              onColor={colors.white}
              bgOnColor={colors.white}
              bgoffColor={colors.black}
              swithContorl={() => {
                setIsChat(!isChat);
                SettingUpdate(isPushNoti, !isChat, isDisapper);
              }}
              on={isChat}
              borderColor={colors.lightBlack}
              circleBColor={!isChat ? colors.black : colors.lightBlack}
            />
            <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Disapper Messages"
              isToggel={true}
              offColor={colors.white}
              onColor={colors.white}
              bgOnColor={colors.white}
              bgoffColor={colors.black}
              swithContorl={() => {
                setIsDisapper(!isDisapper);
                SettingUpdate(isPushNoti, isChat, !isDisapper);
              }}
              on={isDisapper}
              borderColor={colors.lightBlack}
              circleBColor={!isDisapper ? colors.black : colors.lightBlack}
            />
            {/* <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Display"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
            /> */}
            <RNTextInput
              mainPress={() => props.navigation.navigate("HelpScreen")}
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Help"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
            />
            <RNTextInput
              mainPress={() => props.navigation.navigate("FAQScreen")}
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="FAQ"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
            />
            <RNTextInput
              mainPress={() => props.navigation.navigate("TermsScreen")}
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Terms & Conditions"
              disabled={true}
              RightIcon={
                <RightArrow
                  marginRight={wp(5)}
                  alignSelf="center"
                  width={wp(3)}
                  height={hp(3)}
                />
              }
            />
            {/* <RNTextInput
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Delete Account"
              disabled={true}
              //mainPress={UserDelete}
              RightIcon={
                isLoading ? (
                  <ActivityIndicator
                    color={colors.black}
                    style={{ marginRight: wp(2) }}
                  />
                ) : null
              }
            /> */}
            <RNTextInput
              mainPress={() => setIsDialogVisible(true)}
              marginLeft={wp(7)}
              fontFamily={fonts.regular}
              fontSize={wp(4.5)}
              height={hp(7)}
              justifyContent="center"
              backgroundColor={colors.fieldsColor}
              borderRadius={wp(3)}
              marginHorizontal={wp(6)}
              marginTop={hp(1)}
              text="Logout"
              disabled={true}
            />
            <View style={{ marginBottom: hp(10) }} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;

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
    width: wp(32),
    height: wp(32),
    borderRadius: wp(32),
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: colors.gray,
  },

  contactNameStyle: {
    color: colors.black,
    alignSelf: "center",
    fontSize: wp(5.5),
    fontFamily: fonts.medium,
    marginTop: hp(1),
  },
  phoneNumberStyle: {
    color: colors.black,
    alignSelf: "center",
    fontSize: wp(4),
    fontFamily: fonts.light,
    fontWeight: "400",
  },
  descriptionStyle: {
    color: colors.black,
    alignSelf: "center",
    fontSize: wp(4),
    fontFamily: fonts.light,
  },
  sectionHeaderStyle: {
    textAlignVertical: "center",
    fontSize: wp(5),
    color: "#C0C1C3",
    fontWeight: "600",
    marginHorizontal: wp(6),
    marginLeft: wp(12),
    marginVertical: hp(1),
    fontFamily: fonts.medium,
  },
  dialogBtnStyle: {
    width: wp(30),
    height: hp(5),
    justifyContent: "center",
    borderRadius: wp(2),
  },
  dialogBtnContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(3),
  },
};
