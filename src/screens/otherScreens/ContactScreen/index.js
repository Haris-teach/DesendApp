import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
  TextInput,
  SectionList,
  PermissionsAndroid,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import DocumentPicker from "react-native-document-picker";
import Contacts from "react-native-contacts";
import { useIsFocused } from "@react-navigation/native";
import { Dialog } from "react-native-simple-dialogs";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-simple-toast";
import firestore from "@react-native-firebase/firestore";

import RNTextInput from "../../../components/RNTextInput";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNAvatar from "../../../components/RNAvatar";
import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
import { SignOut } from "../../../../redux/actions/authActions";
import { contactsync, getContact } from "../../../httputils/httputils";
import { ContactSave } from "../../../../redux/actions/authActions";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Search from "../../../assets/images/svgs/search.svg";
import Pen from "../../../assets/images/svgs/pen.svg";

// ====================== END =================================

var filteredData = [];
var sortedArray = [];

const ContactScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const token = useSelector((state) => state.authReducer.token);
  const Profile = useSelector((state) => state.authReducer.uri);
  const block = useSelector((state) => state.authReducer.blockArray);
  const currentUserId = useSelector((state) => state.authReducer.id);

  const [allSavedContacts, setAllSavedContacts] = useState([]);
  const [isContactList, setIsContactList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  var counter = 0;
  const [multiUserId, setMultiUserId] = useState([]);
  const [isLongPress, setIsLongPress] = useState(false);
  const [multiUserName, setMultiUserName] = useState([]);
  const [multiUserPhone, setMultiUserPhone] = useState([]);
  const [multiUserProfile, setMultiUserProfile] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isRightIcon, setIsRightIcon] = useState(false);
  const [isSearch, setIsSearch] = useState(null);
  const [isPage, setISPage] = useState(1);
  const [isListData, setIsListData] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isProfile, setIsProfile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isChatIds, setIsChatIds] = useState([]);

  useEffect(() => {
    getContacts(1);
    setIsListData([]);
    setMultiUserId([currentUserId]);
    setMultiUserName([]);
    setMultiUserPhone([]);
    setMultiUserProfile([]);
    setIsLongPress(false);
    setAllSavedContacts([]);
    setIsListData([]);
    sortedArray = [];
  }, [isFocused]);
  useEffect(() => {
    firestore()
      .collection("chats")
      .get()
      .then((res) => {
        if (res.docs != null || res.docs != undefined) {
          res.docs.forEach((i) => {
            isChatIds.push(i.id);
            setIsChatIds(isChatIds);
          });
        }
      });
  }, []);

  const getContacts = async (value) => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contacts",
            message: "Desend want to access your contacts to send invites",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadContacts(value);
        } else {
          Toast.showWithGravity(
            "Contact permission denied",
            Toast.SHORT,
            Toast.BOTTOM
          );
        }
      } catch (err) {
        crossOriginIsolated.log("Error", err);
      }
    } else {
      loadContacts(value);
    }
  };

  const loadContacts = (value) => {
    setIsLoading(true);
    isListData.splice(0, isListData.length);
    allSavedContacts.splice(0, allSavedContacts.length);
    Contacts.getAll()
      .then((contacts) => {
        let array = [];
        let contactsArr = [];

        let filterContact = [...new Set(contacts)];

        filterContact.forEach((element) => {
          element.phoneNumbers.forEach((i) => {
            array.push(i.number);
          });
          if (element.phoneNumbers.length != 0) {
            contactsArr.push(element);
          }
        });

        let params = {
          contacts: array,
        };

        let param = {
          contacts: contactsArr,
          // page: value,
        };

        contactsync(params, token)
          .then((res) => {
            if (res.status == 1) {
              getContact(param, token).then((res) => {
                if (res.status == 1) {
                  res.users.map((i) => {
                    let obj = {
                      recordID: i.id,
                      familyName: i.lastName,
                      givenName: `${i.firstName} ${i.lastName}`,
                      isSelected: false,
                      phoneNumbers: i.phone,
                      createdAt: i.createdAt,
                      thumbnailPath: i.profileImg,
                      isRegister: i.isregister,
                    };

                    allSavedContacts.push(obj);
                    setAllSavedContacts(allSavedContacts);
                  });

                  filteredData = allSavedContacts.filter((data) => {
                    return data?.givenName
                      .toLowerCase()
                      .includes(searchState.toLowerCase());
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
                  setIsListData(sortedArray);
                  dispatch(ContactSave(allSavedContacts));
                  setIsLoading(false);
                } else {
                  setIsLoading(false);
                }
              });
            } else {
              setIsLoading(false);
            }
          })
          .catch((e) => {
            setIsLoading(false);
          });
      })
      .catch((e) => {
        setIsLoading(false);
      });

    Contacts.checkPermission();
  };

  const renderItems = ({ item }) => {
    return (
      <ContactCardComponent
        selected={selectedIndex == item.recordID ? true : false}
        bgColor={item.isSelected ? "rgba(5, 8, 17, 0.06)" : colors.bWhite}
        image={
          <View style={styles.DPcontainerStyle}>
            {item.thumbnailPath == "" ? (
              <Image
                source={require("../../../assets/images/pngs/profile1.png")}
                style={styles.DPStyle}
              />
            ) : (
              <Image
                source={{
                  uri: item.thumbnailPath,
                }}
                style={styles.DPStyle}
              />
            )}
          </View>
        }
        name={item.givenName}
        data={item}
        callOnPress={() =>
          Toast.showWithGravity(
            "Call feature in developement mode",
            Toast.SHORT,
            Toast.BOTTOM
          )
        }
        hasThumbnail={item.image}
        msgOnPress={() => {
          if (item.isRegister && isLongPress) {
            selectedItems(item);
          } else if (item.isRegister && !isLongPress) {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile:
                item.thumbnailPath == ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  : item.thumbnailPath,
              userNumber: item.phoneNumbers,
              exists: false,
              blockTo: [],
              leave: [],
            });
          } else {
            setIsDialogVisible(true);
          }
        }}
        mainPress={() => {
          if (item.isRegister && isLongPress) {
            selectedItems(item);
          } else if (item.isRegister && !isLongPress) {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile:
                item.thumbnailPath == ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  : item.thumbnailPath,
              userNumber: item.phoneNumbers,
              exists: false,
              blockTo: [],
              leave: [],
            });
          } else {
            setIsDialogVisible(true);
          }
        }}
        onLongPress={() => {
          if (item.isRegister) {
            selectedItems(item);
            setIsLongPress(true);
          } else {
            setIsDialogVisible(true);
          }
        }}
        isIcons={true}
      />
    );
  };

  const getAvatarInitials = (textString) => {
    if (!textString) return "";
    const text = textString.trim();
    const textSplit = text.split(" ");
    if (textSplit.length <= 1) return text.charAt(0);
    const initials =
      textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    return initials;
  };

  var defaultSectionHeader = function (_a) {
    var section = _a.section;
    return <Text style={styles.sectionHeaderStyle}>{section.title}</Text>;
  };

  const RenderModal = () => {
    return (
      <Dialog
        visible={isDialogVisible}
        title="User not register "
        onTouchOutside={() => setIsDialogVisible(false)}
        dialogStyle={{ borderRadius: wp(4) }}
      >
        <Text style={{ color: colors.black }}>Send invite message</Text>
        <View style={styles.dialogBtnContainerStyle}>
          <TouchableOpacity
            style={[
              styles.dialogBtnStyle,
              { backgroundColor: colors.fieldsColor },
            ]}
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={{ alignSelf: "center" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dialogBtnStyle,
              { backgroundColor: colors.loginBtnColor },
            ]}
          >
            <Text style={{ alignSelf: "center" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  // Search Function

  const ContactSearch = () => {
    if (isSearch != null) {
      let term = isSearch.toLowerCase();
      let obj = sortedArray.filter(
        (item) => item.data[0].givenName.toLowerCase().indexOf(term) > -1
      );
      setIsContactList(obj);
    }
  };

  const LoadMoreData = () => {
    setISPage(isPage + 1);
    getContacts(isPage + 1);
  };

  const selectedItems = (item) => {
    let localArray = [];
    let newArray = isListData;

    newArray.map((i) => {
      let temp = i.data.map((j) => {
        if (j.recordID == item.recordID) {
          if (!j.isSelected) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
            return {
              ...j,
              isSelected: true,
            };
          } else {
            let userId = multiUserId.filter((e) => e != item.recordID);
            setMultiUserId(userId);

            let multiName = multiUserName.filter((e) => e != item.givenName);
            setMultiUserName(multiName);
            let multiPhone = multiUserPhone.filter(
              (e) => e != item.phoneNumbers
            );
            setMultiUserPhone(multiPhone);
            let multiProfile = multiUserProfile.filter(
              (e) => e != item.thumbnailPath
            );
            setMultiUserProfile(multiProfile);
            return {
              ...j,
              isSelected: false,
            };
          }
        }
        return {
          ...j,
        };
      });

      let obj = {
        key: i.key,
        title: i.title,
        data: temp,
      };
      localArray.push(obj);
    });
    setIsListData(localArray);
  };

  const PicImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        presentationStyle: "fullScreen",
      });

      setIsProfile({
        name: res[0].name,
        uri: res[0].uri,
        type: res[0].type,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and mo
        Toast.showWithGravity(
          "Picture is not select",
          Toast.SHORT,
          Toast.BOTTOM
        );
        Toast;
      }
    }
  };

  const CreateGroup = () => (
    <Dialog
      visible={isModalShow}
      onTouchOutside={() => setIsModalShow(false)}
      title="Group Name"
      dialogStyle={{ borderRadius: wp(4) }}
    >
      <RNTextInput
        height={hp(6)}
        width={wp(76)}
        marginLeft={wp(5)}
        borderRadius={wp(3)}
        placeholder="Enter your group name"
        onChangeText={(text) => setGroupName(text)}
        placeholderTextColor={colors.lightBlack}
        fontFamily={fonts.regular}
        fontSize={wp(4)}
        editable={true}
        backgroundColor={colors.fieldsColor}
        maxLength={10}
      />

      {/* <Text
        style={{
          marginTop: hp(2),
          color: colors.black,
          fontSize: wp(4),
          fontFamily: fonts.regular,
        }}
      >
        Select group profile picture:
      </Text>

      <View style={{ alignSelf: "center" }}>
        {isProfile == null ? (
          <Image
            source={require("../../../assets/images/pngs/profile1.png")}
            style={styles.DpStyle}
          />
        ) : (
          <Image
            source={{
              uri: isProfile.uri,
            }}
            style={styles.DpStyle}
          />
        )}

        <TouchableOpacity
          style={{
            backgroundColor: colors.black,
            alignSelf: "flex-end",
            justifyContent: "center",
            width: wp(8),
            height: wp(8),
            borderRadius: wp(8),
            marginTop: hp(-2.5),
          }}
          onPress={() => PicImage()}
        >
          <Pen alignSelf="center" />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity
        style={{
          height: hp(5),
          backgroundColor: colors.floatBtnColor,
          borderRadius: wp(2),
          justifyContent: "center",
          marginTop: hp(3),
        }}
        onPress={() => {
          if (
            multiUserId.length != 0 &&
            multiUserId.length > 2 &&
            !isChatIds.includes(groupName)
          ) {
            setIsLongPress(false);
            setIsModalShow(false);
            props.navigation.navigate("ChatRoom", {
              userName: groupName,
              userId: multiUserId,
              userProfile:
                "https://img.favpng.com/25/7/19/users-group-computer-icons-png-favpng-WKWD9rqs5kwcviNe9am7xgiPx.jpg",
              userNumber: "",
              adminId: currentUserId,
              isGroup: true,
              blockTo: [],
              leave: [],
            });
          } else {
            if (multiUserId.length < 3) {
              Toast.showWithGravity(
                "Select atleast 2 members",
                Toast.SHORT,
                Toast.BOTTOM
              );
            } else {
              Toast.showWithGravity(
                "Group name already exist",
                Toast.SHORT,
                Toast.BOTTOM
              );
            }
          }
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: wp(4),
            fontFamily: fonts.regular,
            alignSelf: "center",
          }}
        >
          Create Group
        </Text>
      </TouchableOpacity>
    </Dialog>
  );

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      {CreateGroup()}
      {!isRightIcon ? (
        <RNHeader
          // leftIcon={<BackArrow alignSelf="center" />}
          //leftOnPress={() => dispatch(SignOut())}
          headerText="   "
          rightIcon={<Search alignSelf="center" />}
          rightOnPress={() => setIsRightIcon(true)}
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
              backgroundColor: colors.bWhite,
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
            <Search alignSelf="center" marginRight={wp(2)} />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.loginTextStyle}>Contacts</Text>
      {isLongPress ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={styles.doneBtnStyle}
            onPress={() => {
              setIsLongPress(false);
              setIsListData(sortedArray);
              setMultiUserId([]);
              setMultiUserName([]);
              setMultiUserPhone([]);
            }}
          >
            <Text style={styles.doneTextStyle}>cancle</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontFamily: fonts.medium,
              fontSize: wp(4),
            }}
          >
            {multiUserId.length - 1}
          </Text>
          <TouchableOpacity
            style={styles.doneBtnStyle}
            onPress={() => {
              setIsModalShow(true);
            }}
          >
            <Text style={styles.doneTextStyle}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.subContainerStyle}>
        {/* <View style={{ marginTop: hp(4) }}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            data={listData}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => {
              return (
                <RNAvatar
                  width={wp(17)}
                  height={wp(17)}
                  borderRadius={wp(17)}
                  viewWidth={wp(19)}
                  viewHeight={wp(19)}
                  viewBorderRadius={wp(19)}
                  borderColor={colors.avatarBorderColor}
                  marginHorizontal={wp(3)}
                  source={require("../../../assets/images/pngs/splash.png")}
                  resizeMode="cover"
                  borderWidth={wp(0.7)}
                  justifyContent="center"
                  // count={item.count}
                  textWidth={wp(4)}
                  textHeight={wp(4)}
                  textBorderRadius={wp(4)}
                  fontSize={wp(2)}
                  backgroundColor={colors.avatarBorderColor}
                  textMarginLeft={wp(-4)}
                  textBorderColor={colors.white}
                  textBorderWidth={wp(0.5)}
                  countColor={colors.black}
                />
              );
            }}
          />
        </View> */}

        <View style={{ marginTop: hp(4), flex: 0.85 }}>
          {isLoading ? (
            <ActivityIndicator
              color={colors.black}
              style={styles.activityIndicatorStyle}
            />
          ) : isListData.length == 0 ? (
            <Text style={styles.noThreadStyle}>No record found</Text>
          ) : (
            <SectionList
              keyExtractor={(item, index) => `${item.key}+${index}`}
              refreshing={isLoading}
              onRefresh={() => {
                loadContacts();
              }}
              renderSectionHeader={defaultSectionHeader}
              sections={
                isSearch == null || isSearch == "" ? isListData : isContactList
              }
              renderItem={renderItems}
              showsVerticalScrollIndicator={false}
              // onEndReachedThreshold={0}
              // onEndReached={() => LoadMoreData()}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ContactScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(7.5),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subContainerStyle: {
    backgroundColor: colors.bWhite,
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  DPStyle: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15),
    alignSelf: "center",
  },
  DPcontainerStyle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    borderColor: colors.gray,
    borderWidth: 0.2,
    justifyContent: "center",
  },
  contactNameStyle: {
    color: colors.black,
    alignSelf: "center",
    fontSize: wp(4.5),
    fontFamily: fonts.medium,
  },
  sectionHeaderStyle: {
    textAlignVertical: "center",
    fontSize: wp(5),
    color: "#C0C1C3",
    fontWeight: "600",
    marginHorizontal: wp(6),
    marginLeft: wp(12),
    marginVertical: hp(1),
    fontFamily: fonts.medium,
  },
  doneBtnStyle: {
    backgroundColor: colors.bWhite,
    alignSelf: "flex-end",

    width: wp(15),
    height: hp(4),
    justifyContent: "center",
    borderRadius: wp(2),
  },
  doneTextStyle: {
    color: colors.black,
    fontWeight: "bold",
    alignSelf: "center",
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
  dialogBtnStyle: {
    width: wp(30),
    height: hp(5),
    justifyContent: "center",
    borderRadius: wp(2),
  },
  dialogBtnContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(3),
  },
  DpStyle: {
    width: wp(50),
    height: hp(25),
    marginTop: hp(2),
    borderRadius: wp(5),
  },
};
