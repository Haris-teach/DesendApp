import * as React from 'react';
import {StyleSheet} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from "../../../assets/colors/colors";
import fonts from "../../../assets/fonts/fonts";
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.app_black,
    },
    headerView: {
        height: hp(10),
        width: wp(100),
    },
    upperView:{
        height: hp(15),
        width: wp(100),
        justifyContent:'center',
        alignItems:'center'
    },
    headingText:{
        fontFamily:fonts.semi,
        color:colors.white,
        fontSize:wp(7),
        fontWeight:'600'
    },
    subHeadingText:{
        fontFamily:fonts.regular,
        color:colors.app_black,
        fontSize:wp(5),
        fontWeight:'400'
    },
    bodyView:{
        height: hp(75),
        width: wp(100),
        borderTopRightRadius:wp(9),
        borderTopLeftRadius:wp(9),
        backgroundColor:colors.white
    },
    bodyHeading:{
        height:hp(10),
        width:wp(100),
        paddingHorizontal:wp(5),
    },
    loginInput:{
        height: hp(7),
        width:wp(90) ,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: colors.input_back,
        borderRadius: wp(5),
        fontFamily:fonts.regular
    },
    inputStyle:{
        height: hp(7),
        fontFamily:fonts.regular,
        color:colors.app_black
    },
    textContainer:{
        borderTopRightRadius: wp(5),
        borderBottomRightRadius:wp(5),
        backgroundColor:colors.input_back
    },
    numberBox:{
        height:hp(9),
        width:wp(100),
        justifyContent:'center'
    },
    buttonView:{
        height:hp(13),
        alignItems:'center',
        justifyContent:'center',
    },
    imageMainView:{
        height:hp(20),
        justifyContent:'center',
        alignItems:'center'
    }
});

export default styles;
