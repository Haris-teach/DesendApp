import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "transparent",
    alignSelf: "center",
    borderRadius: 4,
    borderWidth: 2,
    width: 320,
    height: 52,
    borderColor: "white",

    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    backgroundColor: "rgb(243,243,243)",
    alignSelf: "center",
    borderRadius: 4,
    borderWidth: 2,
    width: 320,
    height: 52,
    borderColor: "#333",

    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 14,
    color: "white",
  },
  imgLeft: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 16,
  },
});

const Button = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity}
      onPress={props.onPress}
    >
      <View style={props.style}>
        {props.imgLeftSrc ? (
          <Image style={props.imgLeftStyle} source={props.imgLeftSrc} />
        ) : null}
        <Text style={props.textStyle}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
