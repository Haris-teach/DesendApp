import { View, Text } from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";

const BookScreen = () => {
  return (
    <View style={{ justifyContent: "center", flex: 1 }}>
      <Text style={{ alignSelf: "center", color: colors.black }}>
        Coming soon
      </Text>
    </View>
  );
};

export default BookScreen;
