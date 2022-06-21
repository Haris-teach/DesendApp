import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import VCamera from "../../../assets/images/svgs/VCamera.svg";
import Mice from "../../../assets/images/svgs/mice.svg";
import Speaker from "../../../assets/images/svgs/speaker.svg";
import PhoneCall from "../../../assets/images/svgs/phoneCall.svg";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";

// ====================== END =================================
var myInterval;

const AudioCallScreen = (props) => {
  const [timerState, setTimerState] = useState(0);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isMice, setIsMice] = useState(false);

  const name = props.route.params.name;
  const profileImage = props.route.params.image;

  const timer = (sid) => {
    let count = timerState;
    myInterval = setInterval(() => {
      count = count + 1;
      setTimerState(count);
    }, 1000);
  };
  let hours = Math.floor(timerState / 3600);
  let minutes = Math.floor((timerState / 60) % 60);
  let seconds = Math.floor(timerState % 60);

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
      />

      <Text style={styles.nameStyle}>{name}</Text>
      <Text style={styles.counterStyle}>
        {" "}
        {minutes > 59 ? (hours < 10 ? `0${hours}` : hours) : null}{" "}
        {hours === 1 ? `:` : null} {minutes < 10 ? `0${minutes}` : minutes} :{" "}
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>

      <View style={styles.subContainerStyle}>
        <Image source={{ uri: profileImage }} style={styles.DPStyle} />

        <View style={styles.btnFlex}>
          <TouchableOpacity
            onPress={() => setIsSpeaker(!isSpeaker)}
            style={[
              styles.iconStyle,
              {
                backgroundColor: isSpeaker ? "#232323" : "rgba(5, 8, 17, 0.35)",
              },
            ]}
          >
            <Speaker alignSelf="center" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsVideo(!isVideo)}
            style={[
              styles.iconStyle,
              { backgroundColor: isVideo ? "#232323" : "rgba(5, 8, 17, 0.35)" },
            ]}
          >
            <VCamera alignSelf="center" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsMice(!isMice)}
            style={[
              styles.iconStyle,
              { backgroundColor: isMice ? "#232323" : "rgba(5, 8, 17, 0.35)" },
            ]}
          >
            <Mice alignSelf="center" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => clearInterval(myInterval)}
          >
            <PhoneCall alignSelf="center" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioCallScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },

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
    marginTop: hp(10),
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: hp(30),
  },
  counterStyle: {
    alignSelf: "center",
    color: "#C8E4FF",
    fontFamily: fonts.medium,
    fontSize: wp(6),
    letterSpacing: wp(0.5),
  },
  nameStyle: {
    alignSelf: "center",
    marginTop: hp(2),
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: wp(6),
    letterSpacing: wp(0.5),
  },
  btnFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(15),
  },
  iconStyle: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(13),

    justifyContent: "center",
  },
};
