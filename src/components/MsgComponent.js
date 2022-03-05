import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Colors from '../constants/colorContants'


const MsgComponent = (props)=> {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={styles.mainContainer}
      >
        <View style={styles.container}>

          <View style={styles.containerInnerUpperView}>
            <Image style={styles.img} source={{ uri: props.image }} />

            <View style={{ paddingLeft: "5%" }}>
              <View
                style={{
                  width: wp(30),
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.titleUpperView}>{props.title}</Text>
                  <Text
                    style={{
                      width:wp(30),
                      paddingRight: "2%",
                      fontSize: 12,
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    {props.date}
                  </Text>
              </View>
              <Text style={styles.textUpperView}>{props.text}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MsgComponent;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white_dark,
    height: 100,
    width: "94%",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
  },
  container: {
    paddingLeft: "3%",
  },
  img: {
    height: 50,
    width: 50,
    resizeMode: "cover",
    paddingRight: "7%",
    borderRadius: 50,
  },
  containerInnerUpperView: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleUpperView: {
    fontSize: wp(3.7),
    fontWeight: "bold",
    width:wp(40),
  },
  textUpperView: {
    fontSize: wp(3),
    paddingTop: "2%",
    width:wp(40),
  },
  containerInnerBottomView: {
    alignItems: "center",
  },
});
