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

import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNAvatar from "../../../components/RNAvatar";
import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
import { SignOut } from "../../../../redux/actions/authActions";
import { contactsync, getContact } from "../../../httputils/httputils";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Search from "../../../assets/images/svgs/search.svg";

// ====================== END =================================

const ContactScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const token = useSelector((state) => state.authReducer.token);
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const sectionList = useRef(null);
  const [multiUserId, setMultiUserId] = useState([]);
  const [isLongPress, setIsLongPress] = useState(false);
  const [multiUserName, setMultiUserName] = useState([]);
  const [multiUserPhone, setMultiUserPhone] = useState([]);
  const [multiUserProfile, setMultiUserProfile] = useState([]);

  useEffect(() => {
    getContacts();
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

        contacts.forEach((element) => {
          element.phoneNumbers.forEach((i) => {
            array.push(i.number);
          });
        });

        let params = {
          contacts: array,
        };
        contactsync(params, token).then((res) => {
          if (res.status == 1) {
            getContact(token).then((res) => {
              if (res.status == 1) {
                allSavedContacts.splice(0, allSavedContacts.length);
                res.contacts.map((i) => {
                  let obj = {
                    recordID: i.contactList.id,
                    familyName: i.contactList.lastName,
                    givenName: `${i.contactList.firstName} ${i.contactList.lastName}`,
                    isFavorite: false,
                    phoneNumbers: [i.contactList.phone],
                    createdAt: i.contactList.createdAt,
                    thumbnailPath: i.contactList.profileImg,
                  };
                  allSavedContacts.push(obj);
                  setAllSavedContacts(allSavedContacts);
                });
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
            {item.hasThumbnail ? (
              <Image
                source={{ uri: item.thumbnailPath }}
                style={styles.DPStyle}
              />
            ) : (
              <Text style={styles.contactNameStyle}>
                {getAvatarInitials(item.givenName)}
              </Text>
            )}
          </View>
        }
        name={item.givenName}
        data={item}
        callOnPress={() => console.log("Call Index:  ", index)}
        // msgOnPress={() => console.log("Msg Index:    ", index)}
        hasThumbnail={item.image}
        msgOnPress={() => {
          if (isLongPress) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
          } else {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile: item.thumbnailPath,
              userNumber: item.phoneNumbers,
            });
          }
        }}
        mainPress={() => {
          if (isLongPress) {
            multiUserId.push(item.recordID);
            setMultiUserId(multiUserId);
            multiUserName.push(item.givenName);
            setMultiUserName(multiUserName);
            multiUserPhone.push(item.phoneNumbers);
            setMultiUserPhone(multiUserPhone);
            multiUserProfile.push(item.thumbnailPath);
            setMultiUserProfile(multiUserProfile);
          } else {
            props.navigation.navigate("ChatRoom", {
              userName: item.givenName,
              userId: [item.recordID],
              userProfile: item.thumbnailPath,
              userNumber: item.phoneNumbers,
            });
          }
        }}
        onLongPress={() => {
          setIsLongPress(true);
          multiUserId.push(item.recordID);
          setMultiUserId(multiUserId);
          multiUserName.push(item.givenName);
          setMultiUserName(multiUserName);
          multiUserPhone.push(item.phoneNumbers);
          setMultiUserPhone(multiUserPhone);
          multiUserProfile.push(item.thumbnailPath);
          setMultiUserProfile(multiUserProfile);
        }}
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

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => dispatch(SignOut())}
        headerText="   "
        rightIcon={<Search alignSelf="center" />}
      />
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
          <SectionList
            keyExtractor={(item, index) => `${item.key}+${index}`}
            refreshing={isLoading}
            onRefresh={() => {
              loadContacts();
            }}
            renderSectionHeader={defaultSectionHeader}
            sections={sortedArray}
            renderItem={renderItems}
            showsVerticalScrollIndicator={false}
          />
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
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    alignSelf: "center",
  },
  DPcontainerStyle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(16),
    borderColor: colors.gray,
    borderWidth: 1,
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
};
