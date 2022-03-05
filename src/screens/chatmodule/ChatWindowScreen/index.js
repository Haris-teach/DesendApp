import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {colors} from '../../../constants/colors';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {GiftedChat} from 'react-native-gifted-chat';
// import auth from '@react-native-firebase/auth';
import {now} from 'moment';

import {
  addBanUser,
  addBanUserToOtherUserProfile,
  fetchChatMessageOfOneId,
  fetchLiveChatMessages,
  fetchUserData,
  firebaseOnSendMessage,
  onSendMessage,
  updateProfileForUser,
} from '../../apputils/FirebaseHelper';
import {renderLoading} from '../../components/AppLoading';
import {firebase} from '@react-native-firebase/firestore';

const ChatWindowScreen = props => {
  const isDarkMode = useColorScheme() === 'dark';

  let name = useSelector(state => state.ApiData.name);

  const [userId, setUserId] = useState(name); // auth().currentUser.uid,
  const [userName, setUserName] = useState('');
  const [userProfileImage, setUserProfileImage] = useState('');
  const [thread, setThread] = useState([]);
  const [userFcmToken, setUserFcmToken] = useState('');
  // const [otherPersonId, setOtherPersonId] = useState(props.route.params.id)
  const [otherPersonId, setOtherPersonId] = useState(
    name === 'user1' ? 'user2' : 'user1',
  );
  // otherPersonId: 'dF6KPZ2tHtZbxsf5fdh7Luoy1Yy2',
  const [otherPersonName, setOtherPersonName] = useState(null);
  const [otherPersonProfileImage, setOtherPersonProfileImage] = useState(null);
  const [otherPersonThreads, setOtherPersonThreads] = useState([]);
  const [otherPersonFcmToken, setOtherPersonFcmToken] = useState('');

  const [messages1, setMessage1] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [flex, setFlex] = useState(0.9);
  const [showMainView, setShowMainView] = useState(true);
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isBlock, setIsBlock] = useState(true);
  const [price, setPrice] = useState(10);
  const [blockedUser, setBlockedUser] = useState([]);
  const [otherPersonBlockedUser, setOtherPersonBlockedUser] = useState([]);
  const [blockByCurrentUser, setBlockByCurrentUser] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.darker : colors.lighter,
  };

  useEffect(() => {
    if (firebase.apps.length) {
      firebase.app();
    } else {
      firebase.initializeApp();
    }

    getUserData();
    fetchOtherPersonData();
  }, []);

  const getUserData = () => {
    setLoading(true);

    fetchUserData(userId, resp => {
      if (resp === undefined || resp._data === undefined) {
        console.log('No Data Found');
        setLoading(false);
      } else {
        setLoading(false);
        setUserName(resp._data.name);
        setUserProfileImage(resp._data.profileImage);
        setThread(resp._data.chatThreads);
        setUserFcmToken(resp._data.fcmToken);
        setBlockedUser(resp._data.blockUsers);
      }
    });
  };

  const fetchOtherPersonData = () => {
    setLoading(true);
    fetchUserData(otherPersonId, resp => {
      if (resp === undefined || resp._data === undefined) {
        console.log('No Data Found');
        setLoading(false);
      } else {
        setOtherPersonName(resp._data.name);
        setOtherPersonProfileImage(resp._data.profileImage);
        setOtherPersonThreads(resp._data.chatThreads);
        setOtherPersonFcmToken(resp._data.fcmToken);
        setOtherPersonBlockedUser(resp._data.blockUsers);
        setLoading(false);
      }
    });
  };

  const onSendMessage = (newMessages = []) => {
    // console.log("onSendMessage", JSON.stringify(newMessages));
    if (newMessages.length > 0 && newMessages[0].text.length > 0) {
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

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages),
      );

      let sentMessage = newMessages[0];
      let message;
      fetchChatMessageOfOneId(userId, otherPersonId, resp => {
        console.log('Response of participants', resp);
        if (resp) {
          if (resp === 1) {
            message = {
              _id: now(),
              participants: participants,
              text: sentMessage.text,
              createdAt: sentMessage.createdAt,
              user: sentMessage.user,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              if (resp) {
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
                      // console.log("Map Id 1", map.id);
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
                  // console.log("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // console.log("Updated 1")
                } else if (checkValue === 0) {
                  // console.log("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      console.log(
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
                      // console.log("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          console.log(
                            'updateProfileForUser profileResponse222',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // console.log("Not Found2");
                    }
                  });
                } else {
                  // console.log("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // console.log("Updated 2");
                } else if (checkValue2 === 0) {
                  // console.log("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      console.log(
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
              _id: now(),
              participants: otherId,
              text: sentMessage.text,
              createdAt: sentMessage.createdAt,
              user: sentMessage.user,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              // console.log("Response from Firebase after Sending Message", resp)
              if (resp) {
                // console.log("Details", otherPersonFcmToken, userName);
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
                      // console.log("Map Id 1", map.id);
                      checkValue = 1;
                      checkId[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        userId,
                        {chatThreads: checkId},
                        profileResponse => {
                          console.log(
                            'updateProfileForUser profileResponse444',
                            profileResponse,
                          );
                        },
                      );
                    }
                  });
                } else {
                  // console.log("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // console.log("Updated 1")
                } else if (checkValue === 0) {
                  // console.log("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      console.log(
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
                      // console.log("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          console.log(
                            'updateProfileForUser profileResponse666',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // console.log("Not Found2");
                    }
                  });
                } else {
                  // console.log("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // console.log("Updated 2");
                } else if (checkValue2 === 0) {
                  // console.log("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      console.log(
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
              _id: now(),
              participants: participants,
              text: sentMessage.text,
              createdAt: sentMessage.createdAt,
              user: sentMessage.user,
            };
            let currentThread = {
              id: participants,
              sender: sender,
              receiver: receiver,
              lastMessage: message,
            };

            firebaseOnSendMessage(message, resp => {
              console.log('Response from Firebase after Sending Message', resp);
              if (resp) {
                // console.log("Details", otherPersonFcmToken, userName);

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
                      // console.log("Map Id 1", map.id);
                      checkValue = 1;
                      checkId[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        userId,
                        {chatThreads: checkId},
                        profileResponse => {
                          console.log(
                            'updateProfileForUser profileResponse888',
                            profileResponse,
                          );
                        },
                      );
                    }
                  });
                } else {
                  // console.log("Map Thread 1 is empty")
                  checkValue = 0;
                }

                //-------------------------- Update Chat Thread for Current User if No value is Updated -------------------------//

                if (checkValue === 1) {
                  // console.log("Updated 1")
                } else if (checkValue === 0) {
                  // console.log("Not Updated")
                  checkId.push(currentThread);
                  updateProfileForUser(
                    userId,
                    {chatThreads: checkId},
                    profileResponse => {
                      console.log(
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
                      // console.log("Map Id 2", map.id);
                      checkId2[index].lastMessage = currentThread.lastMessage;
                      updateProfileForUser(
                        otherPersonId,
                        {chatThreads: checkId2},
                        profileResponse => {
                          console.log(
                            'updateProfileForUser profileResponse1000',
                            profileResponse,
                          );
                        },
                      );
                    } else {
                      // console.log("Not Found2");
                    }
                  });
                } else {
                  // console.log("Map Thread 2 is empty")
                  checkValue2 = 0;
                }

                //-------------------------- Update Chat Thread for Other User if No value is Updated -------------------------//

                if (checkValue2 === 1) {
                  // console.log("Updated 2");
                } else if (checkValue2 === 0) {
                  // console.log("Not Updated")
                  checkId2.push(currentThread);
                  updateProfileForUser(
                    otherPersonId,
                    {chatThreads: checkId2},
                    profileResponse => {
                      console.log(
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

  const getUserObjectForThread = (id, name, image) => {
    return {
      _id: id,
      name: name,
      profileImage: image,
    };
  };

  const fetchChatMessages = () => {
    setLoading(true);
    fetchChatMessageOfOneId(userId, otherPersonId, resp => {
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
                    message._data.createdAt.seconds * 1000,
                  );
                  messages.push(message._data);
                });
                messages = messages.sort((a, b) => b.createdAt - a.createdAt);

                setMessages(messages);
                setLoading(false);
              } else {
                setLoading(false);
                // console.log("No Chat Found");
              }
            },
          );
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
                    message._data.createdAt.seconds * 1000,
                  );
                  messages.push(message._data);
                });
                messages = messages.sort((a, b) => b.createdAt - a.createdAt);

                setMessages(messages);
                setLoading(false);
              } else {
                setLoading(false);
                // console.log("No Chat Found");
              }
            },
          );
        }
      } else {
        setLoading(false);
        // console.log("No Response")
      }
    });
  };

  const onPressBlockedUser = () => {
    if (isBlock === true) {
      Alert.alert(
        'Block User',
        'Are you sure you want to block this user?',
        [
          {text: 'No', style: 'destructive'},
          {
            text: 'Yes',
            onPress: () => {
              this.blockUser();
            },
          },
        ],
        {cancelable: false},
      );
    } else if (isBlock === false) {
      setTimeout(() => {
        Alert.alert(
          'Unblock User',
          'Are you sure you want to un-block this user?',
          [
            {text: 'No', style: 'destructive'},
            {
              text: 'Yes',
              onPress: () => {
                this.unBlockUser();
              },
            },
          ],
          {cancelable: false},
        );
      }, 200);
    }
  };

  const blockUser = () => {
    setLoading(true);
    // let {blockedUser, otherPersonId} = this.state;
    let tempArray = [];
    if (blockedUser.length === 0) {
      tempArray.push({
        userId: otherPersonId,
        blockId: userId,
      });
    } else {
      blockedUser.map(otherPrsnId => {
        if (otherPrsnId.userId !== otherPersonId) {
          tempArray.push({
            userId: otherPersonId,
            blockId: userId,
          });
        } else {
          tempArray.push(otherPrsnId);
        }
      });
    }

    setTimeout(() => {
      this.addBlockUserToCurrentLoginUser(tempArray);
    }, 200);
  };

  const addBlockUserToCurrentLoginUser = blockedUsers => {
    let {userId} = this.state;
    addBanUser(userId, blockedUsers).then(() => {
      this.addBlockUserToOtherUser();
    });
  };

  const addBlockUserToOtherUser = () => {
    // let {otherPersonBlockedUser, userId} = this.state;
    let tempUserArray = [];
    if (otherPersonBlockedUser.length === 0) {
      tempUserArray.push({
        userId: userId,
        blockId: userId,
      });
    } else {
      otherPersonBlockedUser.map(user => {
        if (user.userId !== userId) {
          tempUserArray.push({
            userId: userId,
            blockId: userId,
          });
        } else {
          tempUserArray.push(user);
        }
      });
    }

    setTimeout(() => {
      this.addBlockUserToOtherPersonProfile(tempUserArray);
    }, 200);
  };

  const addBlockUserToOtherPersonProfile = tempUserArray => {
    // let {otherPersonId} = this.state;
    addBanUserToOtherUserProfile(otherPersonId, tempUserArray).then(() => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(
          'User Block',
          'User block successfully?',
          [
            {
              text: 'Ok',
              onPress: () => {
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
    // let {blockedUser, otherPersonId} = this.state;
    let tempArray = [];
    if (blockedUser.length === 0) {
    } else {
      blockedUser.map(otherPrsnId => {
        if (otherPrsnId.userId === otherPersonId) {
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
    // let {userId} = this.state;
    addBanUser(userId, blockedUsers).then(() => {
      addUnBlockUserToOtherUser();
    });
  };

  const addUnBlockUserToOtherUser = () => {
    // let {otherPersonBlockedUser, userId} = this.state;
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
    // let {otherPersonId} = this.state;

    addBanUserToOtherUserProfile(otherPersonId, tempUserArray).then(() => {
      setLoading(false);
      setTimeout(() => {
        Alert.alert(
          'User Un-Blocked',
          'User UnBlock successfully?',
          [
            {
              text: 'Ok',
              onPress: () => {
                props.navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      }, 1000);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        {renderLoading(loading)}
        {showMainView && (
          <>
            {/* <View style={styles.headerView}>
                            <AppHeader
                                title={otherPersonName}
                                leftIconPath={images.headerLeftBack}
                                rightIconTwoPath={
                                    blockByCurrentUser === false
                                        ? images.blocked_user
                                        : null
                                }
                                onRightIconTwoPress={() => console.log('Blocked')}
                                // onRightIconTwoPress={() => this.onPressBlockedUser()}
                                onLeftIconPress={() => props.navigation.goBack()}
                            />
                            </View> */}

            <View style={[styles.container, {flex: flex}]}>
              <GiftedChat
                messages={messages}
                onSend={messages => onSendMessage(messages)}
                user={{
                  _id: userId,
                  name: userName,
                  avatar: userProfileImage,
                }}
                renderInputToolbar={isBlock === false ? () => null : undefined}
                alwaysShowSend={isBlock}
                showUserAvatar={false}
                showAvatarForEveryMessage={false}
                renderUsernameOnMessage={false}
              />
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatWindowScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  headerView: {
    flex: 0.1,
  },

  container: {
    flex: 0.8,
    backgroundColor: colors.white,
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
