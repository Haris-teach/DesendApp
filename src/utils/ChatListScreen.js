import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NetInfo from '@react-native-community/netinfo';

import colors from '../assets/colors/colors';
import fonts from '../assets/fonts/Fonts';
import commonStyles from '../styles/styles';
import CrossIcon from '../assets/images/delete_red_icon.svg';
import LinesMenuIcon from '../assets/images/lines_menu_icon.svg';
import GradientSelectView from '../components/GradientSelectView';
import LinearGradient from 'react-native-linear-gradient';
import {color} from 'react-native-reanimated';
import WhiteCardView from '../components/WhiteCardView';
import MobileCouple from '../assets/images/mobile_with_couple_avator.svg';
import {
  constant,
  NO,
  SCREEN_CHAT,
  SCREEN_CHAT_GROUP,
  SCREEN_CREATE_GROUP,
  SCREEN_MEMBERSHIP,
  UN_MATCH_USER,
  UN_MATCH_USER_SURE,
  YES,
} from '../utils/constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../assets/images/images';
import {
  fetchChatMessageOfOneIdAndDelete,
  getMsgThreads,
  onSendNotifications,
  updateProfileForUser,
} from '../utils/FirebaseHelper';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {setGroupPartners, setCurrentChatUserName} from '../redux/actions';
import {printLog} from '../utils/GlobalFunctions';
const testList = [1, 2, 3, 4, 5, 6];

let token, id, name, img;

