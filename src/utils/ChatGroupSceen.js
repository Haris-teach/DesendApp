import AsyncStorage from '@react-native-async-storage/async-storage';
// import images from '../assets/images';
// import AppHeader from '../../components/AppHeader';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
// import auth from '@react-native-firebase/auth';
import {now} from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  MessageText,
  Send,
  Time,
} from 'react-native-gifted-chat';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {color} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import colors from '../assets/colors/colors';
import fonts from '../assets/fonts/Fonts';
import Backicon from '../assets/images/backArrow.svg';
import CameraIcon from '../assets/images/camera_icon.svg';
import CameraIcon2 from '../assets/images/camer_icon.svg';
import ClockIcon from '../assets/images/clock_icon.svg';
import CrossIcon from '../assets/images/cross_dynamic_icon';
import PremiumIcon from '../assets/images/crown_icon.svg';
import DotsMenuIcon from '../assets/images/dots_menu_icon.svg';
import Images from '../assets/images/images';
import {renderLoading} from '../components/AppLoading';
import {setGroupPartners} from '../redux/actions';
import {
  constant,
  SCREEN_ADD_MEMBER,
  SCREEN_PROFILE_PREVIEW,
} from '../utils/constants';
import {
  deleteMessage,
  fetchChatMessageOfGroup,
  fetchLiveGroupChatMessages,
  fetchUserData,
  firebaseOnSendMessage,
  updateProfileForUser,
} from '../utils/FirebaseHelper';
import {printLog} from '../utils/GlobalFunctions';

