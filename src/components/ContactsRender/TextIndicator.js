import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
var styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  box: {
    width: 60,
    height: 60,
    opacity: 0.6,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 32,
  },
});
var TextIndicator = function (_a) {
  var isShow = _a.isShow,
    style = _a.style,
    text = _a.text;
  return isShow && text != "" ? (
    <View style={[styles.center, style, { zIndex: 9999 }]} collapsable={false}>
      <View style={styles.box}>
        {isShow && <Text style={styles.content}>{text}</Text>}
      </View>
    </View>
  ) : null;
};
export default memo(TextIndicator);
//# sourceMappingURL=TextIndicator.js.map
