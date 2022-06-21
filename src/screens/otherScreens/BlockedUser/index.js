import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";

// ====================== Local Import =====================
import RNHeader from "../../../components/RNHeader";
import fonts from "../../../assets/fonts/fonts";
import { colors } from "../../../constants/colors";
import RNThreads from "../../../components/RNThreads";
import { BlockList } from "../../../httputils/httputils";

// ====================== END =================================

// =================== SVGS IMPORT ===========================

import BackArrow from "../../../assets/images/svgs/backArrow.svg";

// ====================== END =================================

const BlockedScreen = (props) => {
  const [blockList, setBlockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.authReducer.token);

  useEffect(() => {
    BlockList(token)
      .then((res) => {
        if (res.status == 1) {
          setBlockList(res.contact);
        } else {
          setBlockList([]);
        }
      })
      .catch((e) => {
        Toast.show("Request is not successful", Toast.SHORT, [
          "UIAlertController",
        ]);
        setIsLoading(false);
      });
  }, []);

  const renderItem = (item) => {
    return (
      <RNThreads
        // onPress={() => UnBlockUser()}
        image={{ uri: item.contactList.profileImg }}
        resizeMode="cover"
        imageWidth={wp(16)}
        imageHeight={wp(16)}
        imageBorderRadius={wp(16)}
        height={hp(10)}
        marginHorizontal={wp(8)}
        marginVertical={hp(2)}
        threadName={item.contactList.firstName + item.contactList.lastName}
        time={"Blocked"}
        timeWidth={wp(15)}
        marginTop={hp(3.5)}
        fontFamily={fonts.medium}
        fontSize={wp(4.5)}
        nameColor={colors.black}
        nameWidth={wp(40)}
        timeFontFamily={fonts.regular}
        timeFontSize={wp(3.3)}
        timeColor={colors.gray}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <RNHeader
        leftIcon={<BackArrow alignSelf="center" />}
        leftOnPress={() => props.navigation.goBack()}
      />
      <Text style={styles.loginTextStyle}>Blocked Contacts</Text>

      {/* ====================== White BackGround ================= */}

      <View style={styles.subContainerStyle}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.headingStyle}>Contacts you have Blocked</Text>
          <View style={styles.counterStyle}>
            <Text style={styles.counterTextStyle}>{blockList.length}</Text>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.black} />
        ) : blockList.length == 0 ? (
          <Text style={styles.noThreadStyle}>No record found</Text>
        ) : (
          <FlatList
            data={blockList}
            keyExtractor={(item, index) => item.id + index}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
          />
        )}
      </View>
    </View>
  );
};

export default BlockedScreen;

const styles = {
  mainContainer: { backgroundColor: "black", flex: 1 },
  loginTextStyle: {
    alignSelf: "center",
    fontSize: wp(7),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subContainerStyle: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: wp(12),
    borderTopRightRadius: wp(12),
    marginTop: hp(2),
    paddingTop: hp(0.3),
  },
  headingStyle: {
    color: "black",
    marginHorizontal: wp(8),
    marginVertical: hp(5),
    fontSize: wp(4.5),
    fontFamily: fonts.regular,
  },

  counterStyle: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(6),
    alignSelf: "center",
    backgroundColor: colors.loginBtnColor,
    borderWidth: 0.2,
    justifyContent: "center",
  },
  counterTextStyle: {
    alignSelf: "center",
    fontWeight: "bold",
    color: colors.black,
  },
  noThreadStyle: {
    alignSelf: "center",
    marginTop: hp(20),
    fontFamily: fonts.regular,
    color: colors.black,
  },
};
