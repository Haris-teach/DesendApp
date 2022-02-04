//================================ React Native Imported Files ======================================//

import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {CardStyleInterpolators, createStackNavigator,} from "@react-navigation/stack";

//================================ Local Imported Files ======================================//

import {LOGIN_SCREEN, REGISTER_SCREEN, SPLASH_SCREEN} from "./constants/navigators";
import SplashScreen from "./screens/Auth/SplashScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";

//================================ Icons ======================================//



const RootStack = createStackNavigator();
const Stack = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName={SPLASH_SCREEN}
                screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <RootStack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
                <RootStack.Screen name={LOGIN_SCREEN}  component={LoginScreen} />
                <RootStack.Screen name={REGISTER_SCREEN}  component={RegisterScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};


export default Stack;
