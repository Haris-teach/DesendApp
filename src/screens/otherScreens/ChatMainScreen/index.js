import firestore from "@react-native-firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Dialog } from "react-native-simple-dialogs";
import Toast from "react-native-simple-toast";
import { SwipeListView } from "react-native-swipe-list-view";
import { useDispatch, useSelector } from "react-redux";
import { BlockArr } from "../../../../redux/actions/authActions";
import fonts from "../../../assets/fonts/fonts";
import Archive from "../../../assets/images/svgs/archive.svg";
import Block from "../../../assets/images/svgs/block.svg";
import Delete from "../../../assets/images/svgs/delete.svg";
import More from "../../../assets/images/svgs/more.svg";
import Pin from "../../../assets/images/svgs/pin.svg";
import Report from "../../../assets/images/svgs/reportUser.svg";
import Read from "../../../assets/images/svgs/read.svg";
// ====================== END =================================
// =================== SVGS IMPORT ===========================
import SearchIcon from "../../../assets/images/svgs/search.svg";
// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import RNThreads from "../../../components/RNThreads";
import { colors } from "../../../constants/colors";
import { UserBlock, UserReport } from "../../../httputils/httputils";

// ====================== END =================================

var reportId = "";
var listner = () => {
  return null;
};

const ChatMainScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const currentUserId = useSelector((state) => state.authReducer.id);
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const number = useSelector((state) => state.authReducer.isPhone);
  const token = useSelector((state) => state.authReducer.token);
  var msgs = [];
  var archiveMsgs = [];
  const [isState, setIsState] = useState("Messages");

  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isThreads, setIsThreads] = useState();
  const [isSearch, setIsSearch] = useState("");
  const [isRightIcon, setIsRightIcon] = useState(false);
  const [isArchive, setIsArchive] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);

  const [reportText, setReportText] = useState("");

  useEffect(() => {
    setIsSearch("");
    setIsState("Messages");
    setIsRightIcon(false);
  }, [isFocused]);

  useEffect(() => {
    GetThreads();
    // let l = firestore()
    //   .collection("chats")
    //   .where("markasReadTo", "array-contains", currentUserId)
    //   .onSnapshot((res) => {
    //     console.log("RES:   ", res.docs[0].data().chatId);
    //   });
    return () => {
      listner();
      GetThreads();
      // l();
    };
  }, []);

  const GetThreads = () => {
    setIsLoading(true);
    setChatRooms([]);
    setIsArchive([]);
    listner = firestore()
      .collection("chats")
      .where("visibleTo", "array-contains", currentUserId)

      .onSnapshot((res) => {
        msgs = [];
        archiveMsgs = [];
        if (res.docs.length != 0) {
          res.docs.forEach((i) => {
            const {
              chatId,
              visibleTo,
              block,
              archive,
              pin,
              lastmessage,
              blockTo,
              archiveTo,
              deleteTo,
              pinTo,
              members,
              markasReadTo,
              leaveTo,
            } = i.data();

            let obj = {
              block: block,
              chatId: chatId,
              data: lastmessage,
              allData: res.docs,
              visibleTo: visibleTo,
              archive: archive,
              pin: pin,
              deleteTo: deleteTo,
              blockTo: blockTo,
              archiveTo: archiveTo,
              pinTo: pinTo,
              members: members,
              markasReadTo: markasReadTo,
              leaveTo: leaveTo,
            };

            if (lastmessage != null) {
              if (archiveTo.includes(currentUserId)) {
                archiveMsgs.push(obj);
              } else {
                msgs.push(obj);
              }
            }

            setIsLoading(false);
          });
          let Data = msgs.sort(function compare(a, b) {
            var dateA = new Date(a.data.createdAt);
            var dateB = new Date(b.data.createdAt);
            let flag = 0;

            if (dateB > dateA) flag = 1;
            if (dateB < dateA) flag = -1;
            if (a.pinTo.includes(currentUserId)) flag = -1;
            if (!a.pinTo.includes(currentUserId)) flag = 1;
            return flag;
          });

          let arr = archiveMsgs.sort(function compare(a, b) {
            var dateA = new Date(a.data.createdAt);
            var dateB = new Date(b.data.createdAt);
            let flag = 0;

            if (dateB > dateA) flag = 1;
            if (dateB < dateA) flag = -1;
            if (a.pinTo.includes(currentUserId)) flag = -1;
            if (!a.pinTo.includes(currentUserId)) flag = 1;
            return flag;
          });
          setIsArchive(arr);
          setChatRooms(Data);
          setIsThreads(Data);
        } else {
          setIsLoading(false);
        }
      });
  };

  const renderItem = (data) => {
    let item = data.item.data;
    var Data = item.image;
    if (Data != null) {
      var type = Data.type.split("/");
      var name = Data.name.split(".");
    }

    return (
      <RNThreads
        onPress={() => {
          props.navigation.navigate("ChatRoom", {
            userName:
              item.otherUserId.length >= 3
                ? item.otherUserName
                : item.user._id == currentUserId
                ? item.otherUserName
                : item.user.name,
            userId: data.item.visibleTo,
            isGroup: item.isGroup,
            userProfile:
              data.item.members.length > 2
                ? ""
                : item.user._id == currentUserId
                ? item.otherProfile
                : item.user.avatar,
            exists: true,
            userNumber:
              item.userNumber == number ? item.user.number : item.userNumber,
            block: data.item.block,
            leave: data.item.leaveTo,
            blockTo: data.item.blockTo,
          });
        }}
        MBackgroundColor={colors.bWhite}
        image={{
          uri:
            item.otherUserId.length >= 3
              ? "https://img.favpng.com/25/7/19/users-group-computer-icons-png-favpng-WKWD9rqs5kwcviNe9am7xgiPx.jpg"
              : item.user._id == currentUserId
              ? item.otherProfile
              : item.user.avatar,
        }}
        icon={data.item.markasReadTo.includes(currentUserId) ? <Read /> : null}
        resizeMode="cover"
        imageWidth={wp(16)}
        imageHeight={wp(16)}
        imageBorderRadius={wp(16)}
        height={hp(10)}
        marginHorizontal={wp(8)}
        marginVertical={hp(2)}
        threadName={
          item.otherUserId.length >= 3
            ? item.otherUserName
            : item.user._id == currentUserId
            ? item.otherUserName
            : item.user.name
        }
        time={moment(item.createdAt).format("hh:mm A")}
        timeWidth={wp(15)}
        msg={
          data.item.blockTo.includes(currentUserId)
            ? ""
            : item.image == null
            ? item.text
            : type[0] == "video"
            ? `video.${name[1]}`
            : type[0] == "image"
            ? `image.${name[1]}`
            : type[0] == "location"
            ? "Location"
            : `Document.${name[1]}`
        }
        fontFamily={fonts.medium}
        fontSize={wp(4.4)}
        nameColor={colors.black}
        nameWidth={wp(40)}
        timeFontFamily={fonts.regular}
        timeFontSize={wp(3)}
        timeColor={colors.gray}
        msgWidth={wp(40)}
        msgFontFamily={fonts.regular}
        msgFontSize={wp(3.5)}
        msgColor={colors.gray}
        Pin={
          data.item.pinTo.includes(currentUserId) ? (
            <Pin alignSelf="center" marginLeft={wp(1)} />
          ) : null
        }
        linemarginHorizontal={wp(2)}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "flex-end",
          marginRight: wp(-2),
          justifyContent: "center",
        }}
      >
        <Menu>
          <MenuTrigger>
            <More marginRight={wp(10)} />
          </MenuTrigger>

          <MenuOptions
            optionsContainerStyle={{
              width: wp(70),
              borderRadius: 15,
              marginTop: hp(2.9),
            }}
          >
            <MenuOption
              onSelect={() => {
                setIsLoading(true);
                ArchiveThreads(data.item.chatId, data.item.archiveTo);
                closeRow(rowMap, data.item.chatId);
              }}
            >
              <View style={styles.menuRowStyle}>
                <Text style={styles.menuTextStyle}>
                  {data.item.archiveTo.includes(currentUserId)
                    ? "UnArchive"
                    : "Archive"}
                </Text>
                <Archive alignSelf="center" width={wp(5)} height={hp(5)} />
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                setIsLoading(true);
                PinChat(data.item.chatId, data.item.pinTo);
                closeRow(rowMap, data.item.chatId);
              }}
            >
              <View style={styles.menuRowStyle}>
                <Text style={styles.menuTextStyle}>
                  {data.item.pinTo.includes(currentUserId) ? "UnPin" : "Pin"}
                </Text>
                <Pin alignSelf="center" width={wp(5)} height={hp(5)} />
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                setIsLoading(true);
                MarkAsRead(data.item.chatId, data.item.markasReadTo);
                closeRow(rowMap, data.item.chatId);
              }}
            >
              <View style={styles.menuRowStyle}>
                <Text style={styles.menuTextStyle}>
                  {data.item.markasReadTo.includes(currentUserId)
                    ? "Mark as Unread"
                    : "Mark as Read"}
                </Text>
                <Read alignSelf="center" width={wp(5)} height={hp(5)} />
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                if (
                  data.item.data.otherUserId.length > 2 &&
                  data.item.leaveTo.includes(currentUserId)
                ) {
                  Toast.showWithGravity(
                    "you already leave this chat",
                    Toast.SHORT,
                    Toast.BOTTOM
                  );
                } else {
                  setIsLoading(true);
                  BlockUser(
                    data.item.data.otherUserId,
                    data.item.chatId,
                    data.item.blockTo,
                    data.item.leaveTo
                  );
                }
                closeRow(rowMap, data.item.chatId);
              }}
            >
              <View style={styles.menuRowStyle}>
                <Text style={styles.menuTextStyle}>
                  {data.item.members.length > 2 ||
                  data.item.leaveTo.includes(currentUserId)
                    ? "Leave group"
                    : data.item.blockTo.includes(currentUserId)
                    ? "Unblock"
                    : "Block"}
                </Text>
                <Block alignSelf="center" width={wp(5)} height={hp(5)} />
              </View>
            </MenuOption>
            {data.item.members.length < 3 ? (
              <MenuOption
                onSelect={() => {
                  reportId = data.item.members.filter(
                    (e) => e != currentUserId
                  )[0];
                  setIsPopUp(true);
                }}
              >
                <View style={styles.menuRowStyle}>
                  <Text style={styles.menuTextStyle}>Report User</Text>
                  <Report alignSelf="center" width={wp(5)} height={hp(5)} />
                </View>
              </MenuOption>
            ) : null}
            <MenuOption
              onSelect={() => {
                setIsLoading(true);
                DeleteThread(
                  data.item.visibleTo,
                  data.item.chatId,
                  data.item.deleteTo
                );
                closeRow(rowMap, data.item.chatId);
              }}
            >
              <View style={styles.menuRowStyle}>
                <Text style={styles.menuTextStyle}>Delete</Text>
                <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
              </View>
            </MenuOption>
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

  // Delete threads function
  const DeleteThread = (array, chatId, deleteArray) => {
    const arr = array.filter((item) => item != currentUserId);

    //const arr1 = deleteArray.filter((item) => item != currentUserId);

    firestore()
      .collection("chats")
      .doc(chatId)
      .get()
      .then((res) => {
        if (res.data().visibleTo.length == 1) {
          firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .get()
            .then((res) => {
              res.docs.forEach((msg) => {
                firestore()
                  .collection("chats")
                  .doc(chatId)
                  .collection("messages")
                  .doc(msg.id)
                  .delete();
              });
              firestore().collection("chats").doc(chatId).delete();
            });
        } else {
          firestore()
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .get()
            .then((res) => {
              res.docs.forEach((msg) => {
                if (msg.exists) {
                  firestore()
                    .collection("chats")
                    .doc(chatId)
                    .collection("messages")
                    .doc(msg.id)
                    .update({ visibleTo: arr });
                }
              });

              firestore()
                .collection("chats")
                .doc(chatId)
                .update({ visibleTo: arr })
                .then((res) => {
                  setIsLoading(false);
                });
            });
        }
      });

    dispatch(BlockArr([]));
  };

  const ContactSearch = () => {
    if (isSearch != null) {
      let term = isSearch.toLowerCase();
      let obj = chatRooms.filter(
        (item) => item.data.otherUserName.toLowerCase().indexOf(term) > -1
      );
      setIsThreads(obj);
    }
  };

  //Block User function
  const BlockUser = (userID, chatId, blockTo, leaveTo) => {
    let arr = userID.filter((item) => item != currentUserId);
    const ar = blockTo.filter((i) => i != currentUserId);

    if (userID.length > 2 && leaveTo.length == 0) {
      var a = leaveTo;
      a.push(currentUserId);
      firestore().collection("chats").doc(chatId).update({
        leaveTo: a,
        members: arr,
      });
    } else if (userID.length == 2 && leaveTo.length == 0) {
      let params = {
        contact: arr[0],
      };
      UserBlock(params, token).then((res) => {
        if (res.status == 1) {
          if (blockTo.includes(currentUserId)) {
            firestore()
              .collection("chats")
              .doc(chatId)
              .update({
                blockTo: ar,
              })
              .then(() => {
                setIsLoading(false);
                dispatch(BlockArr(ar));
              });
          } else {
            var a = blockTo;
            a.push(currentUserId);

            firestore()
              .collection("chats")
              .doc(chatId)
              .update({ blockTo: [...new Set(a)] })
              .then(() => {
                setIsLoading(false);
                dispatch(BlockArr(a));
              });
          }
        } else {
          setIsLoading(false);
          Toast.showWithGravity(res.message, Toast.SHORT, Toast.BOTTOM);
        }
      });
    } else {
      return null;
    }
  };
  //  END

  const ArchiveThreads = (chatId, archiveTo) => {
    if (archiveTo.includes(currentUserId)) {
      let arr = archiveTo.filter((item) => item != currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ archiveTo: arr })
        .then(() => setIsLoading(false));
    } else {
      var a = archiveTo;
      a.push(currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ archiveTo: a })
        .then(() => setIsLoading(false));
    }
  };

  const PinChat = (chatId, pinTo) => {
    if (pinTo.includes(currentUserId)) {
      let arr = pinTo.filter((item) => item != currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ pinTo: arr })
        .then(() => setIsLoading(false));
    } else {
      var a = pinTo;
      a.push(currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ pinTo: a })
        .then(() => {
          setIsLoading(false);
        });
    }
  };

  const MarkAsRead = (chatId, markasReadTo) => {
    if (markasReadTo.includes(currentUserId)) {
      let arr = markasReadTo.filter((item) => item != currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ markasReadTo: arr })
        .then(() => setIsLoading(false));
    } else {
      var a = markasReadTo;
      a.push(currentUserId);
      firestore()
        .collection("chats")
        .doc(chatId)
        .update({ markasReadTo: a })
        .then(() => setIsLoading(false));
    }
  };

  const RenderModal = () => {
    return (
      <Dialog
        visible={isPopUp}
        onTouchOutside={() => setIsPopUp(false)}
        dialogStyle={styles.dialogStyle}
        title="Report User"
      >
        <View>
          <TextInput
            placeholder="Comment....."
            onChangeText={(text) => setReportText(text)}
            style={{
              textAlignVertical: "top",
              color: "black",
              maxHeight: hp(25),
              minHeight: hp(7),
              // backgroundColor: "red",
              borderColor: colors.lightBlack,
              borderWidth: 0.5,
              borderRadius: wp(3),
              marginVertical: hp(2),
            }}
            multiline={true}
          />

          <TouchableOpacity
            style={styles.dialogBtnStyle}
            onPress={() => {
              if (reportText != "") {
                ReportUser();
              } else {
                Toast.showWithGravity(
                  "Comment field is empty",
                  Toast.SHORT,
                  Toast.BOTTOM
                );
              }
            }}
          >
            <Text style={{ alignSelf: "center", color: colors.black }}>
              Report
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  const ReportUser = () => {
    let params = {
      userId: reportId,
      comment: reportText,
    };

    UserReport(params, token).then((res) => {
      if (res.status == 1) {
        Toast.showWithGravity(res.message, Toast.SHORT, Toast.BOTTOM);
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      {!isRightIcon ? (
        <RNHeader
          //leftIcon={<MenU alignSelf="center" />}
          rightIcon={<SearchIcon alignSelf="center" />}
          //leftOnPress={() => props.navigation.goBack()}
          rightOnPress={() => setIsRightIcon(true)}
          headerText={isState}
          headerTextColor={colors.white}
          fontSize={wp(6)}
          fontFamily={fonts.medium}
        />
      ) : (
        <View
          style={{
            height: hp(6),
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: wp(3),
            marginTop: hp(5),
          }}
        >
          <View
            style={{
              backgroundColor: colors.fieldsColor,
              borderRadius: wp(2),
              width: wp(80),
              marginLeft: wp(4),
            }}
          >
            <TextInput
              placeholder="Search"
              style={{ marginLeft: wp(4), color: colors.black }}
              onChangeText={(text) => setIsSearch(text)}
              value={isSearch}
            />
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => {
              setIsRightIcon(false);
              ContactSearch();
            }}
          >
            <SearchIcon alignSelf="center" marginRight={wp(2)} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.rowStyle}>
        <TouchableOpacity
          onPress={() => {
            setIsState("Messages");
          }}
        >
          <Text
            style={[
              styles.loginTextStyle,
              { color: isState == "Messages" ? colors.white : colors.gray },
            ]}
          >
            All Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsState("Archived Chats")}>
          <Text
            style={[
              styles.loginTextStyle,
              {
                color: isState == "Archived Chats" ? colors.white : colors.gray,
              },
            ]}
          >
            Archived
          </Text>
        </TouchableOpacity>
      </View>

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        {/* <ScrollView style={{ flex: 1 }}> */}
        <Text style={styles.headingStyle}>Recent Chats</Text>

        {/* <View>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            data={listData}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              return (
                <RNAvatar
                  width={wp(16)}
                  height={wp(16)}
                  borderRadius={wp(16)}
                  viewWidth={wp(19)}
                  viewHeight={wp(19)}
                  viewBorderRadius={wp(19)}
                  borderColor={colors.loginBtnColor}
                  marginHorizontal={wp(2)}
                  source={require("../../../assets/images/pngs/splash.png")}
                  resizeMode="cover"
                  borderWidth={wp(0.7)}
                  justifyContent="center"
                  count={item.count}
                  textWidth={wp(4)}
                  textHeight={wp(4)}
                  textBorderRadius={wp(4)}
                  fontSize={wp(2)}
                  backgroundColor={colors.loginBtnColor}
                  textMarginLeft={wp(-4)}
                  textBorderColor={colors.white}
                  textBorderWidth={wp(0.5)}
                  countColor={colors.black}
                />
              );
            }}
          />
        </View> */}
        {isLoading ? (
          <ActivityIndicator
            color={colors.black}
            style={styles.activityIndicatorStyle}
          />
        ) : isState == "Messages" && chatRooms.length == 0 ? (
          <Text style={styles.noThreadStyle}>No record found</Text>
        ) : isState != "Messages" && isArchive.length == 0 ? (
          <Text style={styles.noThreadStyle}>No record found</Text>
        ) : (
          <View style={{ flex: 0.85 }}>
            <SwipeListView
              data={
                isState != "Messages"
                  ? isArchive
                  : isSearch == ""
                  ? chatRooms
                  : isThreads
              }
              renderItem={renderItem}
              keyExtractor={(item) => item.chatId}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={75}
              rightOpenValue={-70}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe
              refreshing={isLoading}
              onRefresh={() => {
                GetThreads();
              }}
            />
          </View>
        )}

        {/* </ScrollView> */}
      </View>
    </View>
  );
};

export default ChatMainScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(5),
    fontFamily: fonts.medium,
  },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: wp(15),
    marginTop: hp(3),
  },
  headingStyle: {
    color: "black",
    marginHorizontal: wp(11),
    marginVertical: hp(3),
    fontSize: wp(5.2),
    fontFamily: fonts.medium,
  },
  phoneInputStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(8),
  },
  countryPickerStyle: {
    backgroundColor: colors.fieldsColor,
    width: wp(25),
    height: hp(6),
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: wp(3),
  },
  callingCodeStyle: {
    alignSelf: "center",
    opacity: 0.34,
    color: colors.black,
    marginLeft: wp(-2),
    fontSize: wp(4),
  },
  footerStyle: {
    marginHorizontal: wp(8),
    color: colors.lightBlack,
    fontFamily: fonts.medium,
    marginTop: hp(2),
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: colors.bWhite,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: wp(100),
    height: hp(9),
  },
  backRightBtnLeft: {
    //backgroundColor: "red",
    right: 10,
    marginTop: hp(3),
  },
  hiddenTextStyle: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: wp(2.5),
    marginTop: hp(0.5),
    marginRight: wp(10),
  },
  menuRowStyle: {
    justifyContent: "space-between",
    flexDirection: "row",

    marginHorizontal: wp(2),
  },
  menuTextStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(3.5),
    alignSelf: "center",
    color: colors.black,
  },

  actionStyle: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: 5,
    right: 50,
  },
  actionBtnStyle: {
    borderRadius: hp(6),
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.floatBtnColor,
  },
  noThreadStyle: {
    alignSelf: "center",
    marginTop: hp(20),
    fontFamily: fonts.regular,
    color: colors.black,
  },
  activityIndicatorStyle: {
    backgroundColor: "white",
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignSelf: "center",
    marginTop: hp(3),
  },
  dialogStyle: {
    borderRadius: wp(4),
  },
  dialogBtnStyle: {
    width: wp(30),
    height: hp(5),
    justifyContent: "center",
    borderRadius: wp(2),
    backgroundColor: colors.loginBtnColor,
    alignSelf: "flex-end",
    marginTop: hp(1),
  },
};

{
  /* {isState == "Messages" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.actionStyle}
                //onPress={() => props.navigation.navigate("ChatRoom")}
              >
                <View style={styles.actionBtnStyle}>
                  <Pen width={wp(5)} height={hp(5)} />
                </View>
              </TouchableOpacity>
            ) : null} */
}
