import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================

import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNThreads from "../../../components/RNThreads";
import { createChatId } from "../../../utils/helper";
import firestore from "@react-native-firebase/firestore";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import RightArrow from "../../../assets/images/svgs/rightArrow.svg";
import DeleteBtn from "../../../assets/images/svgs/delete.svg";
import Add from "../../../assets/images/svgs/add.svg";

// ====================== END =================================

const GroupManagement = (props) => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.authReducer.contactsList);
  const profileUri = useSelector((state) => state.authReducer.uri);
  const firstName = useSelector((state) => state.authReducer.firstName);
  const lastName = useSelector((state) => state.authReducer.lastName);
  const phone = useSelector((state) => state.authReducer.isPhone);
  const currentUserId = useSelector((state) => state.authReducer.id);

  const [members, setMembers] = useState(props.route.params.array);
  const chatId = props.route.params.chatId;
  const adminId = props.route.params.adminId;

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addMember, setAddMember] = useState(null);
  const [removeMember, setRemoveMember] = useState(null);

  var isMembers = [
    {
      givenName: `${firstName + " " + lastName}`,
      phoneNumbers: phone,
      recordID: currentUserId,
      thumbnailPath: profileUri,
    },
  ];

  var addPartcipent = [];

  for (let index = 0; index < contacts.length; index++) {
    if (contacts[index].recordID != null) {
      if (members.includes(contacts[index].recordID)) {
        isMembers.push(contacts[index]);
      } else {
        if (contacts[index].isRegister) {
          addPartcipent.push(contacts[index]);
        }
      }
    }
  }

  const renderItem = ({ item }) => {
    return (
      <RNThreads
        MBackgroundColor={colors.bWhite}
        image={{
          uri:
            item.thumbnailPath == ""
              ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              : item.thumbnailPath,
        }}
        //time="admin"
        msg={item.phoneNumbers}
        resizeMode="cover"
        imageWidth={wp(13)}
        imageHeight={wp(13)}
        imageBorderRadius={wp(13)}
        height={hp(7)}
        marginHorizontal={wp(8)}
        marginVertical={hp(0)}
        threadName={item.givenName}
        fontFamily={fonts.medium}
        fontSize={wp(3.5)}
        nameColor={colors.black}
        nameWidth={wp(40)}
        msgWidth={wp(40)}
        msgFontFamily={fonts.regular}
        msgFontSize={wp(3.5)}
        msgColor={colors.gray}
        linemarginHorizontal={wp(2)}
        time={adminId == item.recordID ? "admin" : ""}
        timeFontFamily={fonts.bold}
        timeFontSize={wp(3)}
        timeColor={colors.lightBlack}
        icon={
          adminId == currentUserId || item.recordID == currentUserId ? (
            <TouchableOpacity
              style={{ width: wp(10), height: hp(5) }}
              onPress={() => {
                setRemoveMember(item.recordID);
                MemberLeave(item);
              }}
            >
              {isLoading && removeMember == item.recordID ? (
                <ActivityIndicator color="black" alignSelf="center" />
              ) : (
                <DeleteBtn width={wp(5)} height={hp(3)} alignSelf="center" />
              )}
            </TouchableOpacity>
          ) : null
        }
      />
    );
  };

  const ItemRender = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: wp(7),
          marginVertical: hp(1.4),
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            source={{
              uri:
                item.thumbnailPath == ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  : item.thumbnailPath,
            }}
            style={{ width: wp(13), height: wp(13), borderRadius: wp(13) }}
          />
          <View style={{ flex: 1, marginLeft: wp(6.5) }}>
            <Text style={{ fontFamily: fonts.medium, color: colors.black }}>
              {item.givenName}
            </Text>
            <Text>{item.phoneNumbers}</Text>
          </View>
        </View>
        {adminId == currentUserId ? (
          <TouchableOpacity
            style={{ marginRight: wp(5) }}
            onPress={() => {
              MemberAdded(item);
              setAddMember(item.recordID);
            }}
          >
            {loading && addMember == item.recordID ? (
              <ActivityIndicator
                color="black"
                alignSelf="center"
                marginRight={wp(-3)}
              />
            ) : (
              <Add alignSelf="center" marginRight={wp(-3)} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const MemberAdded = async (data) => {
    setLoading(true);
    firestore()
      .collection("chats")
      .doc(chatId)
      .get()
      .then((res) => {
        var { visibleTo, deleteTo, members, admin } = res.data();
        if (admin == currentUserId) {
          setLoading(false);
          firestore()
            .collection("chats")
            .doc(chatId)
            .update({
              visibleTo: [
                ...new Set([...visibleTo, ...[parseInt(data.recordID)]]),
              ],
              members: [...new Set([...members, ...[parseInt(data.recordID)]])],
              deleteTo: [
                ...new Set([...deleteTo, ...[parseInt(data.recordID)]]),
              ],
              chatId: chatId,
            });
          setMembers([
            ...new Set([...visibleTo, ...[parseInt(data.recordID)]]),
          ]).then(() => {
            setLoading(false);
          });
        } else {
          setLoading(false);
          Toast.showWithGravity(
            "Only admin has access for add member",
            Toast.SHORT,
            Toast.BOTTOM
          );
        }
      });
  };

  const MemberLeave = (i) => {
    setIsLoading(true);
    firestore()
      .collection("chats")
      .doc(chatId)
      .get()
      .then((res) => {
        var { visibleTo, deleteTo, members, admin } = res.data();
        const visible = visibleTo.filter((item) => item != i.recordID);
        const isDelete = deleteTo.filter((item) => item != i.recordID);
        const persons = members.filter((item) => item != i.recordID);
        if (admin == currentUserId || currentUserId == i.recordID) {
          if (admin == currentUserId && currentUserId == i.recordID) {
            createTwoButtonAlert();
          } else {
            firestore()
              .collection("chats")
              .doc(chatId)
              .update({
                visibleTo: visible,
                members: isDelete,
                deleteTo: persons,
                chatId: chatId,
              })
              .then(() => {
                setIsLoading(false);
                setMembers(visible);
                if (currentUserId == i.recordID) {
                  Toast.showWithGravity(
                    "you leave this group",
                    Toast.SHORT,
                    Toast.BOTTOM
                  );
                  props.navigation.navigate("Home", { screen: "Message" });
                }
              });
          }
        } else {
          setIsLoading(false);
          Toast.showWithGravity(
            "Only admin has access for remove member",
            Toast.SHORT,
            Toast.BOTTOM
          );
        }
      });
  };

  const DeleteGroup = () => {
    firestore()
      .collection("chats")
      .doc(chatId)
      .get()
      .then((res) => {
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
            firestore()
              .collection("chats")
              .doc(chatId)
              .delete()
              .then(() => {
                setIsLoading(false);
                props.navigation.navigate("Home", { screen: "Message" });
              });
          });
      });
  };

  const createTwoButtonAlert = () =>
    Alert.alert("Delete Group", "You delete this group from all members", [
      {
        text: "Cancel",
        onPress: () => setIsLoading(false),
        style: "cancel",
      },
      { text: "OK", onPress: () => DeleteGroup() },
    ]);

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() =>
          props.navigation.replace("Home", { screen: "Message" })
        }
        headerText="   "
      />

      <Text style={styles.loginTextStyle}>Group Management</Text>
      <View style={styles.subContainerStyle}>
        <ScrollView>
          <Text style={styles.titleStyle}>Members</Text>
          <View style={{ maxHeight: hp(30) }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={isMembers}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
              nestedScrollEnabled={true}
            />
          </View>

          <Text style={styles.titleStyle}>Add Member</Text>

          <View style={{ maxHeight: hp(30) }}>
            {addPartcipent.length == 0 ? (
              <Text style={{ alignSelf: "center", marginVertical: hp(5) }}>
                Pending message
              </Text>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={addPartcipent}
                keyExtractor={(item, index) => index}
                renderItem={ItemRender}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GroupManagement;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(6),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    padding: wp(2),
  },
  titleStyle: {
    color: "black",
    marginHorizontal: wp(8),
    fontFamily: fonts.bold,
    marginVertical: hp(2),
  },
};
