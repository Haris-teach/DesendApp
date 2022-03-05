import React, { useState, useEffect, useCallback } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TextInput,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
  Actions,
} from "react-native-gifted-chat";
import * as ImagePicker from "react-native-image-picker";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SwipeListView } from "react-native-swipe-list-view";
import Popover from "react-native-popover-view";

import { useSelector, useDispatch } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { firebase } from "@react-native-firebase/auth";

import { createChatId, sendMessage } from "../../../utils/helper";
import CallIcon from "../../../assets/images/svgs/callIcon.svg";
import VideoIcon from "../../../assets/images/svgs/video.svg";
import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import CirclePlus from "../../../assets/images/svgs/circlePlus.svg";
import CameraIcon from "../../../assets/images/svgs/cameraIcon.svg";
import MicroPhone from "../../../assets/images/svgs/micIcon.svg";
import Fly from "../../../assets/images/svgs/fly.svg";
import ImageIcon from "../../../assets/images/svgs/imageIcon.svg";
import FileIcon from "../../../assets/images/svgs/fileIcon.svg";
import LocationIcon from "../../../assets/images/svgs/locationIcon.svg";
import EmojiIcon from "../../../assets/images/svgs/emojiIcon.svg";
import GifIcon from "../../../assets/images/svgs/gifIcon.svg";
import ContactIcon from "../../../assets/images/svgs/contactIcon.svg";
import DoubleTick from "../../../assets/images/svgs/doubleTick.svg";
import More from "../../../assets/images/svgs/more.svg";

import Delete from "../../../assets/images/svgs/delete.svg";

import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import { setIn } from "formik";

