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
import Contacts from "react-native-contacts";
import { useIsFocused } from "@react-navigation/native";
import { Dialog } from "react-native-simple-dialogs";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-simple-toast";
import { now } from "moment";

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

// ====================== END =================================

const ContactScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const token = useSelector((state) => state.authReducer.token);
  const isProfile = useSelector((state) => state.authReducer.uri);
  const sortedArray = [];

  const [listData, setListData] = useState([
    {
      key: 1,

      pin: true,
    },
    {
      key: 2,

      pin: false,
    },
    {
      key: 3,
    },
    {
      key: 4,
    },
    {
      key: 5,
    },
    {
      key: 6,
    },
  ]);
  const [allSavedContacts, setAllSavedContacts] = useState([]);
  const [isContactList, setIsContactList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [multiUserId, setMultiUserId] = useState([]);
  const [isLongPress, setIsLongPress] = useState(false);
  const [multiUserName, setMultiUserName] = useState([]);
  const [multiUserPhone, setMultiUserPhone] = useState([]);
  const [multiUserProfile, setMultiUserProfile] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isRightIcon, setIsRightIcon] = useState(false);
  const [isSearch, setIsSearch] = useState(null);

  useEffect(() => {
    getContacts();
    setMultiUserId([]);
    setMultiUserName([]);
    setMultiUserPhone([]);
    setMultiUserProfile([]);
  }, [isFocused]);

  const getContacts = async () => {
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
          loadContacts();
        } else {
          console.log("Contact permission denied");
        }
      } catch (err) {
        crossOriginIsolated.log("Error", err);
      }
    }
  };

  const loadContacts = () => {
    setIsLoading(true);

    Contacts.getAll()
      .then((contacts) => {
        let array = [];
        let contactsArr = [];

        contacts.forEach((element) => {
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
        let arr = [...new Set(contactsArr)];
        let param = {
          contacts: arr,
        };
        contactsync(params, token).then((res) => {
          if (res.status == 1) {
            getContact(param, token).then((res) => {
              if (res.status == 1) {
                allSavedContacts.splice(0, allSavedContacts.length);
                res.users.map((i) => {
                  let obj = {
                    recordID: i.id,
                    familyName: i.lastName,
                    givenName: `${i.firstName} ${i.lastName}`,
                    isFavorite: false,
                    phoneNumbers: i.phone,
                    createdAt: i.createdAt,
                    thumbnailPath: i.profileImg,
                    isRegister: i.isregister,
                  };
                  allSavedContacts.push(obj);
                  setAllSavedContacts(allSavedContacts);
                });
                dispatch(ContactSave(allSavedContacts));
                setIsLoading(false);
              } else {
                setIsLoading(false);
              }
            });
          }
        });
      })
      .catch((e) => {
        setIsLoading(false);
      });

    Contacts.checkPermission();
  };

  let filteredData = [];
  filteredData = allSavedContacts.filter((data) => {
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
        selected={selectedIndex == item.recordID ? true : false}
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
        callOnPress={() =>
          Toast.showWithGravity(
            "Call feature in developement mode",
            Toast.SHORT,
            Toast.BOTTOM
          )
        }
        // msgOnPress={() => console.log("Msg Index:    ", index)}
        hasThumbnail={item.image}
        msgOnPress={() => {
          if (item.isRegister && isLongPress) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
          } else if (item.isRegister && !isLongPress) {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile: item.thumbnailPath,
              userNumber: item.phoneNumbers,
            });
          } else {
            setIsDialogVisible(true);
          }
        }}
        mainPress={() => {
          if (item.isRegister && isLongPress) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
          } else if (item.isRegister && !isLongPress) {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile: item.thumbnailPath,
              userNumber: item.phoneNumbers,
            });
          } else {
            setIsDialogVisible(true);
          }
        }}
        onLongPress={() => {
          setIsLongPress(true);
          if (item.isRegister) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
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

  return (
    <View style={styles.mainContainer}>
      {RenderModal()}
      {!isRightIcon ? (
        <RNHeader
          leftIcon={<BackArrow alignSelf="center" />}
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
        <TouchableOpacity
          style={styles.doneBtnStyle}
          onPress={() => {
            setIsLongPress(false);
            props.navigation.navigate("ChatRoom", {
              userName: "group",
              userId: multiUserId,
              userProfile: "",
              userNumber: "090078601",
            });
          }}
        >
          <Text style={styles.doneTextStyle}>Done</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.subContainerStyle}>
        <View style={{ marginTop: hp(4) }}>
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
        </View>

        <View style={{ marginTop: hp(4), flex: 0.85 }}>
          {isLoading ? (
            <ActivityIndicator
              color={colors.black}
              style={styles.activityIndicatorStyle}
            />
          ) : sortedArray.length == 0 ? (
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
                isSearch == null || isSearch == "" ? sortedArray : isContactList
              }
              renderItem={renderItems}
              showsVerticalScrollIndicator={false}
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
    marginRight: wp(10),
    width: wp(12),
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
};
