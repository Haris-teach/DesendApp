import React, { Component } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Dummy from "../assets/images/pngs/splash.png";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

class Avatar extends Component {
  static propTypes = {
    img: Image.propTypes.source,
    placeholder: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    roundedImage: PropTypes.bool,
    roundedPlaceholder: PropTypes.bool,
  };

  static defaultProps = {
    roundedImage: true,
    roundedPlaceholder: true,
  };

  renderImage = () => {
    const { img, width, height, roundedImage } = this.props;
    const { imageContainer, image } = styles;

    const viewStyle = [imageContainer];
    if (roundedImage) viewStyle.push({ borderRadius: 8 });
    return (
      <View style={viewStyle}>
        <Image style={image} source={img} resizeMode="contain" />
      </View>
    );
  };

  renderDummy = () => {
    const { img, width, height, roundedImage } = this.props;
    const { imageContainer, image } = styles;

    const viewStyle = [imageContainer];
    if (roundedImage) viewStyle.push({ borderRadius: 8 });
    return (
      <View style={viewStyle}>
        <Dummy />
      </View>
    );
  };

  renderPlaceholder = () => {
    const { placeholder, width, height, roundedPlaceholder } = this.props;
    const { placeholderContainer, placeholderText } = styles;

    const viewStyle = [placeholderContainer];
    if (roundedPlaceholder) viewStyle.push({ borderRadius: 10 });

    return (
      <View style={viewStyle}>
        <View style={viewStyle}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.01}
            style={[{ fontSize: Math.round(width) / 2 }, placeholderText]}
          >
            {placeholder}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { img, width, height } = this.props;
    const { container } = styles;
    return (
      <View style={[container, this.props.style, { width, height }]}>
        {img ? this.renderImage() : this.renderDummy()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageContainer: {
    overflow: "hidden",
    justifyContent: "center",
    height: "100%",
    //backgroundColor: 'red',
    marginTop: hp(0.5),
  },
  image: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dddddd",
    height: "100%",
  },
  placeholderText: {
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default Avatar;
