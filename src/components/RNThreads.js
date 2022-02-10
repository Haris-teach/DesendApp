import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const RNThreads = (props) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={props.onPress}
        style={{
          flexDirection: "row",
          height: props.height,
          marginHorizontal: props.marginHorizontal,
          marginTop: props.marginVertical,
          backgroundColor: props.MBackgroundColor,
        }}
      >
        <Image
          source={props.image}
          resizeMode={props.resizeMode}
          style={{
            width: props.imageWidth,
            height: props.imageHeight,
            borderRadius: props.imageBorderRadius,
            alignSelf: "center",
          }}
        />
        <View
          style={{
            marginLeft: 20,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 2,
            }}
          >
            <Text
              style={{
                fontFamily: props.fontFamily,
                width: props.nameWidth,
                fontSize: props.fontSize,
                color: props.nameColor,
              }}
              numberOfLines={1}
            >
              {props.threadName}
            </Text>
            <Text
              style={{
                fontFamily: props.timeFontFamily,
                width: props.timeWidth,
                fontSize: props.timeFontSize,
                color: props.timeColor,
                alignSelf: "center",
                textAlign: "right",
              }}
              numberOfLines={1}
            >
              {props.time}
            </Text>
            {props.Pin == null ? null : props.Pin}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: props.msgFontFamily,
                width: props.msgWidth,
                fontSize: props.msgFontSize,
                color: props.msgColor,
              }}
              numberOfLines={2}
            >
              {props.msg}
            </Text>
            {props.icon}
          </View>
        </View>
      </TouchableOpacity>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#CACACA",
          opacity: 0.2,
          marginHorizontal: props.linemarginHorizontal,
          marginTop: 10,
        }}
      />
    </>
  );
};

export default RNThreads;