const MatchesComponent = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{alignItems: 'center', marginHorizontal: hp(3)}}>
        <Image
          source={
            props.image != undefined
              ? {uri: props.image}
              : Images.placeHolder_avatar
          }
          style={{
            width: hp(9),
            height: hp(9),
            borderRadius: hp(5),
            backgroundColor: 'lightgrey',
          }}
        />
        <TouchableOpacity
          onPress={props.unmatchOnPress}
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            right: -hp(1),
            width: hp(4),
            height: hp(4),
            alignItems: 'center',
          }}>
          <CrossIcon width={hp(3.5)} height={hp(3.5)} />
        </TouchableOpacity>
        <Text style={{fontFamily: fonts.robotoRegular, fontSize: hp(1.5)}}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const UserListComponent = props => {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={1}>
      <View
        style={{
          width: wp(90),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp(2),
        }}>
        <LinearGradient
          colors={[colors.themePurple, colors.themeBlue]}
          useAngle={true}
          angle={220}
          locations={[0.4, 0.7]}
          style={{
            width: hp(14),
            height: hp(14),
            borderRadius: hp(14),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={
              props.profileImage
                ? {uri: props.profileImage}
                : Images.placeHolder_avatar
            }
            style={{
              width: props.latestMsg ? hp(13) : hp(14),
              height: props.latestMsg ? hp(13) : hp(14),
              borderRadius: props.latestMsg ? hp(13) : hp(14),
              backgroundColor: 'lightgrey',
            }}
          />
        </LinearGradient>
        <TouchableOpacity
          onPress={props.onDeletePress}
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            left: 0,
            width: hp(4),
            height: hp(4),
            alignItems: 'center',
          }}>
          <CrossIcon width={hp(3.5)} height={hp(3.5)} />
        </TouchableOpacity>
        <View style={{marginStart: hp(2), flex: 1}}>
          <Text
            style={[
              styles.textBold,
              {
                fontSize: hp(2),
                alignSelf: 'flex-start',
                marginTop: hp(0),
                marginStart: hp(0),
              },
            ]}>
            {props.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              {
                fontSize: hp(1.5),
                alignSelf: 'flex-start',
                color: colors.blackTextColor,
                marginTop: hp(0.5),
                fontFamily: props.opened
                  ? fonts.robotoRegular
                  : fonts.signikaSemiBold,
              },
            ]}>
            {props.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const GroupListComponent = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.5}
      onLongPress={props.onDeletePress}>
      <View
        style={{
          width: wp(90),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: hp(2),
          marginTop: hp(2),
        }}>
        <View>
          <Image
            source={
              props.backImg ? {uri: props.backImg} : Images.placeHolder_avatar
            }
            style={{
              width: hp(6),
              height: hp(6),
              borderRadius: hp(6),
              backgroundColor: 'lightgrey',
            }}
          />
          <Image
            source={
              props.frontImg ? {uri: props.frontImg} : Images.placeHolder_avatar
            }
            style={{
              width: hp(6),
              height: hp(6),
              borderRadius: hp(6),
              position: 'absolute',
              top: hp(1.5),
              left: hp(1.5),
              alignSelf: 'flex-start',
              backgroundColor: 'grey',
            }}
          />
        </View>

        <View style={{marginStart: hp(3), flex: 1}}>
          <Text
            style={[
              styles.textBold,
              {
                fontSize: hp(2),
                alignSelf: 'flex-start',
                marginTop: hp(0),
                marginStart: hp(0),
              },
            ]}>
            {props.groupName}
          </Text>

          <Text
            numberOfLines={3}
            style={[
              {
                fontSize: hp(1.5),
                alignSelf: 'flex-start',
                color: colors.blackTextColor,
                marginTop: hp(0.5),
                fontFamily: fonts.robotoRegular,
              },
            ]}>
            {props.message}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={[
            {
              fontSize: hp(1.5),
              alignSelf: 'flex-start',
              color: colors.blackTextColor,
              marginTop: hp(0.5),
              fontFamily: fonts.signikaRegular,
            },
          ]}>
          {props.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const ChatListScreen = props => {
  const isFocused = useIsFocused();
  const [groupVisible, setGroupVisible] = useState(false);
  const [matchesList, setMatchesList] = useState(testList);
  const [singleChatList, setSingleChatList] = useState([]);
  const [groupChatList, setGroupChatList] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  let [partnerList, setPartnerList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [connected, setConnected] = useState(true);
  const dispatch = useDispatch();
  const premiumMember = useSelector(state => state.userReducer.premium);
  useEffect(() => {
    getToken();
    printLog('runisrun');
    isFocused && AsyncStorage.setItem('@currentUserChat', '');
  }, [isFocused]);
  const allPartners = () => {
    printLog('Token==>', token);
    const config = {
      method: 'get',
      url: `${constant.baseUrl}profile/admire/matches?page=${currentPage}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        printLog('Response List', response.data.data.matches);
        setPartnerList(
          (partnerList =
            currentPage === 1
              ? response.data.data.matches
              : [...partnerList, ...response.data.data.matches]),
        );
        setTotalPages(response.data.totalPages);
        if (response.data.totalPages > 1) {
          setCurrentPage(currentPage + 1);
        } else {
          setCurrentPage(1);
        }
      })
      .catch(error => {
        printLog('error ', error);
      });
  };
  const getToken = async () => {
    try {
      token = await AsyncStorage.getItem('@token');
      id = await AsyncStorage.getItem('@id');
      name = await AsyncStorage.getItem('@name');
      img = await AsyncStorage.getItem('@img');
      id = JSON.parse(id);
    } catch (e) {
      // error reading value
    }
    allPartners();
    getMsgThreads(id, response => {
      if (response.chatThreads) {
        let chatList = response.chatThreads.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt) -
            new Date(a.lastMessage.createdAt),
        );
        setSingleChatList(chatList);
      }

      if (response.groupThreads) {
        let groupList = response.groupThreads;
        if (groupList.length > 1)
          groupList = groupList.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        setGroupChatList(groupList);
        groupList.length > 0 && setGroupVisible(true);
      }
    });
  };
  const removePartner = partnerId => {
    var config = {
      method: 'delete',
      url: `${constant.baseUrl}profile/admire/unmatch/${partnerId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(response => {
        allPartners();
        let tempArray = singleChatList.filter((element, index) => {
          return (
            `${partnerId}/${id}` != element.id &&
            `${id}/${partnerId}` != element.id
          );
        });
        updateProfileForUser(id, {chatThreads: tempArray}, isSuccess => {
          if (isSuccess) {
            fetchChatMessageOfOneIdAndDelete(`${id}`, `${partnerId}`, () => {});
            setSingleChatList(tempArray);
          } else {
            SimpleToast.show('Check your connection');
          }
        });
      })
      .catch(error => {
        printLog(error.response);
      });
  };
  return (
    <SafeAreaView style={[commonStyles.mainContainer]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          commonStyles.mainContainerScroll,
          {alignItems: 'center', paddingBottom: hp(3)},
        ]}>
        <View style={styles.topContainer}>
          <Text style={styles.textBold}>Matches</Text>
          {partnerList.length > 0 ? (
            <FlatList
              data={partnerList}
              horizontal={true}
              onEndReached={() => {
                if (currentPage <= totalPages) allPartners();
              }}
              // onEndReachedThreshold={0.5}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: hp(1),
              }}
              renderItem={({item}) => {
                let obj;
                if (id === item.from) {
                  obj = item.admireToUser;
                } else {
                  obj = item.admireFromUser;
                }
                return (
                  obj && (
                    <MatchesComponent
                      name={obj.username}
                      image={
                        obj.UserPhotos.length >= 1
                          ? obj.UserPhotos[0].url
                          : undefined
                      }
                      unmatchOnPress={() => {
                        Alert.alert(
                          UN_MATCH_USER,
                          UN_MATCH_USER_SURE,
                          [
                            {text: NO, style: 'destructive'},
                            {
                              text: YES,
                              onPress: () => {
                                removePartner(obj.id);
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }}
                      onPress={() => {
                        props.navigation.navigate(SCREEN_CHAT, {
                          otherPersonId: obj.id,
                          otherPersonName: obj.username,
                          otherPersonImg:
                            obj.UserPhotos.length >= 1
                              ? obj.UserPhotos[0].url
                              : undefined,
                        });
                      }}
                    />
                  )
                );
              }}
            />
          ) : (
            <Text
              style={[
                styles.textBold,
                {
                  width: wp(100),
                  textAlign: 'center',
                  marginStart: 0,
                  fontFamily: fonts.signikaRegular,
                  fontSize: hp(2.2),
                  marginTop: hp(2),
                  marginBottom: hp(2),
                },
              ]}>
              Start matching with people{'\n'}to make connections!
            </Text>
          )}
        </View>
        <View
          style={{
            width: wp(100),
            marginTop: hp(2),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.textBold, {fontSize: hp(4.5)}]}>Chats</Text>
          <TouchableOpacity
            style={{marginEnd: hp(2)}}
            onPress={() => {
              setGroupVisible(false);
            }}>
            <LinesMenuIcon />
          </TouchableOpacity>
        </View>
        {!groupVisible ? (
          <GradientSelectView
            containerStyle={styles.buttonContainer}
            buttonText={'Connect with more people with Group Chats!'}
            TextStyle={[
              styles.textBold,
              {fontSize: hp(2), color: 'white', marginStart: 0},
            ]}
            btnStyle={styles.BtnView}
            onPress={() => {
              setGroupVisible(true);
            }}
            gradientColorStart={colors.themeBlue}
            gradientColorEnd={colors.themePurple}
          />
        ) : (
          <View
            style={{width: wp(100), alignItems: 'center', marginTop: hp(0.5)}}>
            <View
              style={{
                width: wp(100),
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  styles.textBold,
                  {
                    fontSize: hp(2.5),
                    alignSelf: 'flex-start',
                    marginStart: hp(2),
                  },
                ]}>
                Group Chats
              </Text>
              <WhiteCardView
                morphismStyle={styles.morphismStyle}
                onPress={() =>
                  premiumMember
                    ? props.navigation.navigate(SCREEN_CREATE_GROUP, {
                        partnerList: partnerList,
                        userId: id,
                      })
                    : props.navigation.navigate(SCREEN_MEMBERSHIP)
                }
                inputTextSTyle={[
                  styles.textBold,
                  {fontSize: hp(1.5), marginStart: 0},
                ]}
                text={'New Group'}
              />
            </View>
            {groupChatList.length > 0 ? (
              <FlatList
                data={groupChatList}
                contentContainerStyle={{
                  marginBottom: hp(3),
                }}
                renderItem={({item, index}) => {
                  return (
                    <GroupListComponent
                      date={
                        item.createdAt
                          ? moment(item.createdAt).format('YYYY-MM-DD')
                          : undefined
                      }
                      message={
                        premiumMember
                          ? item.lastMessage
                            ? item.lastMessage.text.trim()
                              ? item.lastMessage.text
                              : item.lastMessage.image.trim()
                              ? 'Photo'
                              : ''
                            : ''
                          : ''
                      }
                      onDeletePress={() => {
                        let inGroup = item.participants
                          .split('/')
                          .some((item, index) => item == id);
                        if (!inGroup) {
                          let tempArray = groupChatList.filter(
                            (element, index) => element._id != item._id,
                          );
                          Alert.alert(
                            'Delete Group',
                            'Are you sure you want to delete this group?',
                            [
                              {text: NO, style: 'default'},
                              {
                                text: YES,
                                onPress: () => {
                                  updateProfileForUser(
                                    id,
                                    {groupThreads: tempArray},
                                    isSuccess => {
                                      if (isSuccess)
                                        setGroupChatList(tempArray);
                                      else {
                                        SimpleToast.show(
                                          'Check your connection',
                                        );
                                      }
                                    },
                                  );
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        }
                      }}
                      frontImg={
                        item.lastMessage
                          ? item.lastMessage.user.avatar
                          : undefined
                      }
                      backImg={img ? img : undefined}
                      groupName={item.groupName}
                      onPress={() => {
                        {
                          // dispatch(setGroupPartners(item.participants));
                        }
                        premiumMember
                          ? props.navigation.navigate(SCREEN_CHAT_GROUP, {
                              userId: id,
                              currentUserName: name,
                              currenUserImg: img,
                              groupId: item._id,
                              groupName: item.groupName,
                              participant: item.participants,
                            })
                          : props.navigation.navigate(SCREEN_MEMBERSHIP);
                      }}
                    />
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  marginTop: hp(2),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.signikaRegular,
                    fontSize: wp(4.5),
                    marginBottom: hp(2),
                    color: colors.blackTextColor,
                  }}>
                  No Group conversations yet!
                </Text>
                <MobileCouple width={wp(80)} />
              </View>
            )}
          </View>
        )}

        <Text
          style={[
            styles.textBold,
            {
              fontSize: hp(2.5),
              alignSelf: 'flex-start',
              marginTop: hp(2),
              marginStart: hp(4),
            },
          ]}>
          Conversations
        </Text>
        {singleChatList.length > 0 ? (
          <FlatList
            data={singleChatList}
            renderItem={({index, item}) => {
              let obj,
                opened = true;
              if (id === item.receiver._id) {
                obj = item.sender;
              } else {
                obj = item.receiver;
              }
              if (!item.lastMessage.seen) {
                if (id == item.receiver._id) {
                  // opened = false;
                }
              }
              return (
                <UserListComponent
                  latestMsg={false}
                  name={obj.name}
                  opened={opened}
                  lastMessage={
                    item.lastMessage.text.trim()
                      ? item.lastMessage.text
                      : item.lastMessage.image.trim()
                      ? 'Photo'
                      : ''
                  }
                  profileImage={obj.profileImage}
                  onDeletePress={() => {
                    let participantArray = item.id.split('/');
                    let tempArray = singleChatList.filter(
                      (element, index) => element.id != item.id,
                    );
                    let otherId;
                    if (participantArray[0] == id) {
                      otherId = participantArray[1];
                    } else if (participantArray[1] == id) {
                      otherId = participantArray[0];
                    }
                    printLog('Delete Data==>', participantArray, otherId, id);
                    Alert.alert(
                      'Delete Chat',
                      'Are you sure you want to delete this chat?',
                      [
                        {text: NO, style: 'default'},
                        {
                          text: YES,
                          onPress: () => {
                            updateProfileForUser(
                              id,
                              {chatThreads: tempArray},
                              isSuccess => {
                                if (isSuccess) {
                                  printLog(
                                    'participantArray',
                                    participantArray,
                                  );
                                  fetchChatMessageOfOneIdAndDelete(
                                    `${id}`,
                                    `${otherId}`,
                                    () => {},
                                  );

                                  setSingleChatList(tempArray);
                                } else {
                                  SimpleToast.show('Check your connection');
                                }
                              },
                            );
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}
                  onPress={() => {
                    props.navigation.navigate(SCREEN_CHAT, {
                      otherPersonId: obj._id,
                      otherPersonName: obj.name,
                      otherPersonImg: obj.profileImage,
                    });
                  }}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(2),
            }}>
            <Text
              style={{
                fontFamily: fonts.signikaRegular,
                fontSize: wp(4.5),
                marginBottom: hp(2),
                color: colors.blackTextColor,
              }}>
              No conversations yet!
            </Text>
            <MobileCouple width={wp(80)} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    width: wp(100),
    backgroundColor: 'white',
    borderBottomLeftRadius: hp(2.5),
    borderBottomRightRadius: hp(2.5),
    paddingVertical: hp(2),
    shadowColor: '#8C8CA3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textBold: {
    fontFamily: fonts.signikaSemiBold,
    color: colors.blackTextColor,
    fontSize: hp(2),
    marginStart: hp(3),
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

  BtnView: {
    height: hp(5.5),
    width: wp(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
    marginTop: hp(1),
    elevation: 10,
  },
  morphismStyle: {
    height: hp(3.5),
    width: wp(24),
    backgroundColor: colors.white,
    shadowRadius: 3,
    shadowOpacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
    marginEnd: hp(2),
  },
});
export default ChatListScreen;
