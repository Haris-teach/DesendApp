import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Video from "react-native-video";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import BackArrow from "../../../assets/images/svgs/backArrow.svg";

const VideoViwer = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={{
          position: "absolute",
          top: hp(4),
          left: wp(2),

          width: wp(15),
          height: hp(5),
          justifyContent: "center",
        }}
      >
        <BackArrow alignSelf="center" />
      </TouchableOpacity>
      <ActivityIndicator
        animating={isLoading}
        color="white"
        style={{ position: "absolute", alignSelf: "center", top: 0, bottom: 0 }}
      />
      <View
        style={{
          width: wp(100),
          height: hp(50),
          justifyContent: "center",
          zIndex: -1,
          flex: 0.5,
        }}
      >
        <Video
          source={{
            uri: props.route.params.uri,
          }}
          onLoad={() => setIsLoading(false)}
          controls={true}
          resizeMode="cover"
          //onEnd={() => setIsLoading(true)}
          style={styles.renderMediaStyle}
        />
      </View>
    </View>
  );
};

export default VideoViwer;

const styles = {
  renderMediaStyle: {
    width: wp(100),
    height: hp(50),
    alignSelf: "center",
  },
};
