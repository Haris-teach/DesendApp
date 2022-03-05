import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SwipeListView } from "react-native-swipe-list-view";
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
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

// ====================== END =================================

// ===================== Dummy Data ============================

// ======================== END ===============================

const ChatMainScreen = (props) => {
  const isFocused = useIsFocused();
  const { SlideInMenu, Popover, ContextMenu, NotAnimatedContextMenu } =
    renderers;
  const currentUserId = useSelector((state) => state.authReducer.id);
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const userName = `${firstName} ${lastName}`;
  const [isState, setIsState] = useState("Messages");
  const [isCounter, setIsCounter] = useState(2);
  const [listData, setListData] = useState([
    {
      key: 1,
      count: null,
      pin: true,
    },
    {
      key: 2,
      count: 2,
      pin: false,
    },
    {
      key: 3,
      count: null,
      pin: true,
    },
    {
      key: 4,
      count: 4,
      pin: false,
    },
    {
      key: 5,
      count: 4,
      pin: false,
    },
    {
      key: 6,
      count: 4,
      pin: false,
    },
    {
      key: 7,
      count: 4,
      pin: false,
    },
    {
      key: 8,
      count: 4,
      pin: false,
    },
  ]);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetThreads();
  }, [isFocused]);

  const GetThreads = () => {
    setIsLoading(true);
    let msgs = [];
    firestore()
      .collection("chats")
      .where("members", "array-contains", currentUserId)
      .onSnapshot({ includeMetadataChanges: true }, (res) => {
        if (res._docs.length != 0) {
          res.docs.forEach((msg) => {
            if (msg.exists) {
              firestore()
                .collection("chats")
                .doc(msg.data().chatId)
                .collection("messages")
                .orderBy("createdAt", "asc")
                .onSnapshot({ includeMetadataChanges: true }, (resp) => {
                  if (resp.docs.length != 0) {
                    let obj = {
                      chatId: msg.data().chatId,
                      data: resp.docs[0]._data,
                      createdAt: resp.docs[0]._data.createdAt,
                    };
                    msgs.push(obj);
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
        } else {
          setIsLoading(false);
        }
      });
  };

  const renderItem = (data) => {
    let item = data.item.data;

    return (
      <RNThreads
        onPress={() =>
          props.navigation.navigate("ChatRoom", {
            userName: item.otherUserName,
            userId:
              item.otherUserId == currentUserId
                ? [item.user._id]
                : item.otherUserId.length > 1
                ? item.otherUserId
                : [item.otherUserId],
            userProfile: item.user.avatar,
            userNumber: item.userNumber,
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
          userName == item.otherUserName ? item.user.name : item.otherUserName
        }
        time={moment(item.createdAt).format("hh:mm A")}
        timeWidth={wp(15)}
        msg={item.text}
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
        icon={<SingleTick alignSelf="center" />}
        Pin={
          data.item.pin ? <Pin alignSelf="center" marginLeft={wp(1)} /> : null
        }
        linemarginHorizontal={wp(2)}
      />
    );
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    let index = listData.indexOf((item) => item.key == rowKey);
    listData.splice(index, 0);

    setListData(listData.filter((item) => item.key != rowKey));
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
        <Menu
          renderer={ContextMenu}
          rendererProps={{ anchorStyle: styles.anchorStyle }}
        >
          <MenuTrigger>
            <More marginRight={wp(10)} />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity style={styles.menuRowStyle}>
              <Text style={styles.menuTextStyle}>Archive</Text>
              <Archive alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuRowStyle}>
              <Text style={styles.menuTextStyle}>Pin</Text>
              <Pin2 alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRowStyle}>
              <Text style={styles.menuTextStyle}>Mark as Read/Unread</Text>
              <Read alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuRowStyle}>
              <Text style={styles.menuTextStyle}>Block</Text>
              <Block alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRowStyle}>
              <Text style={styles.menuTextStyle}>Delete</Text>
              <Delete alignSelf="center" width={wp(5)} height={hp(5)} />
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }) => <Text>{section.title}</Text>;
  //End Code

  return (
    <MenuProvider>
      <View style={styles.mainContainer}>
        <RNHeader
          leftIcon={<MenU alignSelf="center" />}
          rightIcon={<SearchIcon alignSelf="center" />}
          //leftOnPress={() => props.navigation.goBack()}
          headerText={isState}
          headerTextColor={colors.white}
          fontSize={wp(6)}
          fontFamily={fonts.medium}
        />

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
                  color:
                    isState == "Archived Chats" ? colors.white : colors.gray,
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
                    width={wp(17)}
                    height={wp(17)}
                    borderRadius={wp(17)}
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
            <ActivityIndicator color={colors.black} />
          ) : (
            <View style={{ flex: 0.85 }}>
              <SwipeListView
                data={chatRooms}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                renderSectionHeader={renderSectionHeader}
                leftOpenValue={75}
                rightOpenValue={-Dimensions.get("window").width}
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
    </MenuProvider>
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
    marginVertical: hp(1),
    marginHorizontal: wp(2),
  },
  menuTextStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(3.5),
    alignSelf: "center",
    color: colors.black,
  },
  anchorStyle: {
    marginRight: wp(10),
    backgroundColor: "red",
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
};
