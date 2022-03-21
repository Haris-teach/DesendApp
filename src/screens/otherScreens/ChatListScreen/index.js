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

import SingleTick from "../../../assets/images/svgs/singleTick.svg";
import Pin from "../../../assets/images/svgs/pin.svg";
import BackArrow from "../../../assets/images/svgs/backArrow.svg";

// ====================== END =================================

// ===================== Dummy Data ============================

// ======================== END ===============================

const ChatList = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentUserId = useSelector((state) => state.authReducer.id);
  const number = useSelector((state) => state.authReducer.isPhone);
  const currentMessage = props.route.params.currentMessage;

  const [chatRooms, setChatRooms] = useState([]);
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
                .orderBy("createdAt", "desc")
                .onSnapshot({ includeMetadataChanges: true }, (resp) => {
                  if (resp.docs.length != 0) {
                    let obj = {
                      chatId: msg.data().chatId,
                      data: resp.docs[0]._data,
                      createdAt: resp.docs[0]._data.createdAt,
                      allData: resp.docs,
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
            farwordMsg: currentMessage,
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
        // icon={<SingleTick alignSelf="center" />}

        linemarginHorizontal={wp(2)}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
        headerText="Forword message"
        headerTextColor={colors.white}
        fontSize={wp(6)}
        fontFamily={fonts.medium}
      />

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        {isLoading ? (
          <ActivityIndicator
            color={colors.black}
            style={styles.activityIndicatorStyle}
          />
        ) : chatRooms.length == 0 ? (
          <Text style={styles.noThreadStyle}>Threads not found</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            data={chatRooms}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

export default ChatList;

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
