import React, {useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/firestore';
import moment from 'moment';
import {colors} from '../../../constants/colors';
import * as firebaseHelper from '../../apputils/FirebaseHelper';
import Header from '../../components/Header';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {SCREEN_CHAT_WINDOW} from '../../constants';
import MsgComponent from '../../components/MsgComponent';

const MsgHistoryScreen = (props, {navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  let name = useSelector(state => state.ApiData.name);
  // let data = useSelector((state) => state.ApiData.data);

  useEffect(() => {
    getData();
    if (firebase.apps.length) {
      firebase.app();
    } else {
      firebase.initializeApp();
    }
  }, []);

  const getData = async () => {
    //  firebase.initializeApp();
    firebaseHelper.getMsgThreads(name, resp => {
      console.log('firebaseHelper.fetchUserData', resp);
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darker : colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? colors.black : colors.white,
          }}>
          <Text>{name}</Text>

          <TouchableOpacity
            style={{backgroundColor: '#000000', width: 100, height: 40}}
            onPress={() => {
              // console.log("Button", "I am clicked")
              props.navigation.navigate(SCREEN_CHAT_WINDOW);
            }}>
            <Text style={{color: colors.white}}> {'Click Me'}</Text>
          </TouchableOpacity>

          <MsgComponent
            image={
              'https://st3.depositphotos.com/1037987/15097/i/600/depositphotos_150975580-stock-photo-portrait-of-businesswoman-in-office.jpg'
            }
            title={name}
            date={moment(new Date()).fromNow()}
            text={'Last Message'}
            onPress={() => {
              // console.log("MsgComponent", "MsgComponent clicked");
              props.navigation.navigate(SCREEN_CHAT_WINDOW);
            }}
            //   onPress={() => this.onPressChatThread(item)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MsgHistoryScreen;
