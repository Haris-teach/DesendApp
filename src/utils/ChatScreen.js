import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {
  firebase,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {StackActions, useIsFocused} from '@react-navigation/native';
import axios from 'axios';
// import auth from '@react-native-firebase/auth';
import moment, {now} from 'moment';

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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import SimpleToast from 'react-native-simple-toast';
import {backgroundColor} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {useSelector} from 'react-redux';
// import images from '../assets/images';
// import AppHeader from '../../components/AppHeader';
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
import {
  constant,
  NO,
  SCREEN_MEMBERSHIP,
  SCREEN_PROFILE_PREVIEW,
  UN_MATCH_USER,
  UN_MATCH_USER_SURE,
  YES,
} from '../utils/constants';
import {
  addBanUser,
  addBanUserToOtherUserProfile,
  deleteMessage,
  fetchChatMessageOfOneId,
  fetchLiveChatMessages,
  fetchUserData,
  firebaseOnSendMessage,
  getMsgThreads,
  updateProfileForUser,
} from '../utils/FirebaseHelper';
import {printLog} from '../utils/GlobalFunctions';

let token;
const ChatScreen = props => {
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userProfileImage, setUserProfileImage] = useState();
  const [otherPersonId, setOtherPersonId] = useState(
    props.route.params.otherPersonId,
  );
  const premiumMember = useSelector(state => state.userReducer.premium);

  const [otherPersonName, setOtherPersonName] = useState(
    props.route.params.otherPersonName,
  );
  const [otherPersonProfileImage, setOtherPersonProfileImage] = useState(
    props.route.params.otherPersonImg,
  );
  const [reportText, setReportText] = useState('');
  const [reportVisible, setReportVisible] = useState('');
  const [thread, setThread] = useState([]);
  const [userFcmToken, setUserFcmToken] = useState('');
  const [otherPersonThreads, setOtherPersonThreads] = useState([]);
  const [otherPersonFcmToken, setOtherPersonFcmToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockText, setBlockText] = useState('User blocked successfully');
  const [isBlock, setIsBlock] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [blockedUser, setBlockedUser] = useState([]);
  const [matchText, setMatchText] = useState('Unmatch');
  const [otherPersonBlockedUser, setOtherPersonBlockedUser] = useState([]);
  const [blockByCurrentUser, setBlockByCurrentUser] = useState(false);
  const [sendImage, setSendImage] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [tenSecImg, setTenSeImg] = useState(false);
  const [choiceModal, setChoiceModal] = useState(false);
  const [pickerModalVisible, setPickerModal] = useState(false);
  useEffect(async () => {
    await getData();
    if (firebase.apps.length) {
      firebase.app();
    } else {
      firebase.initializeApp();
    }
    printLog('IsFocused', isFocused);
    printLog('UTC', new Date().toISOString());
    let unSubscribe;
    if (userId) {
      isUserMatch();
      getUserData();
      fetchOtherPersonData();
      unSubscribe = fetchChatMessages();
    }
    return () => {
      printLog('Running unmount===>>>', unSubscribe);
      // unSubscribe();
    };
  }, [isFocused, userId]);

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

  const isUserMatch = () => {
    var config = {
      method: 'get',
      url: `${constant.baseUrl}profile/admire/match/${otherPersonId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        printLog('MatchResponse==>', response.data);
        if (response.data.status) {
          setMatchText('Unmatch');
        } else {
          setMatchText('Match');
        }
      })
      .catch(error => {
        setMatchText('Match');
        printLog('MatchErrror==>', error.response);
      });
  };
  const getUserData = () => {
    setLoading(true);
    getMsgThreads(userId, resp => {
      printLog('No Data Found', resp);
      if (!resp) {
        printLog('No Data Found', resp.response);
        setLoading(false);
      } else {
        printLog('Data Found', resp);
        setLoading(false);
        setUserName(resp.name);
        // setOtherPersonProfileImage(resp.profileImage);
        setThread(resp.chatThreads);
        setUserFcmToken(resp.fcmToken);
        if (resp.blockUsers) {
          setBlockedUser(resp.blockUsers);
          resp.blockUsers.map((item, index) => {
            if (item.blockId == otherPersonId && item.userId == userId) {
              setIsBlock(true);
              setBlockByCurrentUser(true);
              setShowMenu(true);
              printLog('Block====>>>', 'BlockByCurrentUser');
            } else if (item.blockId == userId && item.userId == otherPersonId) {
              setIsBlock(true);
              setBlockByCurrentUser(false);
              setShowMenu(false);
              printLog('Block====>>>', 'BlockByOtherUser');
            }
          });
        }
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
  const fetchOtherPersonData = () => {
    setLoading(true);
    fetchUserData(otherPersonId, resp => {
      if (resp === undefined || resp._data === undefined) {
        printLog('No Data Found');
        setLoading(false);
      } else {
        printLog('Data Found other', resp);
        AsyncStorage.setItem('@currentUserChat', resp._data.name);
        setOtherPersonName(resp._data.name);
        setOtherPersonProfileImage(resp._data.profileImage);
        setOtherPersonThreads(resp._data.chatThreads);
        setOtherPersonFcmToken(resp._data.fcmToken);
        resp._data.blockUsers &&
          setOtherPersonBlockedUser(resp._data.blockUsers);
        setLoading(false);
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
      let participants = userId + '/' + otherPersonId;
      let otherId = otherPersonId + '/' + userId;
      let sender = null;
      let receiver = null;

      sender = getUserObjectForThread(userId, userName, userProfileImage);
      receiver = getUserObjectForThread(
        otherPersonId,
        otherPersonName,
        otherPersonProfileImage,
      );

      !setChat &&
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );

      let sentMessage = newMessages[0];

      let message;
      // Check this
      fetchChatMessageOfOneId(userId, otherPersonId, resp => {
        printLog('Response of participants', resp);
        if (resp) {
          if (resp === 1) {
            message = {
              _id: sentMessage._id,
              participants: participants,
              text: sentMessage.text,
              createdAt: new Date().toISOString(),
              user: sentMessage.user,
              image: sentMessage.image,
              seen: false,
              group: false,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              sendNotification(sentMessage.text, sentMessage.image);
              if (resp) {
                //---------------------------- Update Chat Thread for Current User ----------------------------//

                let checkValue = 0;
                let span = participants.split('/');
                let checkId = thread;
                if (checkId.length !== 0) {
                  checkId.map((map, index) => {
                    let split = map.id.split('/');
                    printLog('======>>>>>', span + '----' + split);
                    if (
                      (span[0] === split[0] && span[1] === split[1]) ||
                      (span[0] === split[1] && span[1] === split[0])
                    ) {
                      printLog('RUNNNN>>>>>');
                      checkValue = 1;
                      checkId[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        userId,
                        {chatThreads: checkId},
                        profileResponse => {},
                      );

                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId},
                        profileResponse => {},
                      );
                    }
                  });
                } else {
                  // printLog("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // printLog("Updated 1")
                } else if (checkValue === 0) {
                  // printLog("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse111',
                        profileResponse,
                      );
                    },
                  );
                }

                //---------------------------- Update Chat Thread for Other User ----------------------------//

                let checkValue2 = 0;
                let span1 = participants.split('/');
                let checkId2 = otherPersonThreads;
                if (checkId2.length !== 0) {
                  checkId2.map((map, index) => {
                    let split1 = map.id.split('/');
                    if (
                      (span1[0] === split1[0] && span1[1] === split1[1]) ||
                      (span1[0] === split1[1] && span1[1] === split1[0])
                    ) {
                      checkValue2 = 1;
                      // printLog("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          printLog(
                            'updateProfileForUser profileResponse222',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // printLog("Not Found2");
                    }
                  });
                } else {
                  // printLog("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // printLog("Updated 2");
                } else if (checkValue2 === 0) {
                  // printLog("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse333',
                        profileResponse,
                      );
                    },
                  );
                }
              }
            });
          } else if (resp === 2) {
            message = {
              _id: sentMessage._id,
              participants: otherId,
              text: sentMessage.text,
              createdAt: new Date().toISOString(),
              user: sentMessage.user,
              image: sentMessage.image,
              seen: false,
              group: false,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              sendNotification(sentMessage.text, sentMessage.image);

              // printLog("Response from Firebase after Sending Message", resp)
              if (resp) {
                // printLog("Details", otherPersonFcmToken, userName);
                //---------------------------- Update Chat Thread for Current User ----------------------------//

                let checkValue = 0;
                let span = participants.split('/');
                let checkId = thread;
                if (checkId.length !== 0) {
                  checkId.map((map, index) => {
                    let split = map.id.split('/');
                    if (
                      (span[0] === split[0] && span[1] === split[1]) ||
                      (span[0] === split[1] && span[1] === split[0])
                    ) {
                      // printLog("Map Id 1", map.id);
                      checkValue = 1;
                      checkId[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        userId,
                        {chatThreads: checkId},
                        profileResponse => {
                          printLog(
                            'updateProfileForUser profileResponse444',
                            profileResponse,
                          );
                        },
                      );
                    }
                  });
                } else {
                  // printLog("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // printLog("Updated 1")
                } else if (checkValue === 0) {
                  // printLog("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse555',
                        profileResponse,
                      );
                    },
                  );
                }

                //---------------------------- Update Chat Thread for Other User ----------------------------//

                let checkValue2 = 0;
                let span1 = participants.split('/');
                let checkId2 = otherPersonThreads;
                if (checkId2.length !== 0) {
                  checkId2.map((map, index) => {
                    let split1 = map.id.split('/');
                    if (
                      (span1[0] === split1[0] && span1[1] === split1[1]) ||
                      (span1[0] === split1[1] && span1[1] === split1[0])
                    ) {
                      checkValue2 = 1;
                      // printLog("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          printLog(
                            'updateProfileForUser profileResponse666',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // printLog("Not Found2");
                    }
                  });
                } else {
                  // printLog("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // printLog("Updated 2");
                } else if (checkValue2 === 0) {
                  // printLog("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse777',
                        profileResponse,
                      );
                    },
                  );
                }
              }
            });
          } else if (resp === 3) {
            message = {
              _id: sentMessage._id,
              participants: participants,
              text: sentMessage.text,
              createdAt: new Date().toISOString(),
              user: sentMessage.user,
              image: sentMessage.image,
              seen: false,
              group: false,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              sendNotification(sentMessage.text, sentMessage.image);

              printLog('Response from Firebase after Sending Message', resp);
              if (resp) {
                // printLog("Details", otherPersonFcmToken, userName);

                //---------------------------- Update Chat Thread for Current User ----------------------------//

                let checkValue = 0;
                let span = participants.split('/');
                let checkId = thread;
                if (checkId.length !== 0) {
                  checkId.map((map, index) => {
                    let split = map.id.split('/');
                    if (
                      (span[0] === split[0] && span[1] === split[1]) ||
                      (span[0] === split[1] && span[1] === split[0])
                    ) {
                      // printLog("Map Id 1", map.id);
                      checkValue = 1;
                      checkId[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        userId,
                        {chatThreads: checkId},
                        profileResponse => {
                          printLog(
                            'updateProfileForUser profileResponse888',
                            profileResponse,
                          );
                        },
                      );
                    }
                  });
                } else {
                  // printLog("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // printLog("Updated 1")
                } else if (checkValue === 0) {
                  // printLog("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse999',
                        profileResponse,
                      );
                    },
                  );
                }

                //---------------------------- Update Chat Thread for Other User ----------------------------//

                let checkValue2 = 0;
                let span1 = participants.split('/');
                let checkId2 = otherPersonThreads;
                if (checkId2.length !== 0) {
                  checkId2.map((map, index) => {
                    let split1 = map.id.split('/');
                    if (
                      (span1[0] === split1[0] && span1[1] === split1[1]) ||
                      (span1[0] === split1[1] && span1[1] === split1[0])
                    ) {
                      checkValue2 = 1;
                      // printLog("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          printLog(
                            'updateProfileForUser profileResponse1000',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // printLog("Not Found2");
                    }
                  });
                } else {
                  // printLog("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // printLog("Updated 2");
                } else if (checkValue2 === 0) {
                  // printLog("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      printLog(
                        'updateProfileForUser profileResponse1001',
                        profileResponse,
                      );
                    },
                  );
                }
              }
            });
          }
        }
      });
    } else {
      setLoading(false);
      // alert('Empty');
    }
  };

  const sendNotification = (text, isImage) => {
    isImage = isImage.trim() != '';
    const data = JSON.stringify({
      receiverId: otherPersonId,
      message: text,
      isImage: isImage,
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
    printLog('NotificationConfig:', data);
    axios(config)
      .then(response => {
        printLog('Response Notification:', response.data);
      })
      .catch(error => {
        printLog('Error Notification:', error.response);
      });
  };
  const removePartner = () => {
    var config = {
      method: 'delete',
      url: `${constant.baseUrl}profile/admire/unmatch/${otherPersonId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        printLog('UnMatch response', response.data);
        props.navigation.goBack();
        isFocused = true;
      })
      .catch(error => {
        printLog('UnMatch Error', error);
      });
  };
  const sendImageAPI = (image, messageId, tenSecond) => {
    setModalLoader(true);
    setImageModalVisible(true);
    const formData = new FormData();
    formData.append('isTenSecond', tenSecond);
    formData.append('collectionName', 'ChatMessages');
    formData.append('messageId', messageId);
    formData.append('receiverId', otherPersonId);
    formData.append('senderId', userId);
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    });
    const config = {
      method: 'post',
      url: `${constant.baseUrl}chat/image`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };
    printLog('COnfig', config);
    axios(config)
      .then(response => {
        printLog('Response=>', response.data);
        let message = {
          createdAt: new Date(),
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
  const deleteImageAPI = () => {
    const data = JSON.stringify({
      receiverId: userId,
      senderId: otherPersonId,
    });

    const config = {
      method: 'post',
      url: `${constant.baseUrl}chat/delete-image`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    printLog('COnfig===>>>', config);
    axios(config)
      .then(response => {
        printLog('Response=>', response.data);
      })
      .catch(error => {
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
  const sendAdmire = () => {
    const data = {
      to: otherPersonId,
    };
    var config = {
      method: 'post',
      url: `${constant.baseUrl}profile/admire`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios(config)
      .then(response => {
        printLog(response);

        SimpleToast.show('Request Sent!');
        setMatchText('Unmatch');
      })
      .catch(error => {
        printLog(error.response.data);
        error.response.data.message &&
          SimpleToast.show(error.response.data.message);
      });
  };
  const fetchChatMessages = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      fetchChatMessageOfOneId(userId, otherPersonId, resp => {
        printLog('RESP', resp);
        if (resp) {
          if (resp === 1) {
            let liveMessages = fetchLiveChatMessages(
              userId,
              otherPersonId,
              callback => {
                if (callback.isSuccess) {
                  let rawMessages = callback.response._docs;
                  let messages = [];
                  rawMessages.map(message => {
                    message._data.createdAt = new Date(
                      message._data.createdAt,
                    ).toLocaleString('en-US');
                    printLog('Message===>>>', message._data.createdAt);
                    if (message._data.deleteBy) {
                      message._data.deleteBy.every(
                        (item, index) => item != userId,
                      ) && messages.push(message._data);
                    } else {
                      messages.push(message._data);
                    }
                    // if (isFocused)
                    if (message._data.user._id != userId) {
                      firestore()
                        .collection('ChatMessages')
                        .doc(message._ref._documentPath._parts[1])
                        .update({seen: true});
                    }
                  });
                  messages = messages.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );

                  // let tempThread = thread.map((item, index) => {
                  //   if (item.id == chatThreadId) {
                  //     item.lastMessage.seen = true;
                  //   }
                  //   return item;
                  // });
                  // printLog('tempThread', tempThread);
                  // tempThread.length > 0 &&
                  //   firestore()
                  //     .collection('UserRecords')
                  //     .doc(String(userId))
                  //     .update({chatThreads: tempThread});
                  setMessages(messages);
                  setLoading(false);
                } else {
                  setLoading(false);
                  printLog('No Chat Found');
                }
                deleteImageAPI();
              },
            );

            return resolve(liveMessages);
          } else if (resp === 2) {
            let liveMessages = fetchLiveChatMessages(
              otherPersonId,
              userId,
              callback => {
                if (callback.isSuccess) {
                  let rawMessages = callback.response._docs;
                  let messages = [];
                  rawMessages.map(message => {
                    message._data.createdAt = new Date(
                      message._data.createdAt,
                    ).toLocaleString('en-US');
                    printLog('Message===>>>', message._data.createdAt);
                    if (message._data.deleteBy) {
                      message._data.deleteBy.every(
                        (item, index) => item != userId,
                      ) && messages.push(message._data);
                    } else {
                      messages.push(message._data);
                    }
                    // if (isFocused)
                    if (message._data.user._id != userId) {
                      firestore()
                        .collection('ChatMessages')
                        .doc(message._ref._documentPath._parts[1])
                        .update({seen: true});
                    }
                  });
                  messages = messages.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );

                  // let tempThread = thread.map((item, index) => {
                  //   if (item.id == chatThreadId) {
                  //     item.lastMessage.seen = true;
                  //   }
                  //   return item;
                  // });
                  // printLog('tempThread', tempThread);
                  // tempThread.length > 0 &&
                  //   firestore()
                  //     .collection('UserRecords')
                  //     .doc(String(userId))
                  //     .update({chatThreads: tempThread});
                  setMessages(messages);
                  setLoading(false);
                } else {
                  setLoading(false);
                  // printLog("No Chat Found");
                }
                deleteImageAPI();
              },
            );
            return resolve(liveMessages);
          } else if (resp === 3) {
            let liveMessages = fetchLiveChatMessages(
              userId,
              otherPersonId,
              callback => {
                if (callback.isSuccess) {
                  let rawMessages = callback.response._docs;

                  let messages = [];
                  rawMessages.map(message => {
                    message._data.createdAt = new Date(
                      message._data.createdAt,
                    ).toLocaleString('en-US');
                    printLog('Message===>>>', message._data.createdAt);
                    if (message._data.deleteBy) {
                      message._data.deleteBy.every(
                        (item, index) => item != userId,
                      ) && messages.push(message._data);
                    } else {
                      messages.push(message._data);
                    }
                    // if (isFocused)
                    if (message._data.user._id != userId) {
                      firestore()
                        .collection('ChatMessages')
                        .doc(message._ref._documentPath._parts[1])
                        .update({seen: true});
                    }
                  });
                  messages = messages.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );

                  setMessages(messages);
                  // let tempThread = thread.map((item, index) => {
                  //   if (item.id == chatThreadId) {
                  //     item.lastMessage.seen = true;
                  //   }
                  //   return item;
                  // });
                  // printLog('tempThread', tempThread);
                  // tempThread.length > 0 &&
                  //   firestore()
                  //     .collection('UserRecords')
                  //     .doc(String(userId))
                  //     .update({chatThreads: tempThread});
                  // setMessages(messages);
                  setLoading(false);
                } else {
                  setLoading(false);
                  // printLog("No Chat Found");
                }
                deleteImageAPI();
              },
            );
            return resolve(liveMessages);
          }
          deleteImageAPI();
        } else {
          setLoading(false);
          // printLog('No Response');
        }
      });
    });
  };

  const onPressBlockedUser = () => {
    if (isBlock === false) {
      Alert.alert(
        'Block User',
        'Are you sure you want to block this user?',
        [
          {text: NO},
          {
            text: 'Block',
            onPress: () => {
              blockUser('User blocked successfully');
            },
          },
          {
            text: 'Block & Report',

            onPress: () => {
              setReportVisible(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (isBlock === true) {
      setTimeout(() => {
        Alert.alert(
          'Unblock User',
          'Are you sure you want to un-block this user?',
          [
            {text: NO},
            {
              text: YES,
              onPress: () => {
                unBlockUser();
              },
            },
          ],
          {cancelable: false},
        );
      }, 200);
    }
  };

  const blockUser = text => {
    setLoading(true);
    let tempArray = blockedUser;
    if (tempArray.length === 0) {
      tempArray.push({
        userId: userId,
        blockId: otherPersonId,
      });
    } else {
      let exsit = false;
      tempArray.map((item, index) => {
        if (item.userId == userId && item.blockId == otherPersonId) {
          exsit = true;
        }
      });
      if (!exsit) {
        tempArray.push({
          userId: userId,
          blockId: otherPersonId,
        });
      }
    }
    // else {
    //   tempArray.map(otherPrsnId => {
    //     if (otherPrsnId.userId !== otherPersonId) {
    //       tempArray.push({
    //         userId: otherPersonId,
    //         blockId: userId,
    //       });
    //     } else {
    //       tempArray.push(otherPrsnId);
    //     }
    //   });
    // }

    setTimeout(() => {
      addBlockUserToCurrentLoginUser(tempArray, text);
    }, 200);
  };

  const addBlockUserToCurrentLoginUser = (blockedUsers, text) => {
    printLog('Ban User===>');
    addBanUser(userId, blockedUsers).then(() => {
      printLog('Ban User===>', blockedUsers);
      addBlockUserToOtherUser(text);
    });
  };

  const addBlockUserToOtherUser = text => {
    let tempUserArray = otherPersonBlockedUser;
    if (tempUserArray.length === 0) {
      tempUserArray.push({
        userId: userId,
        blockId: otherPersonId,
      });
    } else {
      let exsit = false;
      tempUserArray.map((item, index) => {
        if (item.userId == userId && item.blockId == otherPersonId) {
          exsit = true;
        }
      });
      if (!exsit) {
        tempUserArray.push({
          userId: userId,
          blockId: otherPersonId,
        });
      }
    }
    //  else {
    //   otherPersonBlockedUser.map(user => {
    //     if (user.userId !== userId) {
    //       tempUserArray.push({
    //         userId: userId,
    //         blockId: userId,
    //       });
    //     } else {
    //       tempUserArray.push(user);
    //     }
    //   });
    // }

    setTimeout(() => {
      addBlockUserToOtherPersonProfile(tempUserArray, text);
    }, 200);
  };

  const addBlockUserToOtherPersonProfile = (tempUserArray, text) => {
    printLog('addBlockUserToOtherPersonProfile', text);
    addBanUserToOtherUserProfile(otherPersonId, tempUserArray).then(() => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(
          'User Blocked',
          `${text}`,
          [
            {
              text: 'Ok',
              onPress: () => {
                setBlockText('User blocked successfully');
                props.navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      }, 1000);
    });
  };

  const unBlockUser = () => {
    setLoading(true);
    // let {blockedUser, otherPersonId} =state;
    let tempArray = [];
    if (blockedUser.length === 0) {
    } else {
      blockedUser.map(otherPrsnId => {
        if (otherPrsnId.blockId === otherPersonId) {
          // tempArray.push({
          //   userId: otherPersonId,
          //   blockId: userId,
          // })
        } else {
          tempArray.push(otherPrsnId);
        }
      });
    }

    setTimeout(() => {
      addUnBlockUserToCurrentLoginUser(tempArray);
    }, 200);
  };

  const addUnBlockUserToCurrentLoginUser = blockedUsers => {
    addBanUser(userId, blockedUsers).then(() => {
      addUnBlockUserToOtherUser();
    });
  };

  const addUnBlockUserToOtherUser = () => {
    let tempUserArray = [];
    if (otherPersonBlockedUser.length === 0) {
    } else {
      otherPersonBlockedUser.map(user => {
        if (user.userId === userId) {
          // tempUserArray.push({
          //   userId:userId,
          //   blockId:userId,
          // })
        } else {
          tempUserArray.push(user);
        }
      });
    }

    setTimeout(() => {
      addUnBlockUserToOtherPersonProfile(tempUserArray);
    }, 200);
  };
  const addUnBlockUserToOtherPersonProfile = tempUserArray => {
    addBanUserToOtherUserProfile(otherPersonId, tempUserArray).then(() => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(
          'User Unblocked',
          'User unblocked successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                // const popAction = StackActions.pop(1);
                // props.navigation.dispatch(popAction);

                props.navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      }, 1000);
    });
  };

  const InputChat = props => {
    return (
      <InputToolbar
        {...props}
        renderActions={props => {
          return (
            <TouchableOpacity
              onPress={() => setChoiceModal(true)}
              style={{
                marginLeft: hp(2),

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
  const sendReport = () => {
    const data = JSON.stringify({
      message: reportText,
    });
    const config = {
      method: 'post',
      url: `${constant.baseUrl}report/user/${otherPersonId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    axios(config)
      .then(response => {
        printLog('RESPONSE=>', response.data);
      })
      .catch(error => {
        printLog('ERROR=>', error.response);
      });
    blockUser('You have successfully reported and blocked this user');
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

            {modalLoader && (
              <ActivityIndicator animating={modalLoader} color={colors.white} />
            )}
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
                if (premiumMember) {
                  setChoiceModal(false);
                  setTenSeImg(true);
                  setPickerModal(true);
                } else {
                  setChoiceModal(false);
                  props.navigation.navigate(SCREEN_MEMBERSHIP);
                }
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
      <Modal visible={reportVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: wp(80),
              backgroundColor: 'white',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.blackTextColor,
                fontSize: wp(4),
                margin: wp(3),
                alignSelf: 'flex-start',
                fontFamily: fonts.signikaRegular,
              }}>
              Report:
            </Text>
            <TextInput
              style={{
                width: wp(70),
                maxHeight: hp(15),
                marginTop: hp(1),
                paddingHorizontal: 3,
                borderColor: 'lightGrey',
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                paddingBottom: 4,
                borderBottomWidth: 1,
              }}
              multiline={true}
              maxLength={250}
              onChangeText={text => {
                setReportText(text);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                marginTop: hp(1),
              }}>
              <Text
                onPress={() => setReportVisible(false)}
                style={{
                  color: colors.blackTextColor,
                  fontSize: wp(4),
                  margin: wp(3),
                  alignSelf: 'flex-start',
                  fontFamily: fonts.signikaRegular,
                }}>
                Cancel
              </Text>
              <Text
                onPress={() => {
                  if (reportText.trim()) {
                    setBlockText(
                      'You have successfully reported and blocked this user',
                    );
                    sendReport();
                    setReportVisible(false);
                  } else {
                    SimpleToast.show('Please add the report');
                  }
                }}
                style={{
                  color: colors.blackTextColor,
                  fontSize: wp(4),
                  margin: wp(3),
                  alignSelf: 'flex-start',
                  fontFamily: fonts.signikaRegular,
                }}>
                Send&Block
              </Text>
            </View>
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
              <Image
                source={
                  otherPersonProfileImage
                    ? {uri: otherPersonProfileImage}
                    : Images.placeHolder_avatar
                }
                style={{
                  width: hp(8),
                  height: hp(8),
                  borderRadius: hp(8),
                  backgroundColor: 'grey',
                }}
              />
              <Text
                style={{
                  color: colors.blackTextColor,
                  fontFamily: fonts.signikaSemiBold,
                  fontSize: hp(2.5),
                  marginStart: hp(1),
                }}>
                {otherPersonName}
              </Text>
            </View>

            {showMenu && (
              <Menu>
                <MenuTrigger>
                  <DotsMenuIcon />
                </MenuTrigger>

                <MenuOptions
                  onPress={() => alert()}
                  optionsContainerStyle={{
                    paddingVertical: 10,
                    alignItems: 'center',
                    width: wp(30),
                    borderRadius: wp(3),
                    marginTop: hp(5),
                  }}>
                  <MenuOption
                    onSelect={() => {
                      props.navigation.navigate(SCREEN_PROFILE_PREVIEW, {
                        data: {id: otherPersonId, partnerId: 0},
                      });
                    }}>
                    <Text style={styles.menuTextStyle}>View Profile</Text>
                  </MenuOption>

                  <MenuOption
                    onSelect={() => {
                      if (matchText === 'Unmatch')
                        Alert.alert(
                          UN_MATCH_USER,
                          UN_MATCH_USER_SURE,
                          [
                            {text: NO},
                            {
                              text: YES,
                              onPress: () => {
                                removePartner();
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      else {
                        sendAdmire();
                      }
                    }}>
                    <Text style={styles.menuTextStyle}>{matchText}</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => onPressBlockedUser()}>
                    <Text style={styles.menuTextStyle}>
                      {blockByCurrentUser ? 'Unblock' : 'Block & Report'}
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
              const msg = {
                ...messages[0],
                image: '',
              };
              // printLog(msg);
              onSendMessage([msg], false);
            }}
            user={{
              _id: userId,
              name: userName,
              avatar: userProfileImage,
            }}
            dateFormat="ddd, MMM D YYYY"
            renderInputToolbar={isBlock ? () => null : undefined}
            alwaysShowSend={!isBlock}
            renderUsernameOnMessage={false}
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
              printLog('====BUBBLE======>>>>>>', props);
              const left = props.position === 'left';
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
                  {!left && (
                    <Text
                      style={{
                        alignSelf: 'flex-end',
                        marginHorizontal: wp(2),
                        marginTop: wp(1),
                        fontSize: wp(3.3),
                        fontWeight: '300',
                        fontFamily: fonts.signikaLight,
                      }}>
                      {props.currentMessage.seen && 'read'}
                    </Text>
                  )}
                </View>
              );
            }}
            renderInputToolbar={!isBlock ? InputChat : () => null}
          />
        </View>
      </View>
      {isBlock && (
        <View style={{bottom: 40, width: wp(100), alignItems: 'center'}}>
          <Text
            style={{
              // backgroundColor: colors.themePurple,
              color: 'black',
              padding: 3,
              fontSize: wp(3.5),
              fontFamily: fonts.signikaRegular,
            }}>
            {showMenu
              ? ' You have blocked this user'
              : 'You are blocked by this user'}
          </Text>
        </View>
      )}
    </MenuProvider>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingTop: Platform.OS === 'ios' ? hp(5) : 0,
  },
  menuTextStyle: {
    fontFamily: fonts.signikaRegular,
    color: colors.blackTextColor,
    fontSize: wp(3.3),
    textAlign: 'center',
    width: wp(26),
    // padding: 5,
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
    marginVertical: hp(0.5),
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
});