let token;
const ChatGroupSceen = props => {
  const isFocused = useIsFocused();
  // const participantsId = useSelector(state => state.userReducer.partners); //'105/99';
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userProfileImage, setUserProfileImage] = useState();
  const [userFcmToken, setUserFcmToken] = useState('');
  const [participantsId, setParticipantsId] = useState(
    props.route.params.participant,
  );
  const [groupId, setGroupId] = useState(props.route.params.groupId);
  const [groupName, setGroupName] = useState(props.route.params.groupName);
  const [particpantList, setPartnerList] = useState(participantsId.split('/'));
  const [userInGroup, setUserInGroup] = useState(true);

  const [thread, setThread] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendImage, setSendImage] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [tenSecImg, setTenSeImg] = useState(false);
  const [choiceModal, setChoiceModal] = useState(false);
  const [pickerModalVisible, setPickerModal] = useState(false);
  const [imagesList, setImagesList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [showMember, setShowMember] = useState(false);

  useEffect(() => {
    printLog('userInGroup', userInGroup, particpantList);
  }, [userInGroup]);

  useEffect(async () => {
    await getData();
    if (firebase.apps.length) {
      firebase.app();
    } else {
      firebase.initializeApp();
    }
    if (userId) {
      getToken();
      AsyncStorage.setItem('@currentUserChat', groupName);
      dispatch(setGroupPartners(participantsId));
      setUserInGroup(particpantList.some((item, index) => item == userId));
      getUserData();
      fetchChatMessages();
    }
  }, [isFocused, participantsId, userId]);

  const getData = async () => {
    let id, name, img;
    id = await AsyncStorage.getItem('@id');
    name = await AsyncStorage.getItem('@name');
    img = await AsyncStorage.getItem('@img');
    token = await AsyncStorage.getItem('@token');
    id = JSON.parse(id);
    setUserId(id);
    setUserName(name);
    setUserProfileImage(img);
  };
  const getUserImages = () => {
    const data = JSON.stringify({
      userIds: participantsId.split('/'),
    });
    const config = {
      method: 'post',
      url: `${constant.baseUrl}chat/group-user-images`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios(config)
      .then(response => {
        printLog('Imagesss', response.data);
        let list = [];
        response.data.data.users.map((item, index) => {
          list.push(item.userPhoto);
        });
        setImagesList(list);
        setUserList(response.data.data.users);
      })
      .catch(error => {
        printLog('Imagess Error', error);
      });
  };
  const getToken = async () => {
    try {
      token = await AsyncStorage.getItem('@token');
    } catch (e) {
      // error reading value
    }
    getUserImages();
  };
  const getUserData = () => {
    setLoading(true);
    fetchUserData(userId, resp => {
      if (resp === undefined || resp._data === undefined) {
        printLog('No Data Found', resp.response);
        setLoading(false);
      } else {
        printLog('Data Found', resp);
        setLoading(false);
        setUserName(resp._data.name);
        setUserProfileImage(resp._data.profileImage);
        setThread(resp._data.groupThreads);
        setUserFcmToken(resp._data.fcmToken);
      }
    });
  };
  const CustomDialog = props => {
    return (
      <Modal
        visible={pickerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setPickerModal(false);
        }}
        didCancel={true}>
        <TouchableWithoutFeedback onPress={() => setPickerModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setPickerModal(false);
                  ImagePickerFromGallery();
                }}>
                <Text style={{fontSize: wp(5), padding: wp(5)}}>
                  Choose from gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setPickerModal(false);
                  if (Platform.OS === 'ios') ImagePickerFromCamera();
                  else requestCameraPermission();
                }}>
                <Text style={{fontSize: wp(5), padding: wp(5)}}>
                  Take from camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'ITL App Camera Permission',
          message:
            'ITL App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePickerFromCamera();
      } else {
        SimpleToast.show('Allow permission from settings');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const ImagePickerFromCamera = state => {
    let options = {
      saveToPhotos: true,
      selectionLimit: 1,
    };
    launchCamera(options, res => {
      if (res.didCancel) {
        printLog('User cancelled image picker');
      } else if (res.errorMessage) {
        printLog('ImagePicker Error: ', res.errorMessage);
      } else {
        setPickerModal(false);
        setImageModalVisible(true);
        setSendImage(res.assets[0]);
        // ImageResizer.createResizedImage(
        //   res.assets[0].uri,
        //   res.assets[0].width,
        //   res.assets[0].height,
        //   'JPEG',
        //   40,
        //   0,
        //   null,
        //   false,
        //   {mode: 'contain', onlyScaleDown: true},
        // )
        //   .then(response => {
        //     printLog('Response==>', response);

        //   })
        //   .catch(error => {
        //     printLog('Error==>', error);
        //   });
      }
    });
  };
  const ImagePickerFromGallery = () => {
    setChoiceModal(false);
    let options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        printLog('User cancelled image picker');
      } else if (res.errorMessage) {
        printLog('ImagePicker Error: ', res.errorMessage);
      } else {
        printLog('Images :', res.assets);
        setImageModalVisible(true);
        setSendImage(res.assets[0]);
        // ImageResizer.createResizedImage(
        //   res.assets[0].uri,
        //   res.assets[0].width,
        //   res.assets[0].height,
        //   'JPEG',
        //   30,
        //   0,
        //   null,
        //   false,
        //   {mode: 'contain', onlyScaleDown: true},
        // )
        //   .then(response => {
        //     printLog('Response==>', response);

        //   })
        //   .catch(error => {
        //     printLog('Error==>', error);
        //   });
      }
    });
  };
  const onSendMessage = (newMessages = [], setChat) => {
    printLog('onSendMessage', newMessages);

    if (newMessages.length > 0) {
      let sender = null;

      sender = getUserObjectForThread(userId, userName, userProfileImage);

      !setChat &&
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );

      let sentMessage = newMessages[0];

      let message;
      return new Promise((resolve, reject) => {
        fetchChatMessageOfGroup(groupId, resp => {
          printLog('Response of participants', resp);
          if (resp) {
            if ((resp === 1, 2, 3)) {
              message = {
                _id: now(),
                participants: participantsId,
                text: sentMessage.text,
                createdAt: new Date().toISOString(),
                user: sentMessage.user,
                image: sentMessage.image,
                groupId: groupId,
                seenBy: [],
                group: true,
              };
              let currentThread = {
                _id: groupId,
                sender: sender,
                lastMessage: message,
                participants: participantsId,
                groupName: groupName,
                createdAt: new Date().toISOString(),
                opened: false,
              };

              firebaseOnSendMessage(message, resp => {
                sendNotification(sentMessage.text, sentMessage.image);
                if (resp) {
                  //---------------------------- Update Chat Thread for Current User ----------------------------//
                  let arrayOfParticipants = participantsId.split('/');
                  printLog('arrayOfParticipants', arrayOfParticipants);

                  //1. Get thread of userId = arrayOfParticipants[0] where groupID = currentGroupID;
                  arrayOfParticipants.map((item, index) => {
                    fetchUserData(item, resp => {
                      if (resp === undefined || resp._data === undefined) {
                        printLog('No Data Found', resp.response);
                      } else {
                        printLog('resp===>>', resp._data.groupThreads);

                        let threadArray = [];
                        if (!resp._data.groupThreads) {
                          threadArray.push(currentThread);
                        } else {
                          threadArray = resp._data.groupThreads;
                          if (
                            threadArray.some(
                              (item, index) => item._id == groupId,
                            )
                          ) {
                            threadArray.map((item, index) => {
                              if (item._id == groupId) {
                                threadArray[index] = currentThread;
                              }
                            });
                          } else {
                            threadArray.push(currentThread);
                          }
                        }
                        updateProfileForUser(
                          item,
                          {groupThreads: threadArray},
                          profileResponse => {},
                        );
                      }
                    });
                  });
                }
              });
            }
          }
        });
      });
    } else {
      setLoading(false);
    }
  };

  const sendImageAPI = (image, messageId, tenSecond) => {
    setModalLoader(true);
    setImageModalVisible(true);
    const formData = new FormData();
    formData.append('isTenSecond', tenSecond);
    formData.append('collectionName', 'ChatMessages');
    formData.append('messageId', messageId);
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    });
    const config = {
      method: 'post',
      url: `${constant.baseUrl}chat/image`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };
    printLog('COnfig', config);
    axios(config)
      .then(response => {
        printLog('Response=>', response.data);
        let message = {
          createdAt: new Date().toISOString(),
          text: '',
          user: {
            _id: userId,
            name: userName,
            avatar: userProfileImage,
          },
          _id: messageId,
        };
        setImageModalVisible(false);
        setModalLoader(false);
        // setMessages(previousMessages =>
        //   GiftedChat.append(previousMessages, [{...message, image: image.uri}]),
        // );
        onSendMessage([{...message, image: response.data.data.url}], false);
      })
      .catch(error => {
        setImageModalVisible(false);
        setModalLoader(false);
        printLog('ERROR=>', error.response);
      });
  };
  const getUserObjectForThread = (id, name, image) => {
    return {
      _id: id,
      name: name,
      profileImage: image,
    };
  };
  const sendNotification = (text, isImage) => {
    isImage = isImage.trim() != '';
    const data = JSON.stringify({
      receiverId: particpantList.filter((item, index) => item != userId),
      message: text,
      isImage: isImage,
      groupName: groupName,
      groupId: groupId,
      groupMembers: participantsId,
    });
    const config = {
      method: 'post',
      url: `${constant.baseUrl}chat/message-notification`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    printLog('Config:', data);
    axios(config)
      .then(response => {
        printLog('Response:', response.data);
      })
      .catch(error => {
        printLog('Error:', error.response);
      });
  };
  const fetchChatMessages = () => {
    setLoading(true);
    new Promise((resolve, reject) => {
      fetchChatMessageOfGroup(groupId, resp => {
        if (resp) {
          if (resp === 1) {
            let liveMessages = fetchLiveGroupChatMessages(groupId, callback => {
              if (callback.isSuccess) {
                let rawMessages = callback.response._docs;
                let messages = [];
                rawMessages.map(message => {
                  printLog('======>>>', message);
                  message._data.createdAt = new Date(
                    message._data.createdAt,
                  ).toLocaleString('en-US');
                  if (
                    message._data.participants
                      .split('/')
                      .some((item, index) => item == userId)
                  ) {
                    messages.push(message._data);
                    if (message._data.user._id != userId) {
                      let array = [];
                      if (message._data.seenBy) {
                        array = message._data.seenBy;
                      }
                      if (!array.includes(userId)) {
                        array.push(userId);
                        firestore()
                          .collection('ChatMessages')
                          .doc(message._ref._documentPath._parts[1])
                          .update({seenBy: array});
                      }
                    }
                  }
                });
                messages = messages.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );

                setMessages(messages);
                setLoading(false);
              } else {
                setLoading(false);
                printLog('No Chat Found');
              }
              printLog('callback1', callback);
            });
          } else if (resp === 2) {
            let liveMessages = fetchLiveGroupChatMessages(groupId, callback => {
              if (callback.isSuccess) {
                let rawMessages = callback.response._docs;
                let messages = [];
                rawMessages.map(message => {
                  message._data.createdAt = new Date(
                    message._data.createdAt,
                  ).toLocaleString('en-US');
                  if (
                    message._data.participants
                      .split('/')
                      .some((item, index) => item == userId)
                  ) {
                    messages.push(message._data);
                    if (message._data.user._id != userId) {
                      let array = [];
                      if (message._data.seenBy) {
                        array = message._data.seenBy;
                      }
                      if (!array.includes(userId)) {
                        array.push(userId);
                        firestore()
                          .collection('ChatMessages')
                          .doc(message._ref._documentPath._parts[1])
                          .update({seenBy: array});
                      }
                    }
                  }
                });
                messages = messages.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );

                setMessages(messages);
                setLoading(false);
              } else {
                setLoading(false);
                // printLog("No Chat Found");
              }
              printLog('callback2', callback);
            });
          } else if (resp === 3) {
            let liveMessages = fetchLiveGroupChatMessages(groupId, callback => {
              if (callback.isSuccess) {
                let rawMessages = callback.response._docs;
                let messages = [];
                rawMessages.map(message => {
                  message._data.createdAt = new Date(
                    message._data.createdAt,
                  ).toLocaleString('en-US');
                  if (
                    message._data.participants
                      .split('/')
                      .some((item, index) => item == userId)
                  ) {
                    messages.push(message._data);
                    if (message._data.user._id != userId) {
                      let array = [];
                      if (message._data.seenBy) {
                        array = message._data.seenBy;
                      }
                      if (!array.includes(userId)) {
                        array.push(userId);
                        firestore()
                          .collection('ChatMessages')
                          .doc(message._ref._documentPath._parts[1])
                          .update({seenBy: array});
                      }
                    }
                  }
                });
                messages = messages.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );

                setMessages(messages);
                setLoading(false);
              } else {
                setLoading(false);
                // printLog("No Chat Found");
              }
              printLog('callback3', callback);
            });
          }
        } else {
          setLoading(false);
        }
      });
    });
  };
  const leaveGroup = async () => {
    setLoading(true);
    let finalList = await particpantList.filter(
      (item, index) => item != userId,
    );
    let finalListString = finalList.join('/');
    let success = false;
    await particpantList.map((item, index) => {
      fetchUserData(item, resp => {
        if (resp === undefined || resp._data === undefined) {
          printLog('No Data Found', resp.response);
        } else {
          printLog('resp===>>', resp._data.groupThreads);
          let threadArray = [];
          printLog('Exist===>>', 'Yessss');
          threadArray = resp._data.groupThreads;
          if (threadArray.some((item, index) => item._id == groupId)) {
            printLog('Exist===>>', 'GroupId exist');
            threadArray.map((item, index) => {
              if (item._id == groupId) {
                threadArray[index].participants = finalListString;
              }
            });
            updateProfileForUser(
              item,
              {groupThreads: threadArray},
              ({isSuccess}) => {
                success = isSuccess;
                printLog('----->>>>>>', particpantList.length, index);
                if (particpantList.length - 1 == index) {
                  printLog('success,==>>', success);
                  setLoading(true);
                  isSuccess && props.navigation.goBack();
                }
              },
            );
          }
        }
      });
    });
    setPartnerList(finalList);
  };
  const InputTool = props => {
    return (
      <InputToolbar
        {...props}
        renderActions={props => {
          return (
            <TouchableOpacity
              onPress={() => setPickerModal(true)}
              style={{
                marginLeft: hp(2),
                // alignSelf: 'center',
                marginBottom: Platform.OS == 'ios' ? 6 : 8,
              }}>
              <CameraIcon width={hp(3.5)} height={hp(3.5)} />
            </TouchableOpacity>
          );
        }}
        renderSend={props => {
          return (
            <Send
              {...props}
              label="SEND"
              textStyle={{
                color: colors.blackTextColor,
                fontFamily: fonts.robotoRegular,
              }}
            />
          );
        }}
        renderComposer={props => {
          return (
            <Composer
              {...props}
              textInputStyle={{
                paddingTop: Platform.OS == 'ios' ? 10 : 12,
                color: 'black',
                lineHeight: undefined,
              }}
            />
          );
        }}
        containerStyle={{
          backgroundColor: 'white',
          borderWidth: 0,
          marginHorizontal: wp(3),
          borderRadius: 32,
          borderTopColor: 'transparent',
        }}
      />
    );
  };

  return (
    <MenuProvider>
      <Modal visible={imageModalVisible} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Platform.OS === 'ios' ? hp(5) : 0,
          }}>
          <View
            style={{
              marginTop: hp(3),
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(95),
              alignItems: 'center',

              flex: 0.1,
              position: 'absolute',
              top: 0,
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{padding: 5}}
              onPress={() => {
                if (!modalLoader) {
                  setImageModalVisible(false);
                  setSendImage('');
                }
              }}>
              {!modalLoader && (
                <CrossIcon width={hp(3)} height={hp(2.5)} stroke={'white'} />
              )}
            </TouchableOpacity>
            {!modalLoader && (
              <TouchableOpacity
                activeOpacity={1}
                style={{padding: 5}}
                onPress={() => {
                  const id = now();
                  sendImageAPI(sendImage, id, tenSecImg);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: wp(4),
                    fontFamily: fonts.signikaSemiBold,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            )}

            {modalLoader && <ActivityIndicator />}
          </View>
          <Image
            source={{uri: sendImage.uri}}
            resizeMode="contain"
            style={{
              flex: 0.9,
              width: wp(100),
              marginTop: hp(3),
              alignSelf: 'center',
            }}
          />
        </View>
      </Modal>
      <Modal
        visible={choiceModal}
        transparent={true}
        animationType="slide"
        onDismiss={() => setChoiceModal(false)}
        onRequestClose={() => setChoiceModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setChoiceModal(false)}
          style={{
            // backgroundColor: 'rgba(0,0,0,0.2)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: hp(2),
              paddingBottom: hp(2),
              borderRadius: hp(2),
              width: wp(70),
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                setChoiceModal(false);
                setTenSeImg(true);
                setPickerModal(true);
              }}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}>
                <LinearGradient
                  colors={[colors.themeBlue, colors.themePurple]}
                  style={{
                    width: wp(22),
                    height: wp(22),
                    borderRadius: wp(22),
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                  }}>
                  <ClockIcon width={wp(8)} height={wp(8)} />
                </LinearGradient>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: wp(8),
                    height: wp(8),
                    borderRadius: wp(8),
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    elevation: 5,
                    bottom: 0,
                    end: -5,
                  }}>
                  <PremiumIcon width={wp(4)} height={wp(4)} />
                </View>
              </View>
              <Text
                style={{
                  marginTop: hp(1.5),
                  fontFamily: fonts.signikaRegular,
                  fontSize: hp(1.5),
                  color: colors.blackTextColor,
                }}>
                10 sec photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={{alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                setChoiceModal(false);
                setTenSeImg(false);
                setPickerModal(true);
              }}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}>
                <LinearGradient
                  colors={[colors.themeBlue, colors.themePurple]}
                  style={{
                    width: wp(22),
                    height: wp(22),
                    borderRadius: wp(22),
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                  }}>
                  <CameraIcon2 width={wp(8)} height={wp(8)} />
                </LinearGradient>
              </View>
              <Text
                style={{
                  marginTop: hp(1.5),
                  fontFamily: fonts.signikaRegular,
                  fontSize: hp(1.5),
                  color: colors.blackTextColor,
                }}>
                Permanent photo
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={showMember}
        animationType="slide"
        onRequestClose={() => setShowMember(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.backgroundColor,
            marginTop: Platform.OS === 'ios' ? hp(5) : 0,
          }}>
          <View
            style={{
              marginTop: hp(3),
              width: wp(100),
            }}>
            <View
              style={{
                width: wp(100),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  padding: 5,
                  marginStart: wp(3),
                  position: 'absolute',
                  start: 0,
                }}
                onPress={() => {
                  setShowMember(false);
                }}>
                <CrossIcon
                  width={hp(3)}
                  height={hp(2.5)}
                  strokeWidth={1.5}
                  stroke={'black'}
                />
              </TouchableOpacity>
              <Text
                style={{
                  // alignSelf: 'center',
                  fontSize: wp(6),
                  fontFamily: fonts.signikaSemiBold,
                }}>
                Members
              </Text>
            </View>
            <FlatList
              data={userList}
              contentContainerStyle={{
                marginTop: wp(5),
                width: wp(90),
                alignSelf: 'center',
              }}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setShowMember(false);
                      props.navigation.navigate(SCREEN_PROFILE_PREVIEW, {
                        data: {id: item.id, partnerId: 0},
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(2),
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        item.userPhoto != null
                          ? {uri: item.userPhoto}
                          : Images.placeHolder_avatar
                      }
                      style={{
                        width: wp(20),
                        height: wp(20),
                        backgroundColor: 'grey',
                        borderRadius: wp(20),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.signikaSemiBold,
                        color: color.blackTextColor,
                        marginStart: wp(5),
                        fontSize: wp(5),
                      }}>
                      {item.username}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <CustomDialog />
      <View style={styles.mainContainer}>
        {renderLoading(loading)}
        <View style={styles.headerView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.backView}
            onPress={() => props.navigation.goBack()}>
            <Backicon />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: hp(2),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: hp(1),
              }}>
              <ProfilePic array={imagesList} />

              <Text
                style={{
                  color: colors.blackTextColor,
                  fontFamily: fonts.signikaSemiBold,
                  fontSize: hp(2.5),
                  marginStart: hp(1),
                }}>
                {groupName}
              </Text>
            </View>

            {userInGroup && (
              <Menu>
                <MenuTrigger>
                  <DotsMenuIcon marginEnd={10} />
                </MenuTrigger>

                <MenuOptions
                  optionsContainerStyle={{
                    paddingVertical: 10,
                    alignItems: 'center',
                    width: wp(30),
                    borderRadius: wp(3),
                    marginTop: hp(5),
                  }}>
                  <MenuOption onSelect={() => setShowMember(true)}>
                    <Text style={styles.menuTextStyle}>View Members</Text>
                  </MenuOption>

                  <MenuOption
                    onSelect={() =>
                      props.navigation.navigate(SCREEN_ADD_MEMBER, {
                        participantsId: participantsId,
                        userId: userId,
                        groupId: groupId,
                        groupName: groupName,
                      })
                    }>
                    <Text style={styles.menuTextStyle}>Add Members</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => {
                      Alert.alert('Leave Group', 'Are you sure?', [
                        {
                          text: 'Cancel',
                          onPress: () => printLog('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => leaveGroup(),
                        },
                      ]);
                    }}>
                    <Text style={[styles.menuTextStyle, {color: 'red'}]}>
                      Leave Group
                    </Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            )}
          </View>
        </View>
        <View
          style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
          <GiftedChat
            messages={messages}
            keyboardShouldPersistTaps="never"
            onLongPress={(context, message) => {
              printLog('message', message);
              message.user._id == userId &&
                Alert.alert('Delete Message!', 'Are you sure?', [
                  {
                    text: 'Cancel',
                    onPress: () => printLog('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => deleteMessage(message._id, () => {}),
                  },
                ]);
            }}
            onSend={messages => {
              printLog('MessageSend', messages);
              const msg = {
                ...messages[0],
                image: '',
              };
              onSendMessage([msg], false);
            }}
            user={{
              _id: userId,
              name: userName,
              avatar: userProfileImage,
            }}
            alwaysShowSend={true}
            dateFormat="ddd, MMM D YYYY"
            renderUsernameOnMessage={true}
            renderTime={props => {
              return (
                <Time
                  {...props}
                  timeTextStyle={{
                    left: {
                      color: '#BDBDBD',
                    },
                    right: {
                      color: '#BDBDBD',
                    },
                  }}
                />
              );
            }}
            renderAvatar={null}
            renderMessageText={props => {
              return (
                <MessageText
                  {...props}
                  textStyle={{
                    left: {
                      color: 'white',
                      paddingTop: hp(1),
                    },
                    right: {
                      color: 'black',
                      paddingTop: hp(1),
                    },
                  }}
                />
              );
            }}
            renderBubble={props => {
              printLog('Propsss', props);
              let text = '';
              const left = props.position === 'left';
              if (
                props.currentMessage.seenBy &&
                props.currentMessage.seenBy.length > 0
              ) {
                text = `Seen by ${props.currentMessage.seenBy.length} member`;

                // if (Object.keys(props.nextMessage).length > 0) {
                //   if (props.nextMessage.user._id == userId) {
                //     if (
                //       props.nextMessage.seenBy &&
                //       !props.nextMessage.seenBy.length > 0
                //     ) {
                //       text = `Seen by ${props.currentMessage.seenBy.length} member`;
                //     }
                //   }
                // } else {
                //   text = `Seen by ${props.currentMessage.seenBy.length} member`;
                // }
              }

              return (
                <View
                  style={[
                    styles.bubbleStyle,
                    {
                      marginRight: left ? 60 : wp(3),
                      marginLeft: left ? wp(3) : 60,
                    },
                  ]}>
                  <LinearGradient
                    useAngle={true}
                    angle={220}
                    colors={
                      left
                        ? [colors.themePurple, colors.themeBlue]
                        : ['white', 'white']
                    }
                    style={styles.messageBoxStyle}>
                    <Bubble
                      {...props}
                      wrapperStyle={{
                        right: {
                          backgroundColor: colors.transparent,
                          marginLeft: 0,
                        },
                        left: {
                          backgroundColor: colors.transparent,
                          marginRight: 0,
                        },
                      }}
                    />
                  </LinearGradient>

                  {left && (
                    <Image
                      source={
                        props.currentMessage.user.avatar
                          ? {uri: props.currentMessage.user.avatar}
                          : Images.placeHolder_avatar
                      }
                      style={{
                        width: wp(7),
                        height: wp(7),
                        borderRadius: wp(7),
                        backgroundColor: colors.themePurple,
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        elevation: 5,
                      }}
                    />
                  )}

                  {!left && text.trim() != '' && (
                    <Text
                      style={{
                        alignSelf: 'flex-end',
                        marginHorizontal: wp(2),
                        marginTop: wp(1),
                        fontSize: wp(2.5),
                        fontWeight: '300',
                        fontFamily: fonts.signikaLight,
                      }}>
                      {text}
                    </Text>
                  )}
                </View>
              );
            }}
            renderInputToolbar={userInGroup ? InputTool : () => null}
          />
        </View>
      </View>
    </MenuProvider>
  );
};

