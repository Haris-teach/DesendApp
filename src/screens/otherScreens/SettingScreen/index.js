import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Contacts from "react-native-contacts";

import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNAvatar from "../../../components/RNAvatar";
import RNTextInput from "../../../components/RNTextInput";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import RightArrow from "../../../assets/images/svgs/rightArrow.svg";

// ====================== END =================================

const SettingScreen = (props) => {
  const dispatch = useDispatch();
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const phone = useSelector((state) => state.authReducer.phone);
  const profileUri = useSelector((state) => state.authReducer.uri);

  const [isPushNoti, setIsPushNoti] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const [isDisapper, setIsDisapper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
      />

      <Text style={styles.loginTextStyle}>Settings</Text>
      <View style={styles.subContainerStyle}>
        <View style={{ height: hp(72) }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{
                uri:
                  profileUri == ""
                    ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    : profileUri,
              }}
              style={styles.DPStyle}
              resizeMode="contain"
            />
            <Text style={styles.contactNameStyle}>
              {firstName + " " + lastName}
            </Text>
            <Text style={styles.phoneNumberStyle}>{phone}</Text>
            <Text style={styles.descriptionStyle}>
              What craves you carves you
            </Text>

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
              swithContorl={() => setIsPushNoti(!isPushNoti)}
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
              swithContorl={() => setIsChat(!isChat)}
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
              swithContorl={() => setIsDisapper(!isDisapper)}
              on={isDisapper}
              borderColor={colors.lightBlack}
              circleBColor={!isDisapper ? colors.black : colors.lightBlack}
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
              text="Delete Account"
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
    marginTop: hp(2),
    borderWidth: 1,
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
};
