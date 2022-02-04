import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from "../assets/colors/colors";
import fonts from "../assets/fonts/fonts";

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            containerStyle,
            buttonText,
            BackgroundImage,
            TextStyle,
            isImagePath,
            onPress,
            rightText,
            marginTop,
            bgColor,
            borderRadius,
            height,
            width,
            textColor,
            decorationLine,
            fontSize,
            fontWeight,
            marginStart,
            borderWidth,
            borderColor,
            isText,
            isImageStyle,
            fontFamily,
            disabled
        } = this.props;
        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    containerStyle !== undefined
                        ? containerStyle
                        : [
                            styles.container,
                            {
                                height: height || hp(6),
                                width: width || wp(75),
                                marginTop: marginTop,
                                marginStart: marginStart,
                                borderWidth: borderWidth || 1,
                                borderColor: borderColor || colors.btnColor,
                                borderRadius: borderRadius || wp(9),
                                backgroundColor: bgColor || colors.btnColor,
                            },
                        ],
                ]}>
                <ImageBackground
                    source={BackgroundImage}
                    resizeMode={'stretch'}
                    style={styles.imgBackground}>
                    <View style={styles.mainView}>
                        {isImagePath !== undefined ? (
                            <View style={styles.viewImage}>
                                <Image
                                    source={isImagePath}
                                    style={[
                                        isImageStyle !== undefined
                                            ? isImageStyle
                                            : styles.isImageStyle,
                                    ]}
                                    resizeMode={'contain'}
                                />
                            </View>
                        ) : (
                            <View style={styles.viewImage} />
                        )}

                        <Text
                            style={[
                                styles.textStyle,
                                {
                                    fontSize: fontSize || wp(4.2),
                                    width: '100%',
                                    fontWeight: fontWeight || '500',
                                    color: textColor || colors.app_black,
                                    textDecorationLine: decorationLine,
                                    fontFamily: fonts.medium,
                                },
                                TextStyle,
                            ]}>
                            {[isText !== undefined ? 'Button' : buttonText]}
                        </Text>

                        <Text style={styles.rightText}>{rightText}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
}

export default Button;

const styles = StyleSheet.create({
    container: {},
    imgBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewImage: {
        flex: 0.13,
    },
    isImageStyle: {
        width: 30,
        height: 30,
    },
    textStyle: {
        flex: 0.74,
        textAlign: 'center',
    },
    rightText: {
        flex: 0.13,
        textAlign: 'center',
    },
});
