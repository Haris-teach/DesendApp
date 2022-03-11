import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SectionList,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useSelector, useDispatch } from "react-redux";

// ====================== Local Import =======================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";

import ContactCardComponent from "../../../components/ContactCardComponent/ContactCardComponent";
import alphabets from "../../../components/alphabets";
import { SignOut } from "../../../../redux/actions/authActions";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";
import Search from "../../../assets/images/svgs/search.svg";

// ====================== END =================================

const ContactListScreen = (props) => {
  const dispatch = useDispatch();

  const contactsList = useSelector((state) => state.authReducer.contactsList);
  const token = useSelector((state) => state.authReducer.token);

  const sortedArray = [];

  const [isLoading, setIsLoading] = useState(false);
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
        mainPress={() =>
          props.navigation.navigate("ChatRoom", { number: "0999" })
        }
        isIcon={false}
      />
    );
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

      <View style={styles.subContainerStyle}>
        <View style={{ marginTop: hp(4), flex: 0.85 }}>
          {isLoading ? (
            <ActivityIndicator
              color={colors.black}
              style={styles.activityIndicatorStyle}
            />
          ) : sortedArray.length == 0 ? (
            <Text style={styles.noThreadStyle}>Contacts not found</Text>
          ) : (
            <SectionList
              keyExtractor={(item, index) => `${item.key}+${index}`}
              renderSectionHeader={defaultSectionHeader}
              sections={sortedArray}
              renderItem={renderItems}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ContactListScreen;

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
