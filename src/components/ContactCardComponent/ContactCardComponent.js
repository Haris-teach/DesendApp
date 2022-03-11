//================================ React Native Imported Files ======================================//

import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

//================================ Local Imported Files ======================================//

import { colors } from "../../constants/colors";
import fonts from "../../assets/fonts/fonts";
import Msg from "../../assets/images/svgs/bMsg.svg";
import Call from "../../assets/images/svgs/call.svg";

const ContactCardComponent = (props) => {
  const { isFavorite, data } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // props.selected && {backgroundColor: colors.app_black},
      ]}
      onPress={props.mainPress}
      onLongPress={props.onLongPress}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: wp(1),
          //backgroundColor: 'red',
          marginVertical: hp(1),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.imageView}>{props.image}</View>
          <View style={{ marginLeft: wp(6), alignSelf: "center" }}>
            <Text style={styles.nameText} numberOfLines={1}>
              {props.name}
            </Text>
            {/* {props?.data?.company ? (
              <Text
                numberOfLines={1}
                style={[styles.companyText, {color: colors.input_placeholder}]}>
                {props?.data?.company}
              </Text>
            ) : null} */}
          </View>
        </View>
        {data.isRegister && props.isIcons ? (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={props.callOnPress}
              style={{
                alignSelf: "center",
                justifyContent: "center",
                height: hp(8),
                width: wp(10),
                marginRight: wp(2),
                //backgroundColor: "red",
              }}
            >
              <Call alignSelf="center" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={props.msgOnPress}
              style={{
                alignSelf: "center",
                justifyContent: "center",
                height: hp(8),
                width: wp(10),
                marginRight: wp(2),
                //backgroundColor: "red",
              }}
            >
              <Msg alignSelf="center" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(5),
    borderRadius: wp(5),
  },
  imageView: {
    alignSelf: "center",
  },
  imageValue: {
    flex: 1,
    flexDirection: "row",
    height: hp(6),
    width: hp(6),
    borderRadius: wp(4),
    resizeMode: "contain",
  },
  nameView: {
    height: hp(8),
    width: wp(45),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameText: {
    fontSize: wp(4.7),
    color: colors.black,
    fontFamily: fonts.medium,
    width: wp(35),
  },
  companyText: {
    width: wp(40),
    fontSize: wp(3),
    color: colors.white,
    fontFamily: fonts.regular,
  },
  sentTimeView: {
    height: hp(8),
    width: wp(17),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(-2),
    //backgroundColor: 'red',
  },
  borderLine: {
    borderWidth: 0.5,
    borderColor: "#4E515C",
    opacity: 0.2,
  },
});

export default ContactCardComponent;
