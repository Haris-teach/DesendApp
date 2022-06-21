import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import VCamera from "../../../assets/images/svgs/VCamera.svg";
import Mice from "../../../assets/images/svgs/mice.svg";
import Speaker from "../../../assets/images/svgs/speaker.svg";
import PhoneCall from "../../../assets/images/svgs/phoneCall.svg";

var myInterval;

const VideoCallScreen = (props) => {
  const backGroundImage = props.route.params.image;
  const name = props.route.params.name;

  const [timerState, setTimerState] = useState(0);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isMice, setIsMice] = useState(false);

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
    <ImageBackground
      source={{ uri: backGroundImage }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(5, 8, 17, 0)", "rgba(5, 8, 17, 0.85)"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Image
            source={require("../../../assets/images/pngs/profile1.png")}
            style={styles.DPStyle}
          />
          <Text style={styles.NameStyle}>{name}</Text>
          <Text style={styles.RinningStyle}>Rinning...</Text>
          <Text style={styles.counterStyle}>
            {" "}
            {minutes > 59 ? (hours < 10 ? `0${hours}` : hours) : null}{" "}
            {hours === 1 ? `:` : null} {minutes < 10 ? `0${minutes}` : minutes}{" "}
            : {seconds < 10 ? `0${seconds}` : seconds}
          </Text>
        </View>

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
      </LinearGradient>
    </ImageBackground>
  );
};

export default VideoCallScreen;

const styles = {
  DPStyle: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(30),
    alignSelf: "center",
    marginTop: hp(10),
    borderWidth: 1,
    borderColor: colors.gray,
  },
  NameStyle: {
    alignSelf: "center",
    fontSize: wp(6.8),
    fontFamily: fonts.medium,
    letterSpacing: wp(0.5),
    color: colors.white,
    marginTop: hp(1),
  },
  RinningStyle: {
    alignSelf: "center",
    fontSize: wp(4),
    fontFamily: fonts.medium,
    letterSpacing: wp(0.5),
    color: colors.white,
  },
  btnFlex: {
    flex: 0.2,
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
  counterStyle: {
    alignSelf: "center",
    color: "#C8E4FF",
    fontFamily: fonts.medium,
    fontSize: wp(6),
    letterSpacing: wp(0.5),
  },
};
