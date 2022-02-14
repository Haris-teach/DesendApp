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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../assets/colors/colors";
import RNAvatar from "../../../components/RNAvatar";
import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
import { logoutFun } from "../../../redux/Action/authAction";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Search from "../../../assets/images/svgs/search.svg";

// ====================== END =================================

const ContactScreen = () => {
  const dispatch = useDispatch();

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
  const [allSavedContacts, setAllSavedContacts] = useState([
    {
      company: "",
      emailAddresses: [],
      familyName: "Crystal",
      givenName: "Stephen",
      hasThumbnail: false,
      imAddresses: [],
      isFavorite: false,
      jobTitle: "",
      middleName: "",
      phoneNumbers: [[Object]],
      postalAddresses: [],
      recordID: "E1437A77-9BE0-436D-9C84-EBFB6875A2B5:ABPerson",
      thumbnailPath: "",
      urlAddresses: [],
    },
    {
      company: "",
      emailAddresses: [],
      familyName: "Durrani",
      givenName: "Zeeshan",
      hasThumbnail: false,
      imAddresses: [],
      isFavorite: false,
      jobTitle: "",
      middleName: "",
      phoneNumbers: [[Object]],
      postalAddresses: [],
      recordID: "4B973727-C44F-40D3-B5D9-D92DB7B01E41:ABPerson",
      thumbnailPath: "",
      urlAddresses: [],
    },
    {
      company: "",
      emailAddresses: [],
      familyName: "",
      givenName: "Nick Athanassiadis (Otman)",
      hasThumbnail: false,
      imAddresses: [],
      isFavorite: false,
      jobTitle: "",
      middleName: "",
      phoneNumbers: [[Object]],
      postalAddresses: [],
      recordID: "A6F4795F-03F1-4FA6-9A3B-D3E1F1B268D8:ABPerson",
      thumbnailPath: "",
      urlAddresses: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const sectionList = useRef(null);

  useEffect(() => {
    Contacts.iosEnableNotesUsage(false);
    if (Platform.OS === "android") {
      const granted = PermissionsAndroid.request(
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
        console.log("Contact permission Accpet");
      } else {
        console.log("Contact permission denied");
      }
    }
  }, []);

  const loadContacts = () => {
    Contacts.getAll()
      .then((contacts) => {
        setIsLoading(false);

        setAllSavedContacts([...contacts]);
      })
      .catch((e) => {
        setIsLoading(false);
      });

    Contacts.getCount().then((count) => {
      console.log("Count:   ", count);
    });

    Contacts.checkPermission();
  };
  const sortedArray = [];

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

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log("Logout from google:");
      dispatch(logoutFun()); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

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
        msgOnPress={() => console.log("Msg Index:    ", index)}
        hasThumbnail={item.image}
        mainPress={() => signOut()}
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
        leftOnPress={() => props.navigation.goBack()}
        headerText="   "
        rightIcon={<Search alignSelf="center" />}
      />
      <Text style={styles.loginTextStyle}>Contacts</Text>

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

        <View style={{ marginTop: hp(4), flex: 0.9 }}>
          <SectionList
            keyExtractor={(item, index) => `${item.key}+${index}`}
            refreshing={isLoading}
            onRefresh={() => loadContacts()}
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
};
