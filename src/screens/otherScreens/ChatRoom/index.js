import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
  Image,
  SectionList,
  Clipboard,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Linking,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import * as ImagePicker from "react-native-image-picker";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Video from "react-native-video";
import { SwipeListView } from "react-native-swipe-list-view";
import Popover from "react-native-popover-view";
import { useSelector, useDispatch } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import DocumentPicker from "react-native-document-picker";
var FormData = require("form-data");
import { Dialog } from "react-native-simple-dialogs";

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

const ChatRoom = (props) => {
  const isProfile = useSelector((state) => state.authReducer.uri);
  const currentUserId = useSelector((state) => state.authReducer.id);
  const userName = useSelector((state) => state.authReducer.firstName);
  const token = useSelector((state) => state.authReducer.token);
  const otherName = props.route.params.userName;
  const otherNumber = props.route.params.userNumber;
  const userID = props.route.params.userId;
  const otherProfile = props.route.params.userProfile;
  let chatId = createChatId([...[currentUserId], ...userID]);

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
  const [isRecording, setIsRecording] = useState(false);
  var [timerState, setTimerState] = useState(0);
  const [fileUri, setFileURI] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [files, setFiles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [contactObj, setContactObj] = useState(null);

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
        res.docs.forEach((msg) => {
          if (msg.exists) {
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
              docId: msg.id,
              createdAt: moment(createdAt),
              user: { name, _id, avatar },
              image,
            };
            msgs.push(data);
          }
        });
        let Data = msgs.sort(function compare(a, b) {
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setMessages(Data);
      });
  }, []);

  // upload image on fire storage

  const onSend = () => {
    if (url.length == 0) {
      sendMessage(
        {
          id: isIndex,
          text: textMsg,
          image: null,
          createdAt: moment().format(),
          sent: true,
          isSeen: false,
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
    } else {
      url.map((i) => {
        sendMessage(
          {
            id: isIndex,
            text: textMsg,
            image: i,
            createdAt: moment().format(),
            sent: true,
            isSeen: false,
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
      });
    }
    files.splice(0, files.length);
    url.splice(0, url.length);
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
                {moment
                  .utc(props.currentMessage.createdAt)
                  .local()
                  .format("HH:mm")}
              </Text>
            </View>

            <View
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
            </View>

            {props.currentMessage.user._id == currentUserId ? (
              <DoubleTick alignSelf="flex-end" />
            ) : null}
          </View>
        ) : type[0] == "image" ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(Data.uri)}
            style={styles.mediaStyle}
          >
            <Image
              source={{ uri: Data.uri }}
              style={{ width: "100%", height: "100%", borderRadius: wp(5) }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : type[0] == "video" ? (
          <TouchableOpacity
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
        ) : (
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
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Circle-icons-folder.svg/1024px-Circle-icons-folder.svg.png",
                }}
                style={{
                  width: wp(15),
                  height: wp(15),
                  borderRadius: wp(2),
                  alignSelf: "center",
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: colors.black,
                  fontFamily: fonts.regular,
                  fontSize: wp(3),
                  marginRight: wp(2),
                  width: wp(50),
                }}
              >
                {Data.name}
              </Text>
            </View>

            {/* {props.currentMessage.user._id == currentUserId ? (
              <DoubleTick alignSelf="flex-end" />
            ) : null} */}
          </TouchableOpacity>
        )}
      </>
    );
  };
  const renderHiddenItem = (data, rowMap, props) => {
    var Data = props.currentMessage.image;
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
            props.currentMessage.user._id != currentUserId
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
            <TouchableOpacity
              style={styles.popUpRowStyle}
              onPress={() => {
                closeRow(rowMap, 0);
                DeleteSingleMsg(props.currentMessage.docId);
              }}
            >
              <Text style={styles.popUpTextStyle}>Delete</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
          </View>
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

  const DeleteSingleMsg = (msgId) => {
    // define document location (Collection Name > Document Name > Collection Name >)
    var docRef = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    // delete the document
    docRef.doc(msgId).delete();
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
          ) : (
            <Image
              source={{
                uri:
                  name[1] == "docx"
                    ? "https://www.macworld.com/wp-content/uploads/2021/12/word-app-icon.png"
                    : name[1] == "pdf"
                    ? "https://www.iconpacks.net/icons/2/free-pdf-icon-1512-thumb.png"
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Circle-icons-folder.svg/1024px-Circle-icons-folder.svg.png",
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
            `Name:  ${item.givenName}                                Number:  ${item.phoneNumbers[0]}`
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
        title="Contacts"
        titleStyle={{ alignSelf: "center" }}
        onTouchOutside={() => setIsVisible(false)}
        dialogStyle={{
          borderRadius: wp(4),
          width: wp(100),
          height: hp(100),
          marginLeft: wp(-5),
        }}
      >
        <SectionList
          keyExtractor={(item, index) => `${item.key}+${index}`}
          renderSectionHeader={defaultSectionHeader}
          sections={sortedArray}
          renderItem={renderItems}
          showsVerticalScrollIndicator={false}
        />
      </Dialog>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      <View style={styles.mainHeaderContainer}>
        <TouchableOpacity
          onPress={() => {
            if (url.length == 0) {
              props.navigation.goBack();
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
                keyExtractor={(item) => item.id}
                renderItem={flatListRender}
                nestedScrollEnabled={true}
              />
              <View>{renderInputToolbar()}</View>
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
              <TouchableOpacity>
                <LocationIcon />
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
};
