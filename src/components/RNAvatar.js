import { View, Text, Image } from "react-native";
import React from "react";

const RNAvatar = (props) => {
  return (
    <View
      style={{
        width: props.viewWidth,
        height: props.viewHeight,
        borderRadius: props.viewBorderRadius,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
        marginHorizontal: props.marginHorizontal,
        flexDirection: "row",
        justifyContent: props.justifyContent,
      }}
    >
      <Image
        source={props.source}
        resizeMode={props.resizeMode}
        style={{
          width: props.count == null ? props.viewWidth : props.width,
          height: props.count == null ? props.viewHeight : props.height,
          borderRadius:
            props.count == null ? props.viewBorderRadius : props.borderRadius,
          alignSelf: "center",
        }}
      />
      {props.count == null ? null : (
        <View
          style={{
            width: props.textWidth,
            height: props.textHeight,
            borderRadius: props.textBorderRadius,
            backgroundColor: props.backgroundColor,
            marginLeft: props.textMarginLeft,
            marginTop: props.textMarginTop,
            borderColor: props.textBorderColor,
            borderWidth: props.textBorderWidth,
          }}
        >
          <Text
            style={{
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              alignSelf: props.alignSelf,
              color: props.countColor,
              alignSelf: "center",
            }}
          >
            {props.count}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RNAvatar;
