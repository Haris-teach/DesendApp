import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SwipeListView } from "react-native-swipe-list-view";
import { Dialog } from "react-native-simple-dialogs";
import firestore from "@react-native-firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNAvatar from "../../../components/RNAvatar";
import RNThreads from "../../../components/RNThreads";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import SearchIcon from "../../../assets/images/svgs/search.svg";
import MenU from "../../../assets/images/svgs/menu.svg";
import SingleTick from "../../../assets/images/svgs/singleTick.svg";
import Pin from "../../../assets/images/svgs/pin.svg";
import More from "../../../assets/images/svgs/more.svg";
import Archive from "../../../assets/images/svgs/archive.svg";
import Pin2 from "../../../assets/images/svgs/pin2.svg";
import Read from "../../../assets/images/svgs/read.svg";
import Block from "../../../assets/images/svgs/block.svg";
import Delete from "../../../assets/images/svgs/delete.svg";
import Pen from "../../../assets/images/svgs/pen.svg";
import DoubleTick from "../../../assets/images/svgs/doubleTick.svg";
import { UserBlock } from "../../../httputils/httputils";

// ====================== END =================================

// ===================== Dummy Data ============================

// ======================== END ===============================

const ChatMainScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const currentUserId = useSelector((state) => state.authReducer.id);
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const number = useSelector((state) => state.authReducer.isPhone);
  const token = useSelector((state) => state.authReducer.token);

  const userName = `${firstName} ${lastName}`;
  const [isState, setIsState] = useState("Messages");
  const [listData, setListData] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isThreads, setIsThreads] = useState();
  const [isSearch, setIsSearch] = useState("");
  const [isRightIcon, setIsRightIcon] = useState(false);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    GetThreads();
    setChatRooms([]);
    setIsThreads([]);
  }, []);

  const GetThreads = () => {
    setIsLoading(true);

    firestore()
      .collection("chats")
      .where("members", "array-contains", currentUserId)
      .onSnapshot({ includeMetadataChanges: true }, (res) => {
        if (res._docs.length != 0) {
          res.docs.forEach((msg) => {
            if (msg.exists) {
              const { chatId, visibleTo } = msg.data();
              firestore()
                .collection("chats")
                .doc(chatId)
                .collection("messages")
                .orderBy("createdAt", "desc")
                .onSnapshot({ includeMetadataChanges: true }, (resp) => {
                  if (resp.docs.length != 0) {
                    let obj = {
                      chatId: chatId,
                      data: resp.docs[0]._data,
                      createdAt: resp.docs[0]._data.createdAt,
                      allData: resp.docs,
                      visibleTo: visibleTo,
                    };

                    if (msgs.some((item) => item.chatId == chatId)) {
                      const index = msgs.findIndex(
                        (item) => item.chatId == chatId
                      );

                      msgs[index] = obj;
                      setMsgs(msgs);
                    } else {
                      msgs.push(obj);
                      setMsgs(msgs);
                    }

                    setIsLoading(false);
                  } else {
                    setIsLoading(false);
                  }
                });
            }
          });

          let Data = msgs.sort(function compare(a, b) {
            var dateA = new Date(a.createdAt);
            var dateB = new Date(b.createdAt);
            return dateB - dateA;
          });

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
        onPress={() =>
          props.navigation.navigate("ChatRoom", {
            userName:
              item.otherUserId.length >= 3
                ? "Group"
                : item.user._id == currentUserId
                ? item.otherUserName
                : item.user.name,
            userId:
              item.otherUserId == [currentUserId]
                ? [item.user._id]
                : item.otherUserId.length >= 1
                ? item.otherUserId
                : item.otherUserId,

            userProfile: item.user.avatar,
            userNumber:
              item.userNumber == number ? item.user.number : item.userNumber,
          })
        }
        MBackgroundColor={colors.bWhite}
        image={{ uri: item.user.avatar }}
        resizeMode="cover"
        imageWidth={wp(16)}
        imageHeight={wp(16)}
        imageBorderRadius={wp(16)}
        height={hp(10)}
        marginHorizontal={wp(8)}
        marginVertical={hp(2)}
        threadName={
          item.otherUserId.length >= 3
            ? "Group"
            : item.user._id == currentUserId
            ? item.otherUserName
            : item.user.name
        }
        time={moment(item.createdAt).format("hh:mm A")}
        timeWidth={wp(15)}
        msg={
          item.image == null
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
          data.item.pin ? <Pin alignSelf="center" marginLeft={wp(1)} /> : null
        }
        linemarginHorizontal={wp(2)}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
          {/* <TouchableOpacity onPress={() => setIsVisible(true)}> */}
          <Menu>
            <MenuTrigger>
              <More marginRight={wp(10)} />
            </MenuTrigger>
            {/* </TouchableOpacity> */}
            <MenuOptions
              optionsContainerStyle={{
                width: wp(70),
                borderRadius: 15,
                marginTop: hp(2.9),
              }}
            >
              <MenuOption>
                <View style={styles.menuRowStyle}>
                  <Text style={styles.menuTextStyle}>Archive</Text>
                  <Archive alignSelf="center" width={wp(5)} height={hp(5)} />
                </View>
              </MenuOption>
              <MenuOption>
                <View style={styles.menuRowStyle}>
                  <Text style={styles.menuTextStyle}>Pin</Text>
                  <Pin2 alignSelf="center" width={wp(5)} height={hp(5)} />
                </View>
              </MenuOption>
              <MenuOption>
                <View style={styles.menuRowStyle}>
                  <Text style={styles.menuTextStyle}>Mark as Read/Unread</Text>
                  <Read alignSelf="center" width={wp(5)} height={hp(5)} />
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  BlockUser(data.item.data.otherUserId);
                  closeRow(rowMap, data.item.chatId);
                }}
              >
                <View style={styles.menuRowStyle}>
                  <Text style={styles.menuTextStyle}>Block</Text>
                  <Block alignSelf="center" width={wp(5)} height={hp(5)} />
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  setIsVisible(false);
                  // DeleteThread(data.item.visibleTo, data.item.chatId);
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
      </View>
    );
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  // Delete threads function
  const DeleteThread = (array, chatId) => {
    const arr = array.filter((item) => item != currentUserId);
    firestore().collection("chats").doc(chatId).update({ visibleTo: arr });
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

  const BlockUser = (userID) => {
    if (userID.length > 2) {
      Toast.showWithGravity(
        "This is not for Group chat",
        Toast.SHORT,
        Toast.BOTTOM
      );
    } else {
      let arr = userID.filter((item) => item != currentUserId);
      let params = {
        contact: arr[0],
      };
      UserBlock(params, token).then((res) => null);
    }
  };

  //  END

  return (
    <View style={styles.mainContainer}>
      {!isRightIcon ? (
        <RNHeader
          leftIcon={<MenU alignSelf="center" />}
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
        <TouchableOpacity onPress={() => setIsState("Messages")}>
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

        <View>
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
        </View>
        {isLoading ? (
          <ActivityIndicator
            color={colors.black}
            style={styles.activityIndicatorStyle}
          />
        ) : chatRooms.length == 0 ? (
          <Text style={styles.noThreadStyle}>No record found</Text>
        ) : (
          <View style={{ flex: 0.85 }}>
            <SwipeListView
              data={isSearch == "" ? chatRooms : isThreads}
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
            {isState == "Messages" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.actionStyle}
                //onPress={() => props.navigation.navigate("ChatRoom")}
              >
                <View style={styles.actionBtnStyle}>
                  <Pen width={wp(5)} height={hp(5)} />
                </View>
              </TouchableOpacity>
            ) : null}
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
};
