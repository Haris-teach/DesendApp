import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
  Image,
  Modal,
  SectionList,
  Text,
  TextInput,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
  Vibration,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Slider from "@react-native-community/slider";
import Clipboard from "@react-native-community/clipboard";
import { GiftedChat } from "react-native-gifted-chat";
import * as ImagePicker from "react-native-image-picker";
import moment, { now } from "moment";
import Toast from "react-native-simple-toast";
import Sound from "react-native-sound";
import LottieView from "lottie-react-native";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import { useIsFocused } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Video from "react-native-video";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useSelector, useDispatch } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import ImageView from "react-native-image-viewing";
import DocumentPicker from "react-native-document-picker";
var FormData = require("form-data");
import { Dialog } from "react-native-simple-dialogs";
import GetLocation from "react-native-get-location";

import { GetMediaUrl, PushNotification } from "../../../httputils/httputils";
import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
import {
  createChatId,
  sendMessage,
  ReportCollection,
} from "../../../utils/helper";
import CallIcon from "../../../assets/images/svgs/callIcon.svg";
import Report from "../../../assets/images/svgs/reportUser.svg";
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
import Cross from "../../../assets/images/svgs/cross.svg";
import QuoteIcon from "../../../assets/images/svgs/quote.svg";
import Play from "../../../assets/images/svgs/play.svg";
import Pause from "../../../assets/images/svgs/pause.svg";
import PlayRound from "../../../assets/images/svgs/playround.svg";
import ColorPicker from "../../../assets/images/svgs/colorPicker.svg";

var time;
var sound;
var adminId;
var obj;
var listner = () => {
  return null;
};