export default ChatGroupSceen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingTop: Platform.OS === 'ios' ? hp(5) : 0,
  },
  menuTextStyle: {
    fontFamily: fonts.signikaRegular,
    color: colors.blackTextColor,
    fontSize: wp(3),
    textAlign: 'center',
    // padding: 5,
    width: wp(26),
  },
  backView: {
    height: hp(5),
    width: wp(20),
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    marginTop: hp(1),
  },
  headerView: {
    height: hp(15),
    borderBottomLeftRadius: hp(4),
    borderBottomRightRadius: hp(4),
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  messageBoxStyle: {
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    borderBottomLeftRadius: wp(4),
    borderBottomRightRadius: wp(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // alignItems: 'center',

    marginTop: 2,
    // width: wp(20),
  },
  bubbleStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: hp(1),
    // alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    // height: Platform.OS === 'ios' ? hp(80) : hp(85),
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  paymentView: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "red",
  },
  buttonStyles: {
    borderRadius: wp(7),
    height: hp(8),
    width: '85%',
    marginBottom: wp(4),
  },
  titleStyles: {
    color: colors.white,
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  imageStyle: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(4),
    backgroundColor: 'grey',
  },
});
const ProfilePic = props => {
  printLog('Images ', props);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        // transform: [{rotate: `${state}deg`}],
      }}>
      {props.array.length > 2 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={
              props.array[2] ? {uri: props.array[2]} : Images.placeHolder_avatar
            }
            style={[styles.imageStyle, {backgroundColor: '#e4e4e4'}]}
          />
          {props.array.length > 3 && (
            <Image
              source={
                props.array[3]
                  ? {uri: props.array[3]}
                  : Images.placeHolder_avatar
              }
              style={[styles.imageStyle, {backgroundColor: '#e4e4e4'}]}
            />
          )}
        </View>
      )}

      <View style={{flexDirection: 'row'}}>
        <Image
          source={
            props.array[0] ? {uri: props.array[0]} : Images.placeHolder_avatar
          }
          style={[styles.imageStyle, {backgroundColor: '#e4e4e4'}]}
        />
        {props.array.length > 1 && (
          <Image
            source={
              props.array[1] ? {uri: props.array[1]} : Images.placeHolder_avatar
            }
            style={[styles.imageStyle, {backgroundColor: '#e4e4e4'}]}
          />
        )}
      </View>
      {props.array.length > 4 && (
        <Image
          source={
            props.array[4] ? {uri: props.array[4]} : Images.placeHolder_avatar
          }
          style={[
            styles.imageStyle,
            {
              backgroundColor: '#e4e4e4',
              position: 'absolute',
            },
          ]}
        />
      )}
    </View>
  );
};
