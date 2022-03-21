import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import SwitchToggle from "react-native-switch-toggle";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const RNTextInput = (props) => {
  return (
    <TouchableOpacity
      onPress={props.mainPress}
      disabled={props.disabled ? false : true}
      style={{
        flexDirection: props.flexDirection,
        height: props.height,
        width: props.width,
        justifyContent: props.justifyContent,
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        marginHorizontal: props.marginHorizontal,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "black",
              marginLeft: props.marginLeft,
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              alignSelf: "center",
            }}
          >
            {props.text}
          </Text>
          {props.isToggel ? (
            <SwitchToggle
              switchOn={props.on}
              onPress={props.swithContorl}
              circleColorOff={props.offColor}
              circleColorOn={props.onColor}
              backgroundColorOn={props.bgOnColor}
              backgroundColorOff={props.bgoffColor}
              containerStyle={{
                width: wp(11),
                height: hp(3),
                borderRadius: wp(5),
                marginRight: wp(5),
                borderColor: props.borderColor,
                borderWidth: 1,
              }}
              circleStyle={{
                width: wp(7),
                height: wp(7),
                borderRadius: wp(7),
                borderColor: props.circleBColor,
                borderWidth: 1,
              }}
            />
          ) : (
            props.RightIcon
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RNTextInput;
