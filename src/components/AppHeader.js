//================================ React Native Imported Files ======================================//

import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import React, {Component, useState} from 'react';

//================================ Local Imported Files ======================================//

import {colors} from '../constants/colors.js';

const AppHeader = props => {
  const [drawerProps, setDrawerProps] = useState(props.nav);
  const nav = props.nav;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: props.bgColor || colors.black},
      ]}>
      <TouchableOpacity
        style={styles.headerProfile}
        onPress={props.onLeftIconPress}>
        {props.leftText !== undefined && (
          <Text style={styles.text}>{props.leftText}</Text>
        )}

        {props.leftIconPath !== undefined && (
          <Image
            resizeMode="contain"
            style={[
              styles.img,
              props.lefticonSize !== undefined
                ? {height: props.lefticonSize, width: props.lefticonSize}
                : {
                    height: 22,
                    width: 22,
                    tintColor: props.tintColor || colors.white,
                  },
            ]}
            source={props.leftIconPath}
          />
        )}
      </TouchableOpacity>
      <View style={styles.headerLogo}>
        {props.titleLogoPath !== undefined && (
          <Image
            style={
              props.titleLogosize !== undefined
                ? {height: props.titleLogosize, width: props.titleLogosize}
                : {width: 30, height: 30}
            }
            source={props.titleLogoPath}
          />
        )}
        {props.title && (
          <Text
            style={[styles.title, {color: props.textColor || colors.white}]}>
            {props.title !== undefined ? props.title : 'Header'}
          </Text>
        )}
      </View>
      <View style={styles.headerMenu}>
        <TouchableOpacity
          style={[styles.headerMenu, {marginLeft: wp(7)}]}
          onPress={props.onRightIconTwoPress}>
          {props.rightIconTwoPath !== undefined && (
            <Image
              resizeMode="contain"
              style={[
                styles.img,
                props.rightIconSize !== undefined
                  ? {height: props.rightIconSize, width: props.rightIconSize}
                  : {
                      height: 24,
                      width: 24,
                      tintColor: props.tintColor || colors.white,
                    },
              ]}
              source={props.rightIconTwoPath}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onRightIconPress}>
          {props.rightIconOnePath !== undefined && (
            <Image
              resizeMode="contain"
              style={[
                styles.img,
                props.rightIconSize !== undefined
                  ? {height: props.rightIconSize, width: props.rightIconSize}
                  : {
                      height: 20,
                      width: 20,
                      tintColor: props.tintColor || colors.white,
                    },
              ]}
              source={props.rightIconOnePath}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerProfile: {
    flex: Platform.OS === 'ios' ? 0.35 : 0.3,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  headerLogo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerMenu: {
    flex: 0.3,
    flexDirection: 'row',
    paddingRight: 13,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: wp(4.5),
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: wp(3),
    color: colors.white,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: wp(2),
    paddingHorizontal: wp(1),
    paddingVertical: wp(0.5),
    borderRadius: wp(0.5),
  },
  img: {
    tintColor: colors.white,
  },
});
