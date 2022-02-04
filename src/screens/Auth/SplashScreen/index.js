//================================ React Native Imported Files ======================================//

import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

//================================ Local Imported Files ======================================//

import {LOGIN_SCREEN} from "../../../constants/navigators";

const SplashScreen = (props) => {

    useEffect(() => {
        setTimeout(() => {
            props.navigation.navigate(LOGIN_SCREEN)
        },1000)
    },[])


    return (
        <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:"center"}}>
            <Text>Splash Screen</Text>
        </View>
    );
};

export default SplashScreen;
