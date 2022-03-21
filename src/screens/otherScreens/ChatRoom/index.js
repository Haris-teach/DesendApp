import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
  Image,
  SectionList,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Linking,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { GiftedChat } from "react-native-gifted-chat";
import * as ImagePicker from "react-native-image-picker";
import moment, { now } from "moment";
import Toast from "react-native-simple-toast";
import { useIsFocused } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Video from "react-native-video";
import { SwipeListView } from "react-native-swipe-list-view";
import Popover from "react-native-popover-view";
import { useSelector, useDispatch } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import ImageView from "react-native-image-viewing";
import DocumentPicker from "react-native-document-picker";
var FormData = require("form-data");
import { Dialog } from "react-native-simple-dialogs";
import GetLocation from "react-native-get-location";

import { GetMediaUrl } from "../../../httputils/httputils";
import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
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
import SingleTick from "../../../assets/images/svgs/singleTick.svg";
import More from "../../../assets/images/svgs/more.svg";
import Delete from "../../../assets/images/svgs/delete.svg";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import Farword from "../../../assets/images/svgs/forward.svg";
import CopyIcon from "../../../assets/images/svgs/copy.svg";

const ChatRoom = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const isProfile = useSelector((state) => state.authReducer.uri);
  const currentUserId = useSelector((state) => state.authReducer.id);
  const userName = useSelector((state) => state.authReducer.firstName);
  const token = useSelector((state) => state.authReducer.token);
  const number = useSelector((state) => state.authReducer.isPhone);
  const otherName = props.route.params.userName;
  const otherNumber = props.route.params.userNumber;

  const userID = props.route.params.userId;
  const otherProfile = props.route.params.userProfile;
  let chatId = createChatId([...[currentUserId], ...userID]);

  let OtherUsersIds = [...new Set([...[currentUserId], ...userID])];

  const [farwordMsg, setFarwordMsg] = useState(props.route.params.farwordMsg);

  const [messages, setMessages] = useState([]);
  const [textMsg, setTextMsg] = useState(
    farwordMsg != undefined && farwordMsg.image == null ? farwordMsg.text : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isPlusPress, setIsPlusPress] = useState(false);
  const [isIndex, setIsIndex] = useState(1);
  const [url, setUrl] = useState(
    farwordMsg != undefined && farwordMsg.image != null
      ? [farwordMsg.image]
      : []
  );

  const [isRecording, setIsRecording] = useState(false);
  var [timerState, setTimerState] = useState(0);

  const [files, setFiles] = useState(
    farwordMsg != undefined && farwordMsg.image != null
      ? [farwordMsg.image]
      : []
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [contactObj, setContactObj] = useState(null);

  const [isLocation, setIsLocation] = useState({
    lan: "74.3428052",
    lat: "31.4757274",
  });
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [isUri, setIsUri] = useState("");
  const [isImageViwer, setIsImageViwer] = useState(false);

  const timer = () => {
    let count = timerState;
    if (isRecording) {
      var time = setInterval(() => {
        count = count + 1;
        setTimerState(count);
      }, 1000);
    } else {
      clearInterval(time);
      setTimerState(0);
    }
  };
  let hours = Math.floor(timerState / 3600);
  let minutes = Math.floor((timerState / 60) % 60);
  let seconds = Math.floor(timerState % 60);

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
        let msgs = [];

        if (res != null) {
          res.docs.forEach((msg) => {
            if (msg.exists) {
              const {
                text,
                createdAt,
                isSeen,
                farword,
                user: { name, _id, avatar, number },
                image,
                visibleTo,
              } = msg.data();
              if (!isSeen && _id != currentUserId && isFocused) {
                firestore()
                  .collection("chats")
                  .doc(chatId)
                  .collection("messages")
                  .doc(msg.id)
                  .update({ isSeen: true });
              }
              let data = {
                id: now(),
                text,
                farword,
                isSeen,
                docId: msg.id,
                createdAt: moment(createdAt),
                visibleTo,
                user: { name, _id, avatar, number },
                image,
              };

              if (visibleTo.includes(currentUserId)) {
                msgs.push(data);
              }
            }
          });

          let Data = msgs.sort(function compare(a, b) {
            var dateA = new Date(a.createdAt);
            var dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          setMessages(Data);
        } else {
          setMessages([]);
        }
      });
  }, []);

  // upload image on fire storage

  const onSend = () => {
    if (url.length == 0) {
      sendMessage(
        {
          text: textMsg,
          image: null,
          farword: farwordMsg != undefined ? true : false,
          createdAt: moment().format(),
          otherUserName: otherName,
          visibleTo: OtherUsersIds,
          otherUserId: OtherUsersIds,
          userNumber: otherNumber,
          isSeen: false,
          user: {
            _id: parseInt(currentUserId),
            name: userName,
            avatar: "https://placeimg.com/140/140/any",
            number: number,
          },
        },

        [...[currentUserId], ...userID]
      );
    } else {
      url.map((i) => {
        sendMessage(
          {
            farword: farwordMsg != undefined ? true : false,
            text: textMsg,
            image: i,
            createdAt: moment().format(),
            otherUserName: otherName,
            otherUserId: OtherUsersIds,
            visibleTo: OtherUsersIds,
            isSeen: false,

            userNumber: otherNumber,
            user: {
              _id: parseInt(currentUserId),
              name: userName,
              avatar: "https://placeimg.com/140/140/any",
              number: number,
            },
          },

          [...[currentUserId], ...userID]
        );
      });
    }
    setTextMsg("");
    files.splice(0, files.length);
    url.splice(0, url.length);
    setIsIndex(isIndex + 1);
    setFarwordMsg(undefined);
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={styles.inputToolbarStyle}>
        <View style={styles.leftIconsStyle}>
          <TouchableOpacity onPress={() => setIsPlusPress(!isPlusPress)}>
            <CirclePlus alignSelf="center" width={wp(5.5)} height={hp(5.5)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={CameraPicker}>
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
              justifyContent:
                textMsg != "" && textMsg.replace(/\s+/g, "").length != 0
                  ? "space-around"
                  : "flex-end",
            },
          ]}
        >
          {(textMsg != "" && textMsg.replace(/\s+/g, "").length != 0) ||
          files.length != 0 ? (
            <TouchableOpacity
              style={styles.sendBtnStyle}
              onPress={() => {
                setIsIndex(isIndex + 1);
                onSend();
                setTextMsg("");
              }}
            >
              <Fly alignSelf="center" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.sendBtnStyle}
            // onPress={() => {
            //   setIsRecording(!isRecording);
            //   if (isRecording) {
            //     timer();
            //     SoundRecorder.start(
            //       SoundRecorder.PATH_CACHE + "/test.mp4"
            //     ).then((e) => {
            //       console.log("started recording", e);
            //     });
            //   } else {
            //     timer();
            //     SoundRecorder.stop().then(function (result) {
            //       console.log(
            //         "stopped recording, audio file saved at: " + result.path
            //       );
            //     });
            //   }
            // }}
          >
            <MicroPhone alignSelf="center" width={wp(9)} height={hp(9)} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBubble = (props) => {
    let arr = [];
    arr.push(props.currentMessage);
    return (
      <SwipeListView
        data={arr}
        keyExtractor={(item) => item.docId}
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
    var Data = props.currentMessage.image;

    if (Data != null) {
      var type = Data.type.split("/");
      var name = Data.name.split(".");
    } else {
      type = ["image"];
      name = ["docx"];
    }

    return (
      <>
        {Data == null ? (
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
                marginLeft: wp(2.2),
              }}
            >
              <Text
                style={{
                  color: colors.black,
                  fontFamily: props.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: props.currentMessage.farword ? 0.2 : 1,
                }}
              >
                {props.currentMessage.farword
                  ? "Farword message"
                  : props.currentMessage.user.name}
              </Text>
              <Text
                style={{
                  color: colors.lightBlack,
                  alignSelf: "center",
                  fontSize: wp(3),
                }}
              >
                {moment
                  .utc(props.currentMessage.createdAt)
                  .local()
                  .format("HH:mm")}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => Linking.openURL(props.currentMessage.text)}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
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
            </TouchableOpacity>

            {props.currentMessage.user._id != currentUserId ? null : props
                .currentMessage.isSeen ? (
              <DoubleTick alignSelf="flex-end" />
            ) : (
              <SingleTick alignSelf="flex-end" />
            )}
          </View>
        ) : type[0] == "image" ? (
          <>
            {props.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: props.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: props.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Farword message"
              </Text>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setIsUri(Data.uri);
                setIsImageViwer(true);
              }}
              style={styles.mediaStyle}
            >
              <Image
                source={{ uri: Data.uri }}
                style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </>
        ) : type[0] == "video" ? (
          <>
            {props.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: props.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: props.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Farword message"
              </Text>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => Linking.openURL(Data.uri)}
              style={styles.mediaStyle}
            >
              <Video
                source={{ uri: Data.uri }}
                style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
                resizeMode="cover"
                //controls={true}
              />
            </TouchableOpacity>
          </>
        ) : type[0] == "location" ? (
          <>
            {props.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: props.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: props.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Farword message"
              </Text>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mediaStyle}
              onPress={() => {
                const scheme = Platform.select({
                  ios: "maps:0,0?q=",
                  android: "geo:0,0?q=",
                });
                const latLng = `${Data.location.lat},${Data.location.lan}`;
                const label = "Get location";
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });
                Linking.openURL(url);
              }}
            >
              <Image
                source={{
                  uri: "https://camo.githubusercontent.com/1190eb11c3b2b2aef7ab15be8c95dc2ff82b34cfa1c49a70793f0fab2cf5e552/687474703a2f2f692e67697068792e636f6d2f7854636e5436575670776c4369516e4657382e676966",
                }}
                style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {props.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: props.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: props.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Farword message"
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => Linking.openURL(Data.uri)}
              style={{
                width: wp(70),
                height: hp(8),
                backgroundColor:
                  props.currentMessage.user._id == currentUserId
                    ? colors.sendBubbleColor
                    : colors.reciveBubbleColor,
                borderRadius: wp(5),
              }}
            >
              <View
                style={{
                  borderRadius: wp(2),
                  flexDirection: "row",
                }}
              >
                <Image
                  source={{
                    uri:
                      name[1] == "docx"
                        ? "https://www.macworld.com/wp-content/uploads/2021/12/word-app-icon.png"
                        : name[1] == "pdf"
                        ? "https://www.iconpacks.net/icons/2/free-pdf-icon-1512-thumb.png"
                        : "https://mpng.subpng.com/20180601/zgt/kisspng-apple-worldwide-developers-conference-ios-11-app-s-5b11dda265fd86.6064530315278975064178.jpg",
                  }}
                  style={styles.msgIconStyle}
                  resizeMode="cover"
                />
                <Text style={styles.msgNameStyle}>{Data.name}</Text>
              </View>

              {/* {props.currentMessage.user._id == currentUserId ? (
              <DoubleTick alignSelf="flex-end" />
            ) : null} */}
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };
  const renderHiddenItem = (data, rowMap, prop) => {
    var Data = prop.currentMessage.image;
    if (Data != null) {
      var type = Data.type.split("/");
      var name = Data.name.split(".");
    } else {
      type = ["image"];
      name = ["docx"];
    }
    return (
      <View
        style={{
          flex: 1,
          alignSelf:
            prop.currentMessage.user._id != currentUserId
              ? "flex-end"
              : "flex-start",
          marginRight: wp(5),
          justifyContent: "center",
        }}
      >
        <Popover
          from={
            <TouchableOpacity>
              <More marginLeft={wp(5)} alignSelf="center" />
            </TouchableOpacity>
          }
        >
          <>
            <TouchableOpacity
              style={styles.popUpRowStyle}
              onPress={() =>
                props.navigation.replace("ChatList", {
                  currentMessage: prop.currentMessage,
                })
              }
            >
              <Text style={styles.popUpTextStyle}>Forward</Text>
              <Farword alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popUpRowStyle}
              onPress={() => {
                copyToClipboard(rowMap, data);
              }}
            >
              <Text style={styles.popUpTextStyle} selectable={true}>
                Copy
              </Text>
              <CopyIcon alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popUpRowStyle}
              onPress={() => {
                closeRow(rowMap, 0);
                DeleteSingleMsg(prop);
              }}
            >
              <Text style={styles.popUpTextStyle}>Delete</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
          </>
        </Popover>
      </View>
    );
  };
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  const renderSectionHeader = ({ section }) => <Text>{section.title}</Text>;

  const DeleteSingleMsg = (props) => {
    // define document location (Collection Name > Document Name > Collection Name >)
    if (props.currentMessage.user._id == currentUserId) {
      var docRef = firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages");
      // delete the document
      docRef.doc(props.currentMessage.docId).delete();
    } else {
      const arr = props.currentMessage.visibleTo.filter(
        (item) => item != currentUserId
      );
      firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(props.currentMessage.docId)
        .update({ visibleTo: arr });
    }
  };

  // Get document or any file function

  const Documentpicker = async (mediaType) => {
    setUrl([]);
    setFiles([]);
    try {
      var data = new FormData();
      setIsLoading(true);
      setIsPlusPress(false);
      const res = await DocumentPicker.pick({
        type: mediaType,
        allowMultiSelection: true,
        presentationStyle: "fullScreen",
      });

      res.forEach((i, index) => {
        data.append("mediaFile", {
          uri: i.uri,
          name: i.name,
          type: i.type,
        });
      });

      GetMediaUrl(data, token).then((resp) => {
        setIsLoading(false);
        if (resp.status == 1) {
          setFiles(resp.files);
          resp.files.forEach((i) => {
            url.push({ uri: i.uri, name: i.name, type: i.type });
            setUrl(url);
          });
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and mo
        setIsLoading(false);
      } else {
        throw err;
        setIsLoading(false);
      }
    }
  };

  const flatListRender = ({ item, index }) => {
    if (item != null) {
      var type = item.type.split("/");
      var name = item.name.split(".");
      // if (type[0] == "location") {
      //   setUrl([]);
      //   setFiles([]);
      // }
    } else {
      type = ["image"];
      name = ["docx"];
    }
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ marginTop: hp(3) }}
          onPress={() => setIsPaused(!isPaused)}
        >
          {type[0] == "image" ? (
            <Image
              source={{
                uri: item.uri,
              }}
              pictureInPicture={true}
              resizeMode="contain"
              style={styles.renderMediaStyle}
            />
          ) : type[0] == "video" ? (
            <Video
              source={{
                uri: item.uri,
              }}
              controls={true}
              pictureInPicture={true}
              resizeMode="contain"
              style={styles.renderMediaStyle}
            />
          ) : type[0] == "location" ? (
            <View style={styles.renderMediaStyle}>
              <Image
                source={{
                  uri: "https://camo.githubusercontent.com/1190eb11c3b2b2aef7ab15be8c95dc2ff82b34cfa1c49a70793f0fab2cf5e552/687474703a2f2f692e67697068792e636f6d2f7854636e5436575670776c4369516e4657382e676966",
                }}
                style={{ width: "100%", height: "85%", borderRadius: wp(5) }}
                resizeMode="cover"
              />
              <Text style={styles.loctionStyle}>
                latitude:{"     "}
                <Text style={{ fontWeight: "bold" }}>{item.location.lat}</Text>
              </Text>
              <Text style={styles.loctionStyle}>
                longitude:{"  "}
                <Text style={{ fontWeight: "bold" }}>{item.location.lan}</Text>
              </Text>
            </View>
          ) : (
            <Image
              source={{
                uri:
                  name[1] == "docx"
                    ? "https://www.macworld.com/wp-content/uploads/2021/12/word-app-icon.png"
                    : name[1] == "pdf"
                    ? "https://www.iconpacks.net/icons/2/free-pdf-icon-1512-thumb.png"
                    : "https://mpng.subpng.com/20180601/zgt/kisspng-apple-worldwide-developers-conference-ios-11-app-s-5b11dda265fd86.6064530315278975064178.jpg",
              }}
              pictureInPicture={true}
              resizeMode="contain"
              style={styles.renderMediaStyle}
            />
          )}
          <Text style={{ color: colors.black, alignSelf: "center" }}>
            {item.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => DeleteFile(index)}
          style={styles.deleteCrossStyle}
        >
          <Image
            source={{
              uri: "https://listimg.pinclipart.com/picdir/s/42-423083_multiplication-sign-svg-png-icon-free-download-tic.png",
            }}
            style={{ width: wp(5), height: hp(5), alignSelf: "center" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const DeleteFile = (i) => {
    setIsLoading(true);
    setFiles(
      files.filter((item, index) => {
        setIsLoading(false);
        return index != i;
      })
    );
    setUrl(
      url.filter((item, index) => {
        setIsLoading(false);
        return index != i;
      })
    );
    // console.log(files);
  };

  // ======================= Pick Image from Gallery ====================

  const CameraPicker = async () => {
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          ImagePicker.launchCamera((res) => {
            var data = new FormData();
            setIsLoading(true);
            console.log("PIC Responese:    ", res);
            res.forEach((i, index) => {
              data.append("mediaFile", {
                uri: i.uri,
                name: i.name,
                type: i.type,
              });
            });
            GetMediaUrl(data, token).then((resp) => {
              setIsLoading(false);
              if (resp.status == 1) {
                setFiles(resp.files);
                resp.files.forEach((i) => {
                  url.push({ uri: i.uri, name: i.name, type: i.type });
                  setUrl(url);
                });
              }
            });
          }).catch((e) => console.log(e));
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      ImagePicker.launchCamera((res) => {
        console.log("PIC Responese:    ", res);
      }).catch((e) => console.log(e));
    }
  };

  //ContactList render Modal

  const contactsList = useSelector((state) => state.authReducer.contactsList);

  const sortedArray = [];

  const [searchState, setSearchState] = useState("");

  let filteredData = [];
  filteredData = contactsList.filter((data) => {
    return data?.givenName.toLowerCase().includes(searchState.toLowerCase());
  });

  for (let i = 0; i < alphabets.length; i++) {
    if (
      filteredData.filter(
        (data) =>
          data?.givenName?.charAt(0).toLocaleLowerCase() ==
          alphabets[i]?.toLocaleLowerCase()
      ).length > 0
    ) {
      sortedArray.push({
        key: alphabets[i],
        title: alphabets[i],
        data: filteredData.filter(
          (data) =>
            data.givenName.charAt(0).toLocaleLowerCase() ==
            alphabets[i].toLocaleLowerCase()
        ),
      });
    }
  }

  const renderItems = ({ item, index }) => {
    return (
      <ContactCardComponent
        image={
          <View style={styles.DPcontainerStyle}>
            <Image
              source={{
                uri:
                  item.thumbnailPath == ""
                    ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    : item.thumbnailPath,
              }}
              style={styles.DPStyle}
            />
          </View>
        }
        name={item.givenName}
        data={item}
        hasThumbnail={item.image}
        mainPress={() => {
          setContactObj({
            name: item.givenName,
            number: item.phoneNumbers,
            profile: item.thumbnailPath,
          });
          setTextMsg(
            `Name:  ${item.givenName}                                Number:  ${item.phoneNumbers}`
          );
          setIsVisible(false);
          setIsPlusPress(false);
        }}
        isIcon={false}
      />
    );
  };

  var defaultSectionHeader = function (_a) {
    var section = _a.section;
    return <Text style={styles.sectionHeaderStyle}>{section.title}</Text>;
  };

  const RenderModal = () => {
    return (
      <Dialog
        visible={isVisible}
        onTouchOutside={() => setIsVisible(false)}
        dialogStyle={styles.dialogStyle}
      >
        <View>
          <View style={styles.contactsHeaderStyle}>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                justifyContent: "center",
                marginLeft: wp(10),
              }}
            >
              <BackArrow alignSelf="center" />
            </TouchableOpacity>
            <Text style={styles.contactsTextStyle}>Contacts</Text>
          </View>
          <View style={{ height: hp(85), marginTop: hp(2) }}>
            <SectionList
              keyExtractor={(item, index) => `${item.key}+${index}`}
              renderSectionHeader={defaultSectionHeader}
              sections={sortedArray}
              renderItem={renderItems}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Dialog>
    );
  };

  //Get current location function

  const GetCurrentLocation = () => {
    setIsLocLoading(true);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setIsLocLoading(false);
        setIsPlusPress(false);
        setIsLocation({
          lat: location.latitude,
          lan: location.longitude,
        });

        setUrl([
          {
            name: "Map",
            type: "location/map",
            location: isLocation,
            uri: "https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg",
          },
        ]);
        setFiles([
          {
            name: "User Current Location",
            type: "location/map",
            location: isLocation,
          },
        ]);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };

  // Copy the String

  const copyToClipboard = (rowMap, data) => {
    if (data.item.image == null) {
      Clipboard.setString(data.item.text);
    } else {
      Clipboard.setString(data.item.image.uri);
    }
    Toast.showWithGravity("Copied", Toast.SHORT, Toast.BOTTOM);

    closeRow(rowMap, data.item.docId);
  };

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      <ImageView
        images={[
          {
            uri: isUri,
          },
        ]}
        imageIndex={0}
        visible={isImageViwer}
        onRequestClose={() => setIsImageViwer(false)}
        swipeToCloseEnabled={false}
      />
      <View style={styles.mainHeaderContainer}>
        <TouchableOpacity
          onPress={() => {
            if (url.length == 0) {
              props.navigation.replace("Home", { screen: "Message" });
            } else {
              setUrl([]);
              setFiles([]);
            }
          }}
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
            <Text style={styles.nameTextStyle} numberOfLines={1}>
              {otherName}
            </Text>
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
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator color={colors.black} alignSelf="center" />
            </View>
          ) : files.length != 0 ? (
            <>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={files}
                keyExtractor={(item, index) => index}
                renderItem={flatListRender}
                nestedScrollEnabled={true}
              />

              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: colors.floatBtnColor,
                  width: wp(80),
                  height: hp(5),
                  borderRadius: wp(2),
                  justifyContent: "center",
                }}
                onPress={() => {
                  setIsIndex(isIndex + 1);
                  onSend();
                  setTextMsg("");
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.regular,
                    fontSize: wp(5),
                    alignSelf: "center",
                    fontWeight: "bold",
                  }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <GiftedChat
              messages={messages}
              user={{
                _id: currentUserId,
                avatar: "https://placeimg.com/140/140/any",
              }}
              keyExtractor
              renderInputToolbar={renderInputToolbar}
              messagesContainerStyle={{
                marginHorizontal: wp(3),
                marginTop: hp(0.6),
                borderRadius: wp(10),
              }}
              renderBubble={renderBubble}
              isTyping={true}
              alwaysShowSend={false}
              isLoadingEarlier={true}
            />
          )}

          {isPlusPress ? (
            <View style={styles.footerViewStyle}>
              <TouchableOpacity
                onPress={() =>
                  Documentpicker([
                    DocumentPicker.types.images,
                    DocumentPicker.types.video,
                  ])
                }
              >
                <ImageIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <ContactIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <EmojiIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Documentpicker([DocumentPicker.types.video])}
              >
                <GifIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => GetCurrentLocation()}>
                {isLocLoading ? (
                  <View style={{ justifyContent: "center" }}>
                    <ActivityIndicator
                      color={colors.black}
                      alignSelf="center"
                    />
                  </View>
                ) : (
                  <LocationIcon />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Documentpicker([DocumentPicker.types.allFiles])}
              >
                <FileIcon />
              </TouchableOpacity>
            </View>
          ) : null}
          {isRecording ? (
            <View style={styles.footerViewStyle}>
              <Text style={styles.txtRecordCounter}>
                {" "}
                {/* {minutes > 59 ? (hours < 10 ? `0${hours}` : hours) : null}{" "} */}
                {hours === 1 ? `:` : null}{" "}
                {minutes < 10 ? `0${minutes}` : minutes} :{" "}
                {seconds < 10 ? `0${seconds}` : seconds}
              </Text>
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
    backgroundColor: "rgba(5, 8, 17, 0.06)",
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
    width: wp(38),
    marginHorizontal: wp(2),
  },
  popUpTextStyle: {
    color: "black",
    alignSelf: "center",
  },
  txtRecordCounter: {
    color: colors.black,
    fontSize: wp(5),
    fontFamily: fonts.medium,
    textAlignVertical: "center",
    alignSelf: "center",
    letterSpacing: wp(1),
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mediaStyle: {
    width: wp(70),
    height: hp(30),
    backgroundColor: colors.sendBubbleColor,
    borderRadius: wp(5),
  },
  renderMediaStyle: {
    width: wp(99),
    height: hp(50),
    alignSelf: "center",
  },
  deleteCrossStyle: {
    position: "absolute",
    bottom: hp(7),
    alignSelf: "center",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: "center",
  },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  DPcontainerStyle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    borderColor: colors.gray,
    borderWidth: 0.2,
    justifyContent: "center",
  },
  DPStyle: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15),
    alignSelf: "center",
  },
  msgIconStyle: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(2),
    alignSelf: "center",
  },
  msgNameStyle: {
    alignSelf: "center",
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: wp(3),
    marginLeft: wp(2),
    width: wp(50),
  },
  loctionStyle: {
    marginLeft: wp(10),
    fontSize: wp(4),
    color: colors.black,
  },
  dialogStyle: {
    borderRadius: wp(4),
    width: wp(100),
    height: hp(100),
    marginLeft: wp(-5),
  },
  contactsHeaderStyle: {
    flexDirection: "row",
    backgroundColor: "black",
    height: hp(6.5),
    marginTop: hp(-5),
    marginHorizontal: wp(-10),
  },
  contactsTextStyle: {
    color: "white",
    alignSelf: "center",
    marginLeft: wp(24),
    fontSize: wp(6),
    fontFamily: fonts.medium,
  },
};
