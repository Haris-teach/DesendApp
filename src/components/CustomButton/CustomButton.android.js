import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {colors} from '../../constants/colors';

export const CustomButton = props => {
  const {title = 'Enter', style = {}, textStyle = {}, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, {marginTop: 15}]}>
      <Text style={[styles.text, textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.color_orange,
    shadowColor: colors.color_orange,
    shadowOpacity: 0.4,
    shadowOffset: {height: 10, width: 0},
    shadowRadius: 20,
  },

  text: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
});
