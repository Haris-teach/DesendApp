import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
  TextInput,
  SectionList,
  PermissionsAndroid,
} from "react-native";
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
import Search from "../../../assets/images/svgs/search.svg";
import { ScrollView } from "react-native-gesture-handler";

// ====================== END =================================

const SettingScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
      />

      {/* <View style={styles.subContainerStyle}></View> */}
      <ScrollView>
        <Text style={styles.loginTextStyle}>Settings</Text>
        {/* <View style={styles.subContainerStyle}>
          <RNAvatar
            width={wp(30)}
            height={wp(30)}
            borderRadius={wp(30)}
            viewWidth={wp(30)}
            viewHeight={wp(30)}
            viewBorderRadius={wp(30)}
            source={require("../../../assets/images/pngs/splash.png")}
            resizeMode="cover"
            justifyContent="center"
            alignSelf="center"
            marginTop={hp(3)}
          />
          <Text
            style={{
              color: "#232323",
              fontFamily: fonts.medium,
              fontSize: wp(5.5),
              alignSelf: "center",
              marginTop: hp(1),
            }}
          >
            Eon John Paul
          </Text>

          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.light,
              fontSize: wp(4.3),
              alignSelf: "center",
            }}
          >
            +86 132 6737 3838
          </Text>
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.light,
              fontSize: wp(4.3),
              alignSelf: "center",
              marginTop: hp(0.5),
            }}
          >
            What craves you carves you
          </Text>
          <TouchableOpacity>
            <RNTextInput
              height={hp(6)}
              borderRadius={wp(3)}
              fontFamily={fonts.regular}
              fontSize={wp(4)}
              backgroundColor={colors.bWhite}
              marginHorizontal={wp(8)}
              marginTop={hp(2)}
              text="Profile"
              justifyContent="center"
            />
          </TouchableOpacity>
        </View> */}
      </ScrollView>
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
    backgroundColor: colors.fieldsColor,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  DPStyle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    alignSelf: "center",
  },
  DPcontainerStyle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    borderColor: colors.gray,
    borderWidth: 1,
    justifyContent: "center",
  },
  contactNameStyle: {
    color: colors.black,
    alignSelf: "center",
    fontSize: wp(4.5),
    fontFamily: fonts.medium,
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
