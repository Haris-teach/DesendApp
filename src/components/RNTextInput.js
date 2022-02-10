import { View, Text, TextInput } from "react-native";
import React from "react";

const RNTextInput = (props) => {
  return (
    <View
      style={{
        height: props.height,
        width: props.width,
        justifyContent: "center",
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        marginHorizontal: props.marginHorizontal,
        marginTop: props.marginTop,
      }}
    >
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        editable={props.editable}
        keyboardType={props.keyboardType}
        style={{
          color: "black",
          height: props.height,
          marginLeft: props.marginLeft,
          fontFamily: props.fontFamily,
          fontSize: props.fontSize,
          //alignSelf: "center",
          marginTop: 5,
          //backgroundColor: "red",
        }}
      />
    </View>
  );
};

export default RNTextInput;
