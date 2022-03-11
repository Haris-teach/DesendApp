import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

const RNButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        flex: props.flex,
        marginHorizontal: props.marginHorizontal,
        height: props.height,
        borderRadius: props.borderRadius,
        backgroundColor: props.btnColor,
        justifyContent: props.justifyContent,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
      }}
      onPress={props.onPress}
      disabled={props.isLoading}
    >
      {props.isLoading ? (
        <ActivityIndicator color="blue" />
      ) : (
        <Text
          style={{
            color: props.textColor,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            alignSelf: "center",
          }}
        >
          {props.btnText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default RNButton;