const ChatRoom = (props, { navigation }) => {
  var lottie = useRef();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  adminId = props.route.params.adminId;
  Sound.setCategory("Playback");
  const isProfile = useSelector((state) => state.authReducer.uri);
  const currentUserId = useSelector((state) => state.authReducer.id);
  const userName = useSelector((state) => state.authReducer.firstName);
  const token = useSelector((state) => state.authReducer.token);
  const number = useSelector((state) => state.authReducer.isPhone);
  const otherName = props.route.params.userName;
  const otherNumber = props.route.params.userNumber;

  //const block = props.route.params.blockTo.includes(currentUserId);

  const [block, setBlock] = useState(false);
  const leave = props.route.params.leave.includes(currentUserId);

  const userID = props.route.params.userId;
  const otherProfile = props.route.params.userProfile;

  const isGroup = props.route.params.isGroup;

  let chatId = createChatId([...[currentUserId], ...userID], otherName);

  let OtherUsersIds = [...new Set([...[currentUserId], ...userID])];

  const [farwordMsg, setFarwordMsg] = useState(props.route.params.farwordMsg);
  const [load, setLoad] = useState(true);

  const [messages, setMessages] = useState([]);
  const [currentMsgAudioPlayingId, setCurrentAudioMessagePlayingId] =
    useState();
  const [textMsg, setTextMsg] = useState(
    farwordMsg != undefined && farwordMsg.image == null ? farwordMsg.text : ""
  );
  const [isColorPicker, setIsColorPicker] = useState(false);
  const [isSenderBubbleColor, setIsSenderBubbleColor] = useState();
  const [show_modal, setShow_modal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isPlusPress, setIsPlusPress] = useState(false);
  const [isIndex, setIsIndex] = useState(1);
  const [url, setUrl] = useState(
    farwordMsg != undefined && farwordMsg.image != null
      ? [farwordMsg.image]
      : []
  );

  const [timerState, setTimerState] = useState(0);
  const [isQuote, setIsQuote] = useState({ state: false, quote: "" });
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

  const [startAudio, setStartAudio] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${messageIdGenerator()}test.aac`
  );

  const [sliderValue, setSliderValue] = useState(0);

  const [audioSettings, setAudioSetting] = useState({
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: "Low",
    AudioEncoding: "aac",
    MeteringEnabled: true,
    IncludeBase64: true,
    AudioEncodingBitRate: 32000,
  });

  // const [voiceDuration, setVoiceDuration] = useState(0);
  const [audioId, setAudioId] = useState(0);
  const [sendVoice, setSendVoice] = useState(false);
  const [loadEarlier, setLoadEarlier] = useState(false);
  const [isLoadEarlier, setIsLoadEarlier] = useState(false);
  const [isCurrentDocId, setIsCurrentDocId] = useState("");

  var count = 0;

  function messageIdGenerator() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const CheckPermission = () => {
    if (Platform.OS !== "android") {
      return Promise.resolve(true);
    }
    const rationale = {
      title: "Microphone Permission",
      message:
        "AudioExample needs access to your microphone so you can record audio.",
    };
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale
    ).then((result) => {
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    });
  };
  useEffect(() => {
    CheckPermission().then(async (hasPermission) => {
      setHasPermission(hasPermission);
      if (!hasPermission) return;
      await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings);
      AudioRecorder.onProgress = (data) => {
        setTimerState(parseInt(data.currentTime));
      };
      AudioRecorder.onFinished = (data) => {
        const fileName = `${messageIdGenerator()}.aac`;

        let params = new FormData();
        params.append("mediaFile", {
          uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
          name: fileName,
          type: `audio/aac`,
        });

        GetMediaUrl(params, token).then(async (res) => {
          setSendVoice(false);
          onSend(res.files[0].uri);
          params = new FormData();
          await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings);
          setStartAudio(false);
        });
      };
    });
  }, []);

  //Handle audio recording

  const handleAudio = async () => {
    try {
      if (!startAudio) {
        setStartAudio(true);
        // timer(true);
        await AudioRecorder.startRecording();
      } else {
        setSendVoice(true);
        // timer(false);
        setStartAudio(false);
        setTimerState(0);
        await AudioRecorder.stopRecording();
      }
    } catch (err) {
      await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings);
      setStartAudio(false);
      setSendVoice(false);
      Toast.showWithGravity("Voice too short", Toast.SHORT, Toast.BOTTOM);
    }
  };

  let hours = Math.floor(timerState / 3600);
  let minutes = Math.floor((timerState / 60) % 60);
  let seconds = Math.floor(timerState % 60);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setIsPlusPress(false); // or some other action
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
      .where("chatId", "==", chatId)
      .get()
      .then((resp) => {
        if (resp.docs.length != 0 && resp != null && resp != undefined) {
          adminId = resp.docs[0].data().admin;
          let key = "key" + currentUserId;
          let color = resp.docs[0].data().bubbleColor;
          if (key in color) {
            setIsSenderBubbleColor(color[key]);
          } else {
            setIsSenderBubbleColor(color.key0);
          }
        } else {
          setIsSenderBubbleColor(colors.sendBubbleColor);
        }
      });
    setSendVoice(true);
    firestore()
      .collection("chats")
      .where("chatId", "==", chatId)
      .get()
      .then((resp) => {
        if (resp.docs.length != 0 && resp != null) {
          if (resp.docs[0].data().blockTo.includes(currentUserId)) {
            setBlock(true);
            setSendVoice(false);
          } else {
            GetMessages();
          }
        } else if (resp.docs.length == 0) {
          GetMessages();
        } else {
          setSendVoice(false);
        }
      });

    return () => {
      listner();
    };
  }, []);

  const GetMessages = () => {
    setIsLoadEarlier(true);
    setLoadEarlier(true);
    listner = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(15)
      .onSnapshot((res) => {
        setIsLoadEarlier(false);
        setLoadEarlier(false);
        if (res != null) {
          let msgs = [];
          setLastDocument(res.docs[res.docs.length - 1]);
          res.docs.forEach((msg, index) => {
            if (msg.exists) {
              const {
                text,
                createdAt,
                isSeen,
                farword,
                user: { name, _id, avatar, number },
                image,
                visibleTo,
                audio,
                isQuote,
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
                _id: createdAt,
                text,
                farword,
                isSeen,
                docId: msg.id,
                createdAt: moment(createdAt),
                visibleTo,
                user: { name, _id, avatar, number },
                image,
                audio,
                isPlaying: false,
                timer: 0,
                position: index,
                duration: 0,
                isQuote,
              };

              if (visibleTo.includes(currentUserId) && !leave) {
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
          setSendVoice(false);
        } else {
          setMessages([]);
          setSendVoice(false);
        }
      });
  };

  const [lastDocument, setLastDocument] = useState();

  const LoadData = () => {
    let query = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc"); // sort the data
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument); // fetch data following the last document accessed

      query
        .limit(10) // limit to your page size, 3 is just an example
        .get()
        .then((querySnapshot) => {
          setLoadEarlier(false);
          setIsLoadEarlier(false);

          setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);

          MakeUserData(querySnapshot.docs);
        });
    } else {
      setLoadEarlier(false);
      setIsLoadEarlier(false);
    }
  };

  const MakeUserData = (docs) => {
    let msgs = [];
    docs.forEach((doc, i) => {
      const {
        text,
        createdAt,
        isSeen,
        farword,
        user: { name, _id, avatar, number },
        image,
        visibleTo,
        audio,
        isQuote,
      } = doc.data();

      let data = {
        _id: createdAt,
        text,
        farword,
        isSeen,
        docId: doc.id,
        createdAt: moment(createdAt),
        visibleTo,
        user: { name, _id, avatar, number },
        image,
        audio,
        isPlaying: false,
        timer: 0,
        position: i,
        duration: 0,
        isQuote,
      };
      msgs.push(data);
    });
    let Data = msgs.sort(function compare(a, b) {
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    setMessages([...messages, ...Data]);
  };

  const onSend = (uri) => {
    if (url.length == 0) {
      let obj = {
        _id: moment().format(),
        text: textMsg,
        isGroup: OtherUsersIds.length > 2 ? true : false,
        isQuote: isQuote.quote,
        image: null,
        audio: uri,
        farword: farwordMsg != undefined ? true : false,
        createdAt: moment().format(),
        otherUserName: otherName,
        visibleTo: OtherUsersIds,
        otherUserId: OtherUsersIds,
        userNumber: otherNumber,
        isSeen: false,

        otherProfile:
          otherProfile == ""
            ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            : otherProfile,
        user: {
          _id: parseInt(currentUserId),
          name: userName,
          avatar: isProfile,
          number: number,
        },
      };
      // if (uri == null) {
      //   setMessages((previousMessages) =>
      //     GiftedChat.append(previousMessages, obj)
      //   );
      // }
      sendMessage(
        obj,
        [...[currentUserId], ...userID],
        otherName,
        currentUserId
      );
      Notification(OtherUsersIds, textMsg, uri);
    } else {
      url.map((i) => {
        let obj = {
          _id: moment().format(),
          isGroup: OtherUsersIds.length > 2 ? true : false,
          farword: farwordMsg != undefined ? true : false,
          text: textMsg,
          image: i,
          audio: null,
          createdAt: moment().format(),
          otherUserName: otherName,
          otherUserId: OtherUsersIds,
          otherProfile:
            otherProfile == ""
              ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              : otherProfile,
          visibleTo: OtherUsersIds,
          isSeen: false,
          userNumber: otherNumber,
          user: {
            _id: parseInt(currentUserId),
            name: userName,
            avatar: isProfile,
            number: number,
          },
        };
        // setMessages((previousMessages) =>
        //   GiftedChat.append(previousMessages, obj)
        // );
        sendMessage(
          obj,
          [...[currentUserId], ...userID],
          otherName,
          currentUserId
        );
        Notification(OtherUsersIds, i.uri, "");
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
      <View
        style={[
          styles.inputToolbarStyle,
          {
            height: !isQuote.state ? hp(7) : hp(14),
            borderRadius: !isQuote.state ? wp(20) : wp(5),
          },
        ]}
      >
        {!isQuote.state ? (
          <View style={styles.leftIconsStyle}>
            <TouchableOpacity
              disabled={block || leave}
              onPress={() => setIsPlusPress(!isPlusPress)}
              style={{ alignSelf: "center", justifyContent: "center" }}
            >
              <CirclePlus alignSelf="center" width={wp(5.5)} height={hp(5.5)} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={block || leave}
              onPress={() => {
                setIsPlusPress(false);
                setShow_modal(true);
              }}
              style={{ alignSelf: "center", justifyContent: "center" }}
            >
              <CameraIcon alignSelf="center" width={wp(5.5)} height={hp(5.5)} />
            </TouchableOpacity>
          </View>
        ) : null}

        {startAudio ? (
          <View
            style={[
              styles.textInputView,
              { width: !isQuote.state ? wp(50) : wp(70) },
            ]}
          >
            <Text style={styles.txtRecordCounter}>
              {" "}
              {/* {minutes > 59 ? (hours < 10 ? `0${hours}` : hours) : null}{" "}
                {hours === 1 ? `:` : null}{" "} */}
              {minutes < 10 ? `0${minutes}` : minutes} :{" "}
              {seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: isQuote.state ? wp(70) : wp(50),
              marginLeft: isQuote.state ? wp(6) : null,
            }}
          >
            {isQuote.state ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: hp(1),
                  }}
                >
                  <View>
                    <Text style={styles.quoteTextstyle} numberOfLines={2}>
                      {isQuote.quote}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsQuote({ state: false, quote: "" })}
                  >
                    <Cross alignSelf="center" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderWidth: 1.5,
                    borderColor: "black",
                    borderRadius: wp(10),
                  }}
                />
              </>
            ) : null}

            <TextInput
              placeholder="Type your message"
              placeholderTextColor={colors.gray}
              style={{ maxHeight: hp(8), color: colors.black }}
              multiline={true}
              textAlignVertical="center"
              onChangeText={(text) => setTextMsg(text)}
              onFocus={() => setIsPlusPress(false)}
              value={textMsg}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent:
              textMsg != "" &&
              textMsg.replace(/\s+/g, "").length != 0 &&
              !isQuote.state
                ? "space-around"
                : "center",
          }}
        >
          {!isQuote.state ? (
            <TouchableOpacity
              disabled={block || leave}
              style={[styles.sendBtnStyle, { alignSelf: "center" }]}
              onPressIn={() => {
                handleAudio();
                Vibration.vibrate(200);
              }}
              onPressOut={() => {
                handleAudio();
                Vibration.vibrate(50);
              }}
            >
              {sendVoice ? (
                <ActivityIndicator color="black" />
              ) : (
                <MicroPhone alignSelf="center" width={wp(9)} height={hp(9)} />
              )}
            </TouchableOpacity>
          ) : null}

          {(textMsg != "" && textMsg.replace(/\s+/g, "").length != 0) ||
          files.length != 0 ? (
            <TouchableOpacity
              disabled={block || sendVoice || leave}
              style={[
                styles.sendBtnStyle,
                {
                  alignSelf: isQuote.state ? "flex-end" : "center",
                  marginBottom: isQuote.state ? hp(2) : null,
                },
              ]}
              onPress={() => {
                setIsIndex(isIndex + 1);
                onSend(null);
                setTextMsg("");
                setIsQuote({ state: false, quote: "" });
              }}
            >
              <Fly alignSelf="center" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderBubble = (props, index) => {
    return (
      <SwipeListView
        data={[props.currentMessage]}
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
        rightOpenValue={-75}
        previewOpenValue={-40}
        previewOpenDelay={200}
        disableRightSwipe={
          props.currentMessage.user._id != currentUserId ? true : false
        }
        disableLeftSwipe={
          props.currentMessage.user._id == currentUserId ? true : false
        }
      />
    );
  };

  const startPlaying = (url, position) => {
    sound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        Toast.showWithGravity(
          `failed to load the sound ${error}`,
          Toast.SHORT,
          Toast.BOTTOM
        );
      }

      messages[position].duration = sound.getDuration();

      time = setInterval(() => {
        count = count + 1;
        setSliderValue(count);

        messages[position].timer = count;

        setMessages(messages);
      }, 1000);

      let interval = setInterval(() => {
        lottie.current.play();
      }, 2000);

      sound.play((success) => {
        messages[position].isPlaying = false;
        messages[position].timer = 0;
        count = 0;
        setMessages(messages);
        lottie.current.reset();
        setSliderValue(0);
        clearInterval(time);
        clearInterval(interval);
      });
    });
  };

  const stopPlayer = (position) => {
    sound.stop();
    lottie.current.reset();
    messages[position].isPlaying = false;
    setMessages(messages);
    setSliderValue(0);
    setAudioId(0);

    clearInterval(time);
  };

  const renderItem = (p) => {
    var Data = p.currentMessage.image;

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
                p.currentMessage.user._id == currentUserId ? wp(6) : wp(0),
              borderBottomRightRadius:
                p.currentMessage.user._id != currentUserId ? wp(6) : wp(0),
              backgroundColor:
                p.currentMessage.user._id == currentUserId
                  ? isSenderBubbleColor
                  : colors.reciveBubbleColor,
              //  backgroundColor: isSenderBubbleColor,
              width: wp(80),
              marginVertical: hp(0.5),
            }}
          >
            {p.currentMessage.audio == null ? (
              <>
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
                      fontFamily: p.currentMessage.farword
                        ? fonts.regular
                        : fonts.medium,
                      fontSize: wp(4),
                      alignSelf: "center",
                      opacity: p.currentMessage.farword ? 0.2 : 1,
                    }}
                  >
                    {p.currentMessage.farword
                      ? "Forwarded message"
                      : p.currentMessage.user.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.lightBlack,
                      alignSelf: "center",
                      fontSize: wp(3),
                    }}
                  >
                    {moment
                      .utc(p.currentMessage.createdAt)
                      .local()
                      .format("HH:mm")}
                  </Text>
                </View>
                {p.currentMessage.isQuote != "" ? (
                  <>
                    <Text
                      style={{
                        marginLeft: wp(8),
                        color: colors.color_light_grey,
                        opacity: 0.6,
                        fontSize: wp(3.5),
                        fontFamily: fonts.bold,
                      }}
                    >
                      {p.currentMessage.isQuote}
                    </Text>

                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "black",
                        marginHorizontal: wp(5),
                      }}
                    />
                  </>
                ) : null}
                <TouchableOpacity
                  onPress={() => {
                    let temp = p.currentMessage.text.split(":");
                    if (temp[0] == "http" || temp[0] == "https") {
                      Linking.openURL(p.currentMessage.text);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color:
                        p.currentMessage.user._id == currentUserId
                          ? colors.msgSendTextColor
                          : colors.msgTextColor,
                      fontSize: wp(3.5),
                      fontFamily: fonts.light,
                      marginLeft: wp(2.2),
                      marginTop: hp(1),
                    }}
                  >
                    {p.currentMessage.text}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsCurrentDocId(p.currentMessage.docId);
                      for (let i = 0; i < messages.length; i++) {
                        if (messages[i].docId === p.currentMessage.docId) {
                          messages[i].isPlaying = !messages[i].isPlaying;

                          if (messages[i].isPlaying) {
                            startPlaying(messages[i].audio, i);

                            setCurrentAudioMessagePlayingId(
                              p.currentMessage.docId
                            );
                          } else {
                            stopPlayer(i);
                          }
                        } else {
                          messages[i].isPlaying = false;
                        }
                      }

                      setMessages(messages);
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {p.currentMessage.duration == 0 &&
                    p.currentMessage.isPlaying ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <>
                        {p.currentMessage.isPlaying ? (
                          <Pause
                            alignSelf="center"
                            width={wp(3.5)}
                            height={hp(3.5)}
                          />
                        ) : (
                          <Play
                            alignSelf="center"
                            width={wp(5)}
                            height={hp(5)}
                          />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,

                      justifyContent: "center",
                      height: hp(5),
                    }}
                  >
                    {p.currentMessage.timer != 0 ? (
                      <LottieView
                        ref={lottie}
                        source={require("../../../assets/images/sound-waves.json")}
                        speed={0.5}
                        style={{
                          width: wp(50),
                          alignSelf: "center",
                        }}
                      />
                    ) : (
                      <LottieView
                        source={require("../../../assets/images/sound-waves.json")}
                        style={{
                          width: wp(50),
                          alignSelf: "center",
                        }}
                      />
                    )}
                  </View>

                  {/* <Slider
                    maximumValue={p.currentMessage.duration}
                    minimumValue={0}
                    minimumTrackTintColor="#307ecc"
                    maximumTrackTintColor="#000000"
                    step={1}
                    // ref={p.currentMessage.docId}
                    value={
                      p.currentMessage.timer == 0
                        ? 0
                        : p.currentMessage.timer + 1
                    }
                    style={{
                      width: wp(70),
                      height: hp(4),
                      alignSelf: "center",
                    }}
                  /> */}
                </View>

                <Text style={{ color: "black" }}>
                  00:
                  {p.currentMessage.timer == 0 ? 0 : p.currentMessage.timer + 1}
                  /00:
                  {p.currentMessage.i && !p.currentMessage.isPlaying
                    ? "00"
                    : parseInt(p.currentMessage.duration)}
                </Text>
              </>
            )}

            {p.currentMessage.user._id != currentUserId ? null : p
                .currentMessage.isSeen ? (
              <DoubleTick alignSelf="flex-end" />
            ) : (
              <SingleTick alignSelf="flex-end" />
            )}
          </View>
        ) : type[0] == "image" || type[0] == "video" ? (
          <>
            {p.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: p.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: p.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Forwarded message"
              </Text>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setIsUri(Data.uri);
                if (type[0] == "image") {
                  setIsImageViwer(true);
                } else if (type[0] == "video") {
                  Linking.openURL(Data.uri);
                  // props.navigation.navigate("VideoViwer", { uri: Data.uri });
                } else {
                  return null;
                }
              }}
              style={styles.mediaStyle}
            >
              <>
                <ActivityIndicator style={styles.indicatorStyle} />
                <Image
                  source={{
                    uri: type[0] == "video" ? Data.thumbnail : Data.uri,
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
                  resizeMode="cover"
                />
                {type[0] == "video" ? (
                  <View style={styles.videoBtnStyle}>
                    <PlayRound
                      alignSelf="center"
                      width={wp(10)}
                      height={hp(10)}
                    />
                  </View>
                ) : null}
              </>
            </TouchableOpacity>
          </>
        ) : type[0] == "location" ? (
          <>
            {p.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: p.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: p.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Forwarded message"
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
                source={require("../../../assets/images/pngs/map.gif")}
                style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {p.currentMessage.farword ? (
              <Text
                style={{
                  color: colors.black,
                  fontFamily: p.currentMessage.farword
                    ? fonts.regular
                    : fonts.medium,
                  fontSize: wp(4),
                  alignSelf: "center",
                  opacity: p.currentMessage.farword ? 0.2 : 1,
                }}
              >
                "Forwarded message"
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => Linking.openURL(Data.uri)}
              style={{
                width: wp(70),
                height: hp(8),
                backgroundColor:
                  p.currentMessage.user._id == currentUserId
                    ? colors.sendBubbleColor
                    : colors.reciveBubbleColor,
                borderRadius: wp(5),
                marginVertical: hp(0.5),
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

              {/* {p.currentMessage.user._id == currentUserId ? (
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
          justifyContent: "center",
        }}
      >
        <Menu>
          <MenuTrigger>
            <More marginRight={wp(5)} />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              width: wp(40),
              borderRadius: 15,
            }}
          >
            <MenuOption
              onSelect={() =>
                props.navigation.replace("ChatList", {
                  currentMessage: prop.currentMessage,
                })
              }
              style={styles.popUpRowStyle}
            >
              <Text style={styles.popUpTextStyle}>Forward</Text>
              <Farword alignSelf="center" width={wp(5)} height={hp(5)} />
            </MenuOption>
            {prop.currentMessage.audio == null ? (
              <MenuOption
                style={styles.popUpRowStyle}
                onSelect={() => {
                  copyToClipboard(rowMap, data);
                }}
              >
                <Text style={styles.popUpTextStyle} selectable={true}>
                  Copy
                </Text>
                <CopyIcon alignSelf="center" width={wp(5)} height={hp(5)} />
              </MenuOption>
            ) : null}
            {data.item.text != "" ? (
              <MenuOption
                style={styles.popUpRowStyle}
                onSelect={() => {
                  closeRow(rowMap, 0);

                  setIsQuote({
                    state: true,
                    quote: `" ${prop.currentMessage.text} "`,
                  });
                }}
              >
                <Text style={styles.popUpTextStyle}>Quote</Text>
                <QuoteIcon alignSelf="center" width={wp(5)} height={hp(5)} />
              </MenuOption>
            ) : null}

            {prop.currentMessage.user._id != currentUserId ? (
              <MenuOption
                style={styles.popUpRowStyle}
                onSelect={() => {
                  closeRow(rowMap, 0);
                  ReportSingleMsg(prop);
                }}
              >
                <Text style={styles.popUpTextStyle}>Report</Text>
                <Report alignSelf="center" width={wp(5)} height={hp(5)} />
              </MenuOption>
            ) : null}

            {prop.currentMessage.user._id == currentUserId ? (
              <MenuOption
                style={styles.popUpRowStyle}
                onSelect={() => {
                  closeRow(rowMap, 0);
                  DeleteSingleMsg(prop);
                }}
              >
                <Text style={styles.popUpTextStyle}>Delete</Text>
                <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
              </MenuOption>
            ) : null}
          </MenuOptions>
        </Menu>
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
    firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get()
      .then((res) => {
        if (res.docs[0].id == props.currentMessage.docId) {
          var docRef = firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages");
          // delete the document
          docRef
            .doc(props.currentMessage.docId)
            .delete()
            .then(() => {
              firestore()
                .collection("chats")
                .doc(chatId)
                .update({
                  lastmessage: res.docs[1] ? res.docs[1].data() : null,
                });
            });
        } else {
          var docRef = firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages");
          // delete the document
          docRef.doc(props.currentMessage.docId).delete();
        }
      });
  };

  const ReportSingleMsg = (data) => {
    ReportCollection(
      chatId,
      data.currentMessage.docId,
      data.currentMessage.text,
      otherName,
      userName,
      data.currentMessage.image,
      data.currentMessage.audio
    );
  };

  // Get document or any file function

  const Documentpicker = async (mediaType) => {
    setUrl([]);
    setFiles([]);
    setIsLoading(true);
    try {
      var data = new FormData();
      setIsPlusPress(false);
      const res = await DocumentPicker.pick({
        type: mediaType,
        allowMultiSelection: false,
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
            url.push({
              uri: i.uri,
              name: i.name,
              type: i.type,
              thumbnail: i.thumbnail ? i.thumbnail : "",
            });
            setUrl(url);
            setFiles(url);
          });
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setIsLoading(false);
      } else {
        throw err;
        setIsLoading(false);
      }
    }
  };

  const flatListRender = (item) => {
    if (item != null) {
      var type = item.type.split("/");
      var name = item.name.split(".");
    } else {
      type = ["image"];
      name = ["docx"];
    }
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator
          animating={load}
          color="black"
          style={{
            position: "absolute",
            alignSelf: "center",
            top: 0,
            bottom: 0,
          }}
        />
        <View
          style={{ marginTop: hp(3) }}
          onPress={() => setIsPaused(!isPaused)}
        >
          {type[0] == "image" ? (
            <>
              <Image
                onLoadEnd={() => setLoad(false)}
                source={{
                  uri: item.uri,
                }}
                pictureInPicture={true}
                resizeMode="contain"
                style={styles.renderMediaStyle}
              />
            </>
          ) : type[0] == "video" ? (
            <>
              <Video
                onLoad={() => setLoad(false)}
                source={{
                  uri: item.uri,
                }}
                controls={true}
                pictureInPicture={true}
                resizeMode="contain"
                style={styles.renderMediaStyle}
              />
            </>
          ) : type[0] == "location" ? (
            <View style={styles.renderMediaStyle}>
              <Image
                source={require("../../../assets/images/pngs/map.gif")}
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
          onPress={() => DeleteFile()}
          style={styles.deleteCrossStyle}
        >
          <Cross />
        </TouchableOpacity>
      </View>
    );
  };

  const DeleteFile = () => {
    setFiles([]);
    setUrl([]);
    setLoad(true);
  };

  // const DeleteFile = (i) => {
  //   setIsLoading(true);
  //   setLoad(true);
  //   setFiles(
  //     files.filter((item, index) => {
  //       setIsLoading(false);
  //       return index != i;
  //     })
  //   );
  //   setUrl(
  //     url.filter((item, index) => {
  //       setIsLoading(false);
  //       return index != i;
  //     })
  //   );
  // };

  // ======================= Pick Image from Gallery ====================

  const CameraPicker = async (type) => {
    if (Platform.OS == "android") {
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
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        setShow_modal(false);
        let options = {
          mediaType: type,
        };
        ImagePicker.launchCamera(options, (res) => {
          if (res.assets) {
            let params = new FormData();
            setIsLoading(true);
            params.append("mediaFile", {
              uri: res.assets[0].uri,
              name: type == "photo" ? "Camera Picture.jpg" : "Camera video.mp4",
              type: res.assets[0].type,
            });

            GetMediaUrl(params, token).then((resp) => {
              setIsLoading(false);
              if (resp.status == 1) {
                setFiles(resp.files);
                resp.files.forEach((i) => {
                  url.push({ uri: i.uri, name: i.name, type: i.type });
                  setUrl(url);
                });
              }
            });
          } else {
            Toast.showWithGravity(
              "Media is not select",
              Toast.SHORT,
              Toast.BOTTOM
            );
          }
        }).catch((e) => {
          const { code, message } = e;
          Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
        });
      } else {
        Toast.showWithGravity(
          "Camera permission denied",
          Toast.SHORT,
          Toast.BOTTOM
        );
      }
    }
  };

  const CameraSelection = () => (
    <Dialog
      visible={show_modal}
      onTouchOutside={() => {
        setIsPlusPress(false);
        setShow_modal(false);
      }}
      dialogStyle={styles.cameraPopUp}
      title="Select one option:"
      titleStyle={{ alignSelf: "center" }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity onPress={() => CameraPicker("photo")}>
          <Image
            source={require("../../../assets/images/pngs/camera.png")}
            resizeMode="contain"
            style={{ width: wp(15), height: hp(8), alignSelf: "center" }}
          />
          <Text style={{ color: colors.black, alignSelf: "center" }}>
            Image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => CameraPicker("video")}>
          <Image
            source={require("../../../assets/images/pngs/recording.png")}
            resizeMode="contain"
            style={{ width: wp(15), height: hp(8), alignSelf: "center" }}
          />
          <Text style={{ color: colors.black, alignSelf: "center" }}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  );
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
        setIsLocLoading(false);
        const { code, message } = error;
        Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
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

  // Send Push notification function

  const Notification = (ids, msg, uri) => {
    let Ids = ids.filter((i) => i != currentUserId);
    let params = {
      sendTo: Ids,
      title: userName,
      notification: msg == "" ? uri : msg,
    };
    PushNotification(params, token).then((res) => null);
  };

  // END

  // Select color for specific chat

  const FColorPicker = () => (
    <Dialog
      visible={isColorPicker}
      onTouchOutside={() => {
        setIsColorPicker(false);
      }}
      dialogStyle={styles.colorPickerPopUp}
      title="SELECT COLOR"
      titleStyle={{ alignSelf: "center", color: colors.black }}
    >
      <View style={styles.colorBtnStyle}>
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#F8E461" }]}
          onPress={() => BubbleColor("#F8E461")}
        />
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#97F1C3" }]}
          onPress={() => BubbleColor("#97F1C3")}
        />
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#B6B8FB" }]}
          onPress={() => BubbleColor("#B6B8FB")}
        />
      </View>
      <View style={styles.colorBtnStyle}>
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#FEA6B8" }]}
          onPress={() => BubbleColor("#FEA6B8")}
        />
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#FEB43C" }]}
          onPress={() => BubbleColor("#FEB43C")}
        />
        <TouchableOpacity
          style={[styles.colorBtncircleStyle, { backgroundColor: "#BBE061" }]}
          onPress={() => BubbleColor("#BBE061")}
        />
      </View>
    </Dialog>
  );

  const BubbleColor = (color) => {
    setIsColorPicker(false);
    setIsSenderBubbleColor(color);
    setIsLoadEarlier(true);
    setLoadEarlier(true);
    firestore()
      .collection("chats")
      .where("chatId", "==", chatId)
      .get()
      .then((res) => {
        obj = res.docs[0].data().bubbleColor;
        let key = "key" + currentUserId;
        obj[key] = color;
        firestore()
          .collection("chats")
          .doc(chatId)
          .update({
            bubbleColor: obj,
          })
          .then(() => {
            setIsLoadEarlier(false);
            setLoadEarlier(false);
          });
      });
  };

  // END

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      {CameraSelection()}
      {FColorPicker()}

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
              listner();
            } else {
              setUrl([]);
              setFiles([]);
            }
          }}
          style={{ justifyContent: "center" }}
        >
          <BackArrow alignSelf="center" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isGroup) {
              props.navigation.navigate("GroupManagementScreen", {
                array: userID,
                chatId: chatId,
                adminId: adminId,
              });
            }
          }}
          disabled={isGroup ? false : true}
          style={{
            flexDirection: "row",
            width: wp(50),
          }}
        >
          <Image
            source={{
              uri:
                otherProfile == ""
                  ? "https://img.favpng.com/25/7/19/users-group-computer-icons-png-favpng-WKWD9rqs5kwcviNe9am7xgiPx.jpg"
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
        </TouchableOpacity>
        <View style={styles.headerBtnStyle}>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() =>
              props.navigation.navigate("VideoCall", {
                image: otherProfile,
                name: otherName,
              })
            }
          >
            <VideoIcon alignSelf="center" marginHorizontal={wp(2)} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() =>
              props.navigation.navigate("AudioCall", {
                image: otherProfile,
                name: otherName,
              })
            }
          >
            <CallIcon alignSelf="center" />
          </TouchableOpacity>
        </View>
      </View>
      {block || leave ? (
        <View style={styles.blockViewStyle}>
          <Text style={styles.blockTextStyle}>
            {leave && !block
              ? "You leave this chat"
              : !leave && block
              ? "you block this contact "
              : null}
          </Text>
        </View>
      ) : null}

      <View style={styles.whiteContainerStyle}>
        <View
          style={{
            flex:
              !isQuote.state && !isKeyboardVisible
                ? 0.95
                : isQuote.state && !isKeyboardVisible
                ? 0.88
                : !isQuote.state && isKeyboardVisible
                ? 0.95
                : 0.8,
          }}
        >
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator color={colors.black} alignSelf="center" />
            </View>
          ) : files.length != 0 ? (
            <>
              {/* <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={files}
                keyExtractor={(item, index) => index}
                renderItem={flatListRender}
                nestedScrollEnabled={true}
              /> */}

              {flatListRender(files[0])}
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
                  setLoad(true);
                  if (!block) {
                    setIsIndex(isIndex + 1);
                    onSend(null);
                    setTextMsg("");
                  } else {
                    Toast.showWithGravity(
                      "You block this contact",
                      Toast.SHORT,
                      Toast.BOTTOM
                    );
                  }
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
              renderInputToolbar={renderInputToolbar}
              messagesContainerStyle={{
                marginHorizontal: wp(3),
                marginTop: hp(0.6),
                borderRadius: wp(12),
              }}
              messageIdGenerator={messageIdGenerator}
              renderBubble={(props, index) => renderBubble(props, index)}
              isTyping={true}
              alwaysShowSend={false}
              showUserAvatar={true}
              loadEarlier={loadEarlier}
              isLoadingEarlier={isLoadEarlier}
              listViewProps={{
                onEndReached: () => {
                  setLoadEarlier(true);
                  setIsLoadEarlier(true);

                  LoadData();
                },
              }}
            />
          )}
        </View>
        {isPlusPress && !isQuote.state ? (
          <Animatable.View
            animation="fadeInRightBig"
            duration={1500}
            style={[
              styles.footerViewStyle,
              { flex: isKeyboardVisible ? 0.3 : 0.17 },
            ]}
          >
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => {
                Documentpicker([
                  DocumentPicker.types.images,
                  DocumentPicker.types.video,
                ]);
              }}
            >
              <ImageIcon alignSelf="center" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => setIsVisible(true)}
            >
              <ContactIcon alignSelf="center" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniBtns}>
              <EmojiIcon alignSelf="center" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => Documentpicker([DocumentPicker.types.video])}
            >
              <GifIcon alignSelf="center" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => GetCurrentLocation()}
            >
              {isLocLoading ? (
                <View style={{ justifyContent: "center" }}>
                  <ActivityIndicator color={colors.black} alignSelf="center" />
                </View>
              ) : (
                <LocationIcon alignSelf="center" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => Documentpicker([DocumentPicker.types.allFiles])}
            >
              <FileIcon alignSelf="center" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtns}
              onPress={() => setIsColorPicker(true)}
            >
              <ColorPicker alignSelf="center" />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
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
    marginTop: hp(2),
    paddingTop: hp(0.4),
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
  },
  inputToolbarStyle: {
    flexDirection: "row",
    backgroundColor: colors.chatfieldColor,
    marginHorizontal: wp(3),
  },
  leftIconsStyle: {
    flexDirection: "row",
    width: wp(15),

    marginHorizontal: wp(2),
    justifyContent: "space-between",
  },
  textInputView: {
    justifyContent: "center",
    //backgroundColor: "red",
  },
  textInputStyle: {
    textAlignVertical: "center",
    maxHeight: hp(8),
    color: colors.black,
  },
  rightIconsStyle: {
    flexDirection: "row",
    width: wp(20),
  },
  sendBtnStyle: {
    backgroundColor: colors.floatBtnColor,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(9),
    justifyContent: "center",
  },
  footerViewStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: wp(3),
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
    width: wp(35),
    alignSelf: "center",
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
    borderColor: colors.gray,
    borderWidth: 0.5,
    marginVertical: hp(0.5),
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
  cameraPopUp: {
    borderRadius: wp(4),
    height: hp(22),
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
  blockViewStyle: {
    alignSelf: "center",
    borderRadius: wp(6),
    backgroundColor: colors.fieldsColor,
    width: wp(50),
    justifyContent: "center",
    marginTop: hp(1),
  },
  blockTextStyle: {
    color: colors.black,
    fontFamily: fonts.regular,
    alignSelf: "center",
    fontSize: wp(3),
  },
  modalView: {
    backgroundColor: "red",
    borderRadius: 20,
    height: hp(25),
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    padding: 2,
  },
  videoBtnStyle: {
    position: "absolute",
    top: hp(10),
    alignSelf: "center",
  },
  indicatorStyle: {
    position: "absolute",
    color: "black",
    top: 0,
    bottom: 0,
    alignSelf: "center",
  },
  miniBtns: {
    alignSelf: "center",
    justifyContent: "center",
    width: wp(11),
    height: wp(15),
    borderRadius: wp(15),
  },
  quoteTextstyle: {
    marginLeft: wp(8),
    color: colors.color_light_grey,
    opacity: 0.6,
    fontSize: wp(3.5),
    fontFamily: fonts.bold,
    width: wp(70),
    marginBottom: hp(0.5),
  },
  colorBtnStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(5),
    marginVertical: hp(2),
  },
  colorBtnTextStyle: {
    color: "black",
    fontSize: wp(5),
    fontWeight: fonts.bold,
    padding: wp(2),
    alignSelf: "center",
  },
  colorBtncircleStyle: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15),
    borderColor: "black",
    borderWidth: 0.4,
    alignSelf: "center",
  },
  colorPickerPopUp: {
    borderRadius: wp(4),
  },
};
