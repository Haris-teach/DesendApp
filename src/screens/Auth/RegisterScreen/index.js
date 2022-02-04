//================================ React Native Imported Files ======================================//

import React, {useState} from 'react';
import {
    View,
    Text,
    Platform,
    TextInput,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import PhoneInput from "react-native-phone-number-input";

//================================ Local Imported Files ======================================//

import images from "../../../assets/images/images";
import colors from "../../../assets/colors/colors";
import styles from './style';
import AppHeader from "../../../components/AppHeader";
import Button from "../../../components/Button";
import {LOGIN_SCREEN} from "../../../constants/navigators";

const RegisterScreen = (props) => {

    const [phoneNumber,setPhoneNumber] = useState('');
    const [formattedValue,setFormattedValue] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <StatusBar backgroundColor={colors.app_black} barStyle={'light-content'}/>
            <ScrollView
                bounces={false}
                style={styles.mainContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <AppHeader
                        leftIconPath={images.back_icon}
                        onLeftIconPress={() => props.navigation.goBack()}
                    />
                </View>
                <View style={styles.upperView}>
                    <Text style={styles.headingText}>Welcome To Desend</Text>
                </View>
                <View style={styles.bodyView}>
                    <View style={[styles.bodyHeading,{justifyContent:'center'}]}>
                        <Text style={styles.subHeadingText}>Enter your information</Text>
                    </View>
                    <View style={styles.numberBox}>
                        <PhoneInput
                            defaultCode="US"
                            layout={"first"}
                            containerStyle={styles.loginInput}
                            textInputStyle={styles.inputStyle}
                            textInputProps={{maxLength:13}}
                            codeTextStyle={{ color: colors.app_black}}
                            textContainerStyle={styles.textContainer}
                            onChangeText={(text) => setPhoneNumber(text)}
                            onChangeFormattedText={(text) => setFormattedValue(text)}
                        />
                    </View>
                    <View style={styles.numberBox}>
                        <TextInput
                            placeholder={'First Name'}
                            style={[styles.loginInput,{paddingHorizontal:wp(5)}]}
                            onChangeText={(text) => setFirstName(text)}
                            value={firstName}
                        />
                    </View>
                    <View style={styles.numberBox}>
                        <TextInput
                            placeholder={'Last Name'}
                            style={[styles.loginInput,{paddingHorizontal:wp(5)}]}
                            onChangeText={(text) => setLastName(text)}
                            value={lastName}
                        />
                    </View>
                    <View style={styles.imageMainView}>

                    </View>
                    <View style={[styles.bodyHeading,{flexDirection:'row',justifyContent:'center',alignItems:'center',height:hp(5)}]}>
                        <Text style={[styles.subHeadingText,{color:colors.no_account,fontSize:wp(3.8)}]}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate(LOGIN_SCREEN)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.subHeadingText,{paddingLeft:wp(1),color:colors.app_black,fontSize:wp(4)}]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonView}>
                        <Button
                            buttonText={'Continue'}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

export default RegisterScreen;
