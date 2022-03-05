import { View, Text, TextInput } from "react-native";
import React from "react";

const RNTextInput = (props) => {
  return (
    <View
      style={{
        flexDirection: props.flexDirection,
        height: props.height,
        width: props.width,
        justifyContent: props.justifyContent,
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        marginHorizontal: props.marginHorizontal,
        marginTop: props.marginTop,
      }}
    >
      {!props.text ? (
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          editable={props.editable}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          value={props.value}
          onBlur={props.onBlur}
          maxLength={props.maxLength}
          secureTextEntry={props.secureTextEntry}
          //secureTextEntry={true}
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
      ) : (
        <Text
          style={{
            color: "black",
            height: props.height,
            marginLeft: props.marginLeft,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            alignSelf: "center",
          }}
        >
          {props.text}
        </Text>
      )}
    </View>
  );
};

export default RNTextInput;
