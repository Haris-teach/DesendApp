import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/firestore';
import axios from 'axios';
import {now} from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Neomorph} from 'react-native-neomorph-shadows';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  default as SimpleToast,
  default as Toast,
} from 'react-native-simple-toast';
import colors from '../assets/colors/colors';
import fonts from '../assets/fonts/Fonts';
import Backicon from '../assets/images/backArrow.svg';
import CrossIcon from '../assets/images/cross_dynamic_icon';
import PremiumIcon from '../assets/images/crown_icon.svg';
import Images from '../assets/images/images';
import SearchIcon from '../assets/images/search_dynamic_icon';
import ProgressDialogComponent from '../components/ProgessDialogComponent';
import WhiteCardView from '../components/WhiteCardView';
import commonStyles from '../styles/styles';
import {constant} from '../utils/constants';
import {fetchUserData, updateProfileForUser} from '../utils/FirebaseHelper';
import {printLog} from '../utils/GlobalFunctions';

const SelectedUserComponent = props => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginHorizontal: hp(1),
      }}>
      <TouchableOpacity activeOpacity={1} onPress={props.onPress}>
        <Image
          source={props.image ? {uri: props.image} : Images.placeHolder_avatar}
          style={{
            width: hp(8),
            height: hp(8),
            borderRadius: hp(8),
            backgroundColor: 'lightgrey',
          }}
        />
        <Image
          style={{
            width: hp(8),
            height: hp(8),
            borderRadius: hp(8),
            backgroundColor: '#AC46A1C2',
            opacity: 0.8,
            position: 'absolute',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: hp(8),
            height: hp(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CrossIcon width={hp(6)} height={hp(2.5)} stroke={'white'} />
        </View>
      </TouchableOpacity>
      <Text
        style={{
          color: colors.blackTextColor,
          fontFamily: fonts.signikaRegular,
          fontSize: hp(1.3),
          marginTop: hp(0.2),
        }}>
        {props.name}
      </Text>
    </View>
  );
};
const SearchResultComponent = props => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginVertical: hp(2),
        marginHorizontal: hp(1.5),
      }}>
      <TouchableOpacity activeOpacity={1} onPress={props.onPress}>
        <Image
          source={props.image ? {uri: props.image} : Images.placeHolder_avatar}
          style={{
            width: wp(30),
            height: wp(30),
            borderRadius: wp(30),
            backgroundColor: 'lightgrey',
          }}
        />
        {props.premium && (
          <View
            style={{
              width: wp(8),
              height: wp(8),
              borderRadius: wp(30),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              top: 10,
              end: -hp(0.7),
              position: 'absolute',
              alignSelf: 'flex-end',
            }}>
            <PremiumIcon width={wp(5)} height={wp(5)} />
          </View>
        )}
      </TouchableOpacity>
      <Text
        style={{
          color: colors.blackTextColor,
          fontFamily: fonts.signikaRegular,
          fontSize: hp(2.3),
          marginTop: hp(0.5),
        }}>
        {props.name}
      </Text>
    </View>
  );
};
let userId, token;
const CreateGroupScreen = props => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchResultList, setSearchResultList] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedResultList, setSelectedReultList] = useState([]);
  const [partnerList, setPartnerList] = useState([]);
  const [groupThread, setGroupThread] = useState([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    userId = props.route.params.userId;
    getToken();
    getUserData();
  }, []);

  const filerList = text => {
    const array = partnerList.filter((item, index) =>
      item.username.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchResultList(array);
  };
  const getUserData = () => {
    fetchUserData(userId, resp => {
      if (resp === undefined || resp._data === undefined) {
        printLog('No Data Found', resp.response);
      } else {
        printLog('Data Found', resp);
        setGroupThread(resp._data.groupThreads);
      }
    });
  };
  const getToken = async () => {
    try {
      token = await AsyncStorage.getItem('@token');
    } catch (e) {
      // error reading value
    }
    allPartners();
  };

  const removeData = item => {
    const value = selectedResultList.filter(element => element.id != item.id);
    setSelectedReultList(value);
  };
  const addData = item => {
    const value = selectedResultList.find(element => element.id == item.id);
    if (!value) {
      const tempList = [...selectedResultList];
      tempList.push(item);
      setSelectedReultList(tempList);
    }
  };
  const allPartners = () => {
    const config = {
      method: 'get',
      url: `${constant.baseUrl}chat/matches-and-partners`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        printLog('Response ', response.data.data.users);
        setSearchResultList(response.data.data.users);
        setPartnerList(response.data.data.users);
      })
      .catch(error => {
        printLog('error ', error);
      });
  };
  const createGroup = async () => {
    let selectedIdList = [];
    selectedIdList.push(userId);
    selectedResultList.map((item, index) => {
      selectedIdList.push(item.id);
    });
    const participants = selectedIdList.join('/');
    printLog('participants:', participants);
    const groupId = now();
    await selectedIdList.map((item, index) => {
      updateProfileForUser(
        item,
        {
          groupThreads: firebase.firestore.FieldValue.arrayUnion({
            groupName: groupName,
            participants: participants,
            _id: groupId,
            createdAt: new Date().toISOString(),
          }),
        },
        () => {},
      );
    });
    SimpleToast.show('Group created');
    props.navigation.goBack();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          commonStyles.mainContainerScroll,
          {
            alignItems: 'center',
            paddingBottom: hp(4),
          },
        ]}>
        <View style={styles.headerView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.backView}
            onPress={() => props.navigation.goBack()}>
            <Backicon />
          </TouchableOpacity>
          <Text
            style={{
              // alignSelf: 'center',
              fontSize: wp(5),
              fontFamily: fonts.signikaRegular,
            }}>
            Create Group
          </Text>
        </View>
        <ProgressDialogComponent visible={dialogVisible} />
        <Neomorph
          style={styles.fieldStyle}
          inner
          darkShadowColor="rgba(151, 151, 172, 0.5)" // <- set this
          lightShadowColor="rgba(255, 255, 255, 1)">
          <TextInput
            numberOfLines={1}
            style={styles.searchFieldText}
            placeholder={'Search for people'}
            placeholderTextColor={'#B9B9B9'}
            value={searchText}
            onChangeText={text => {
              filerList(text);
              setSearchText(text);
              // setSearchVisible(text.trim());
            }}
          />
          <TouchableOpacity
            onPress={() => {
              //   searchVisible ? searchResultAPI(searchText) : setSearchText('');
            }}>
            {searchVisible ? (
              <SearchIcon width={hp(3)} height={hp(3)} stroke={'#B9B9B9'} />
            ) : (
              <CrossIcon width={hp(3)} height={hp(2.5)} stroke={'#D2D2D2'} />
            )}
          </TouchableOpacity>
        </Neomorph>
        {selectedResultList.length > 0 && (
          <FlatList
            data={selectedResultList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: hp(2),
              paddingStart: hp(2),
              paddingEnd: hp(2),
              flexGrow: 1,
            }}
            renderItem={({item, index}) => {
              return (
                <SelectedUserComponent
                  name={item.name}
                  image={
                    item.UserPhotos.length >= 1
                      ? item.UserPhotos[0].url
                      : undefined
                  }
                  onPress={() => removeData(item)}
                />
              );
            }}
          />
        )}

        {loading ? (
          <View
            style={{
              height: hp(30),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator
              animating={loading}
              size="large"
              color={colors.themeBlue}
            />
          </View>
        ) : (
          searchResultList.length > 0 && (
            <FlatList
              data={searchResultList}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              contentContainerStyle={{
                width: wp(80),
              }}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => {
                // let obj;

                // if (userId === item.from) {
                //   obj = item.toUser;
                // } else {
                //   obj = item.fromUser;
                // }
                // printLog('userId', userId);
                return (
                  item && (
                    <SearchResultComponent
                      name={item.username}
                      premium={item.premiumMember}
                      image={
                        item.UserPhotos.length >= 1
                          ? item.UserPhotos[0].url
                          : undefined
                      }
                      onPress={() => addData(item)}
                    />
                  )
                );
              }}
            />
          )
        )}

        <Neomorph
          style={styles.fieldStyle}
          inner
          darkShadowColor="rgba(151, 151, 172, 0.5)" // <- set this
          lightShadowColor="rgba(255, 255, 255, 1)">
          <TextInput
            numberOfLines={1}
            style={styles.searchFieldText}
            placeholder={'Group name'}
            maxLength={16}
            placeholderTextColor={'#B9B9B9'}
            value={groupName}
            onChangeText={text => {
              setGroupName(text);
            }}
          />
        </Neomorph>
        <WhiteCardView
          morphismStyle={styles.morphismStyle}
          onPress={() => {
            if (selectedResultList.length < 1) {
              Toast.show('Please add member!');
              return;
            } else if (!groupName.trim()) {
              Toast.show('Please add group name!');
              return;
            }
            createGroup();
          }}
          inputTextSTyle={[
            styles.btntextStyle,
            {
              fontSize: hp(1.7),
              marginStart: 0,
              fontFamily: fonts.signikaSemiBold,
              color: colors.blackTextColor,
            },
          ]}
          text={'Create Group'}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fieldStyle: {
    width: wp(85),
    height: hp(5),
    backgroundColor: colors.fieldbackgrondColor,
    backgroundColor: colors.fieldbackgrondColor,
    shadowRadius: 2,
    shadowOpacity: 0.8,
    borderRadius: wp(10),
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp(3),
    paddingStart: wp(4),
  },
  searchFieldText: {
    width: wp(70),
    color: '#B9B9B9',
    fontFamily: fonts.robotoRegular,
    fontSize: wp(3.5),
  },
  circleImg: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35),
    backgroundColor: '#e4e4e4',
  },
  nameText: {
    fontFamily: fonts.signikaSemiBold,
    color: colors.blackTextColor,
    fontSize: wp(5),
    marginStart: hp(2),
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  btntextStyle: {
    fontSize: wp(3),
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.signikaBold,
  },
  BtnView: {
    height: hp(4),
    width: wp(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
    marginTop: hp(1),
    marginStart: hp(1.5),
    elevation: 10,
  },
  headerView: {
    height: hp(7),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backView: {
    height: hp(5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    position: 'absolute',
    start: 0,
  },
  morphismStyle: {
    height: hp(4),
    width: wp(40),
    backgroundColor: colors.white,
    shadowRadius: 3,
    shadowOpacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
    marginTop: hp(4),
  },
});
export default CreateGroupScreen;