const ChatRoom = (props) => {
  const currentUserId = useSelector((state) => state.authReducer.id);
  const userName = useSelector((state) => state.authReducer.firstName);
  const otherName = props.route.params.userName;
  const otherNumber = props.route.params.userNumber;
  const userID = props.route.params.userId;
  const otherProfile = props.route.params.userProfile;
  let chatId = createChatId([...[currentUserId], ...userID]);

  console.log("OtherUserId:   ", userID);

  const [messages, setMessages] = useState([]);
  const [textMsg, setTextMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isPlusPress, setIsPlusPress] = useState(false);
  const [isIndex, setIsIndex] = useState(1);
  const [url, setUrl] = useState([]);
  const [camUri, setcamUri] = useState(
    "https://toppng.com/uploads/preview/camera-png-11552960266mzp8rla14x.png"
  );
  const [gallUri, setgallUri] = useState(
    "https://png.pngtree.com/png-clipart/20190614/original/pngtree-gallery-vector-icon-png-image_3791336.jpg"
  );
  const [images, setImages] = useState([
    {
      uri: "https://png.pngtree.com/png-clipart/20190614/original/pngtree-gallery-vector-icon-png-image_3791336.jpg",
      width: 20,
      height: 20,
      type: "image/jpeg",
    },
  ]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //collect messages from collection

  useEffect(() => {
    firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot({ includeMetadataChanges: true }, (res) => {
        // console.log('response from messages', res.docs)
        let msgs = [];
        res.docs.forEach((msg) => {
          if (msg.exists) {
            // console.log("_______MEssgage collection---------",msg)
            const {
              id,
              text,
              createdAt,
              user: { name, _id, avatar },
              image,
            } = msg.data();
            let data = {
              id,
              text,
              createdAt: moment(createdAt),
              user: { name, _id, avatar },
              image,
            };
            setIsIndex(id);
            msgs.push(data);
          }
        });
        let Data = msgs.sort(function compare(a, b) {
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setMessages(Data);
        //console.log("----Messages 1234------: ", Data);
      });
  }, []);

  // pick images from gallery

  const PicImage = () => {
    ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1,
      selectionLimit: 0,
    })
      .then((img) => {
        img.assets.forEach((i) => {
          uploadImageToStorage(i.uri);
          return {
            uri: i.uri,
            width: i.width,
            height: i.height,
            type: i.type,
          };
        });
      })
      .catch((e) => alert(e));
  };

  // upload image on fire storage
  const uploadImageToStorage = async (image) => {
    setIsLoading(true);

    const storageRef = storage().ref("chats/");

    // const path = `${user.uid}/${name}.${ext}`;
    var m = moment();
    var ms = m.milliseconds();
    const path = `${currentUserId + ms}`;

    //const Task =  storageRef.child(path).putFile(i.uri);
    const uploadTask = storageRef.child(path).putFile(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("snapShot:   ", snapshot);
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case storage.TaskState.PAUSED:
            break;
          case storage.TaskState.CANCELLED:
            break;
          case storage.TaskState.ERROR:
            break;
          case storage.TaskState.RUNNING:
            break;
        }
      },
      (_err) => {
        console.log("Error: ", _err);
      }
    );
    //   () => {
    //     uploadTask.snapshot.ref.getDownloadURL().then(async (u) => {
    //       setIsLoading(false);
    //       url.push({ uri: u });
    //       setUrl(url);
    //     });
    //   }
    // );
  };

  const onSend = () => {
    sendMessage(
      {
        id: isIndex,
        text: textMsg,
        image: url == [] ? null : JSON.stringify(url),
        createdAt: moment().format(),
        sent: true,

        received: false,
        pending: true,
        otherUserName: otherName,
        otherUserId: userID,
        userNumber: otherNumber,
        user: {
          _id: currentUserId,
          name: userName,
          avatar: "https://placeimg.com/140/140/any",
        },
      },

      [...[currentUserId], ...userID]
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={styles.inputToolbarStyle}>
        <View style={styles.leftIconsStyle}>
          <TouchableOpacity onPress={() => setIsPlusPress(!isPlusPress)}>
            <CirclePlus alignSelf="center" width={wp(5.5)} height={hp(5.5)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <CameraIcon alignSelf="center" width={wp(5.5)} height={hp(5.5)} />
          </TouchableOpacity>
        </View>
        <View style={styles.textInputView}>
          <TextInput
            placeholder="Type your message"
            placeholderTextColor={colors.lightBlack}
            style={styles.textInputStyle}
            multiline={true}
            onChangeText={(text) => setTextMsg(text)}
            onFocus={() => setIsPlusPress(false)}
            value={textMsg}
          />
        </View>
        <View
          style={[
            styles.rightIconsStyle,
            {
              justifyContent: textMsg != "" ? "space-around" : "flex-end",
            },
          ]}
        >
          {textMsg != "" ? (
            <TouchableOpacity
              style={styles.sendBtnStyle}
              onPress={() => {
                onSend();
                setTextMsg("");
                setIsIndex(isIndex + 1);
              }}
            >
              <Fly alignSelf="center" />
            </TouchableOpacity>
          ) : null}
          <MicroPhone alignSelf="center" width={wp(9)} height={hp(9)} />
        </View>
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <SwipeListView
        data={[props.currentMessage]}
        keyExtractor={(item, index) => item.id + index}
        renderItem={() => renderItem(props)}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        renderHiddenItem={(data, rowMap) =>
          renderHiddenItem(data, rowMap, props)
        }
        renderSectionHeader={renderSectionHeader}
        leftOpenValue={75}
        rightOpenValue={-Dimensions.get("window").width}
        rightOpenValue={-70}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        disableRightSwipe={
          props.currentMessage.user._id != currentUserId ? true : false
        }
        disableLeftSwipe={
          props.currentMessage.user._id == currentUserId ? true : false
        }
      />
    );
  };

  const renderItem = (props) => {
    return (
      <View
        style={{
          padding: wp(3),
          borderTopLeftRadius: wp(6),
          borderTopRightRadius: wp(6),
          borderBottomLeftRadius:
            props.currentMessage.user._id == currentUserId ? wp(6) : wp(0),
          borderBottomRightRadius:
            props.currentMessage.user._id != currentUserId ? wp(6) : wp(0),
          backgroundColor:
            props.currentMessage.user._id == currentUserId
              ? colors.sendBubbleColor
              : colors.reciveBubbleColor,
          width: wp(80),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "red",
            marginLeft: wp(3),
          }}
        >
          <Text
            style={{
              color: colors.black,
              fontFamily: fonts.medium,
              fontSize: wp(4),
              alignSelf: "center",
            }}
          >
            {props.currentMessage.user.name}
          </Text>
          <Text
            style={{
              color: colors.lightBlack,
              alignSelf: "center",
              fontSize: wp(3),
            }}
          >
            {moment.utc(props.currentMessage.createdAt).local().format("HH:mm")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color:
                props.currentMessage.user._id == currentUserId
                  ? colors.msgSendTextColor
                  : colors.msgTextColor,
              fontSize: wp(3.5),
              fontFamily: fonts.light,
              marginLeft: wp(2.2),
            }}
          >
            {props.currentMessage.text}
          </Text>

          <View style={{ justifyContent: "center" }}>
            {props.currentMessage.user._id == currentUserId ? (
              <DoubleTick alignSelf="center" />
            ) : null}
          </View>
        </View>
      </View>
    );
  };
  const renderHiddenItem = (data, rowMap, props) => (
    <View style={styles.rowBack}>
      <View
        style={{
          alignSelf:
            props.currentMessage.user._id != currentUserId
              ? "flex-end"
              : "flex-start",
          marginRight: wp(5),
        }}
      >
        <Popover
          from={
            <TouchableOpacity>
              <More marginLeft={wp(5)} />
            </TouchableOpacity>
          }
        >
          <View
            style={{
              backgroundColor: "transparent",
              width: wp(40),
            }}
          >
            <TouchableOpacity style={styles.popUpRowStyle}>
              <Text style={styles.popUpTextStyle}>Forward</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.popUpRowStyle}>
              <Text style={styles.popUpTextStyle}>Copy</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.popUpRowStyle}>
              <Text style={styles.popUpTextStyle}>Delete</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    </View>
  );
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  const renderSectionHeader = ({ section }) => <Text>{section.title}</Text>;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainHeaderContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{ justifyContent: "center" }}
        >
          <BackArrow alignSelf="center" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            width: wp(50),
          }}
        >
          <Image
            source={{
              uri:
                otherProfile == ""
                  ? "https://placeimg.com/140/140/any"
                  : otherProfile,
            }}
            style={styles.headerImageStyle}
          />
          <View style={styles.nameViewStyle}>
            <Text style={styles.nameTextStyle}>{otherName}</Text>
            <Text style={styles.numberTextStyle}>{otherNumber}</Text>
          </View>
        </View>
        <View style={styles.headerBtnStyle}>
          <VideoIcon alignSelf="center" marginHorizontal={wp(2)} />
          <CallIcon alignSelf="center" />
        </View>
      </View>
      <View style={styles.whiteContainerStyle}>
        <View style={{ flex: 0.95 }}>
          <GiftedChat
            messages={messages}
            user={{
              _id: currentUserId,
            }}
            keyExtractor={(item) => item.id}
            placeholder="Write Message"
            renderInputToolbar={renderInputToolbar}
            messagesContainerStyle={{
              marginHorizontal: wp(3),
              marginTop: hp(0.6),
              borderRadius: wp(10),
            }}
            renderBubble={renderBubble}
            isTyping={true}
            alwaysShowSend={false}
            isKeyboardInternallyHandled={false}
          />

          {isPlusPress ? (
            <View style={styles.footerViewStyle}>
              <TouchableOpacity onPress={() => PicImage()}>
                <ImageIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <ContactIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <EmojiIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <GifIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <LocationIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <FileIcon />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ChatRoom;

const styles = {
  mainContainer: { flex: 1, backgroundColor: colors.black },
  mainHeaderContainer: {
    flex: 0.09,
    flexDirection: "row",
    marginHorizontal: wp(6),
    justifyContent: "space-between",
    marginTop: hp(5),
  },
  headerImageStyle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(11),
    alignSelf: "center",
    justifyContent: "center",
  },
  nameViewStyle: {
    flex: 1,
    alignSelf: "center",
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  nameTextStyle: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: wp(4),
  },
  numberTextStyle: {
    color: "white",
    fontFamily: fonts.light,
    fontSize: wp(3),
  },
  headerBtnStyle: { flexDirection: "row", justifyContent: "space-between" },
  whiteContainerStyle: {
    marginTop: hp(4),
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
  },
  inputToolbarStyle: {
    flexDirection: "row",
    marginHorizontal: wp(3),
    backgroundColor: colors.chatfieldColor,
    borderRadius: wp(20),
    height: hp(7),
  },
  leftIconsStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: wp(15),
    alignSelf: "center",
    marginLeft: wp(4),
  },
  textInputView: {
    width: wp(50),
    justifyContent: "center",
    //backgroundColor: "red",
  },
  textInputStyle: {
    textAlignVertical: "bottom",
    marginHorizontal: wp(2),
    maxHeight: hp(10),
    color: colors.black,
  },
  rightIconsStyle: {
    flexDirection: "row",
    width: wp(20),
  },
  sendBtnStyle: {
    alignSelf: "center",
    backgroundColor: colors.floatBtnColor,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(9),
    justifyContent: "center",
  },
  footerViewStyle: {
    flex: 0.06,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: wp(3),
    marginTop: hp(3),
  },
  rowBack: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "rgba(5, 8, 17, 0.06)",
  },

  hiddenTextStyle: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: wp(2.5),
    marginTop: hp(0.5),
    marginRight: wp(10),
  },

  popUpRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(2),
  },
  popUpTextStyle: {
    color: "black",
    alignSelf: "center",
  },
};
