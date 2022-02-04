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
import {REGISTER_SCREEN} from "../../../constants/navigators";

const LoginScreen = (props) => {

    const [phoneNumber,setPhoneNumber] = useState('');
    const [formattedValue,setFormattedValue] = useState('');
    const [pin,setPin] = useState('');

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
                    <Text style={styles.headingText}>Login</Text>
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
                            placeholder={'Enter Your PIN Code'}
                            style={[styles.loginInput,{paddingHorizontal:wp(5)}]}
                            secureTextEntry={true}
                            maxLength={4}
                            onChangeText={(text) => setPin(text)}
                            value={pin}
                        />
                    </View>
                    <View style={[styles.bodyHeading,{flexDirection:'row',alignItems:'center',height:hp(5)}]}>
                        <Text style={[styles.subHeadingText,{color:colors.no_account,fontSize:wp(3.8)}]}>Don’t have an account?</Text>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate(REGISTER_SCREEN)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.subHeadingText,{paddingLeft:wp(1),color:colors.app_black,fontSize:wp(4)}]}>Get Registered</Text>
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

export default LoginScreen;
