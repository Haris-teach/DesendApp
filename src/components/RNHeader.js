import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function RNHeader(props) {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={props.leftOnPress} style={styles.leftBtnStyle}>
        {!props.leftIcon ? null : props.leftIcon}
      </TouchableOpacity>
      <Text
        style={{
          alignSelf: "center",
          color: props.headerTextColor,
          fontSize: props.fontSize,
          fontFamily: props.fontFamily,
        }}
      >
        {props.headerText}
      </Text>
      <TouchableOpacity
        onPress={props.rightOnPress}
        style={styles.leftBtnStyle}
      >
        {!props.rightIcon ? null : props.rightIcon}
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  containerStyle: {
    height: hp(6),
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(3),
    marginTop: hp(4),
  },
  leftBtnStyle: {
    width: wp(10),
    justifyContent: "center",
  },
};
