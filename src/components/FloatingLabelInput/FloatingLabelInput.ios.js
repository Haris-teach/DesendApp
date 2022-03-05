import React, { Component, useEffect } from 'react';
import { View, StatusBar, TextInput, Animated } from 'react-native';
import { color_orange, color_light_grey } from '../../constants/colorContants'

export const FloatingLabelInput = (props) => {
  state = {
    isFocused: false,
  };
  let _animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);


  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });


  const { label, ...props } = this.props;
  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [17, 15],
    }),
    color: this._animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [color_light_grey, color_orange],
    }),
  };


  useEffect = () => {
    Animated.timing(_animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }
  return (
    <View style={{ paddingTop: 18, marginTop: 7 }}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>

      <TextInput
        {...props}
        style={{ height: 40, fontSize: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: '#555' }}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        blurOnSubmit
      />
    </View>
  );
}
