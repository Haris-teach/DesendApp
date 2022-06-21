import { View, Text } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";

import BackArrow from "../../../assets/images/svgs/backArrow.svg";

const HelpScreen = (props) => {
  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
      />
      <Text style={styles.loginTextStyle}>Help</Text>
      <View style={styles.subContainerStyle}>
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={{ alignSelf: "center", color: "black" }}>
            Coming Soon
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HelpScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    padding: wp(2),
  },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(7.5),
    fontFamily: fonts.bold,
    color: colors.white,
  },
};
