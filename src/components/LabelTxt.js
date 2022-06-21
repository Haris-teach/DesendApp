import React from 'react';
import {Text, View} from 'react-native';
import {colors} from '../constants/colors';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const LabelTxt = ({label}) => {
  return (
    <View
      style={{
        width: wp(100),
        height: 60,
        backgroundColor: themeColor,
        alignContent: 'center',
        marginBottom: 7,
      }}>
      <Text
        style={{
          color: black,
          fontSize: 20,
          fontWeight: 'bold',
          alignSelf: 'center',
          marginVertical: 15,
        }}>
        {label}
      </Text>
    </View>
  );
};

export default LabelTxt;
