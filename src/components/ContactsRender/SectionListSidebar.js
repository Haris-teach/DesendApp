var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  PanResponder,
  PixelRatio,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SectionListGetItemLayout from "react-native-section-list-get-item-layout";
import fonts from "../../assets/fonts/fonts";

import TextIndicator from "./TextIndicator";
var styles = StyleSheet.create({
  container: {
    flex: 1,
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
  sidebarItemContainerStyle: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    color: "#017BFF",
    marginTop: hp(1),
    //backgroundColor: '#f5f5f5',
  },
  sidebarItemTextStyle: {
    fontSize: wp(2.8),
    fontWeight: "bold",
    // color: "#222",
    color: "#017BFF",
    justifyContent: "center",
    textAlignVertical: "center",
    // marginTop: hp(-0.3),
    paddingLeft: 5,
  },
  sidebarItemStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
var fadeInDuration = 200;
var fadeOutDuration = 200;
var duration = 1000;
var SectionListSidebar = function (_a, ref) {
  var _b = _a.rtl,
    rtl = _b === void 0 ? false : _b,
    _c = _a.locale,
    locale = _c === void 0 ? "en" : _c,
    _d = _a.sectionHeaderHeight,
    sectionHeaderHeight = _d === void 0 ? 30 : _d,
    _e = _a.itemHeight,
    itemHeight = _e === void 0 ? 30 : _e,
    _f = _a.footerHeaderHeight,
    footerHeaderHeight = _f === void 0 ? 0 : _f,
    _g = _a.separatorHeight,
    separatorHeight = _g === void 0 ? 0 : _g,
    _h = _a.listHeaderHeight,
    listHeaderHeight = _h === void 0 ? 0 : _h,
    _j = _a.renderSectionHeader,
    renderSectionHeader = _j === void 0 ? undefined : _j,
    _k = _a.renderSidebarItem,
    renderSidebarItem = _k === void 0 ? undefined : _k,
    containerStyle = _a.containerStyle,
    sectionHeaderStyle = _a.sectionHeaderStyle,
    sidebarContainerStyle = _a.sidebarContainerStyle,
    sidebarItemStyle = _a.sidebarItemStyle,
    sidebarItemTextStyle = _a.sidebarItemTextStyle,
    data = _a.data,
    _l = _a.selectedText,
    selectedText = _l === void 0 ? "" : _l,
    isSelectedShow = _a.isSelectedShow,
    _m = _a.maxSidebarText,
    maxSidebarText = _m === void 0 ? 20 : _m,
    props = __rest(_a, [
      "rtl",
      "locale",
      "sectionHeaderHeight",
      "itemHeight",
      "footerHeaderHeight",
      "separatorHeight",
      "listHeaderHeight",
      "renderSectionHeader",
      "renderSidebarItem",
      "containerStyle",
      "sectionHeaderStyle",
      "sidebarContainerStyle",
      "sidebarItemStyle",
      "sidebarItemTextStyle",
      "data",
      "selectedText",
      "isSelectedShow",
      "maxSidebarText",
    ]);
  var _o = useState(false),
    isShow = _o[0],
    setIsShow = _o[1];
  var _p = useState(""),
    indicatorText = _p[0],
    setIndicatorText = _p[1];
  var sidebarRef = useRef();
  var _q = useState(false),
    visibleSidebar = _q[0],
    setVisibleSidebar = _q[1];

  var _r = useState(0),
    sidebarItemHeight = _r[0],
    setSidebarItemHeight = _r[1];
  var timerRef = useRef();
  var sidebarOpacity = useRef(new Animated.Value(0)).current;
  var _s = useState([
      { key: "A" },
      { key: "B" },
      { key: "C" },
      { key: "D" },
      { key: "E" },
      { key: "F" },
      { key: "G" },
      { key: "H" },
      { key: "I" },
      { key: "J" },
      { key: "K" },
      { key: "L" },
      { key: "M" },
      { key: "N" },
      { key: "O" },
      { key: "P" },
      { key: "Q" },
      { key: "R" },
      { key: "S" },
      { key: "T" },
      { key: "U" },
      { key: "V" },
      { key: "W" },
      { key: "X" },
      { key: "Y" },
      { key: "Z" },
      { key: "#" },
    ]),
    defaultSidebarData = _s[0],
    setDefaultSidebarData = _s[1];
  var onLayout = useCallback(
    function (event) {
      var height = event.nativeEvent.layout.height;
      setSidebarItemHeight(height * (0.95 / defaultSidebarData.length));
    },
    [defaultSidebarData]
  );
  var close = useCallback(
    function () {
      Animated.timing(sidebarOpacity, {
        delay: 0,
        toValue: 0,
        easing: Easing.out(Easing.ease),
        duration: fadeOutDuration,
        useNativeDriver: false,
      }).start(function () {
        setVisibleSidebar(false);
      });
    },
    [sidebarOpacity]
  );
  var show = useCallback(
    function () {
      setVisibleSidebar(true);
      Animated.timing(sidebarOpacity, {
        delay: 0,
        toValue: 0.7,
        easing: Easing.out(Easing.ease),
        duration: fadeInDuration,
        useNativeDriver: false,
      }).start(function () {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(function () {
          close();
        }, duration);
      });
    },
    [sidebarOpacity]
  );
  var sectionKeyExtract = function (item, index) {
    return item + index;
  };
  var getItemLayout = SectionListGetItemLayout({
    getItemHeight: function (rowData, sectionIndex, rowIndex) {
      return itemHeight;
    },
    getSectionHeaderHeight: function () {
      return sectionHeaderHeight;
    },
    getSectionFooterHeight: function () {
      return footerHeaderHeight;
    },
    getSeparatorHeight: function () {
      return separatorHeight / PixelRatio.get();
    },
    listHeaderHeight: function () {
      return listHeaderHeight;
    },
  });
  var defaultSectionHeader = function (_a) {
    var section = _a.section;
    return (
      <Text style={[styles.sectionHeaderStyle, sectionHeaderStyle]}>
        {section.title}
      </Text>
    );
  };
  var setTargetIndexList = function (input) {
    var targetIndexList = defaultSidebarData
      .map(function (item) {
        return input.indexOf(item.key);
      })
      .map(function (item, index, array) {
        if (item === -1) {
          for (var i = index; i <= array.length; i++) {
            if (array[i] === undefined) continue;
            if (array[i] !== -1) {
              return array[i];
            }
          }
          return input.length;
        }
        return item;
      });
    return targetIndexList;
  };
  var panResponder = useMemo(
    function () {
      var index = 0;
      var targetList = setTargetIndexList(
        data.map(function (item) {
          return item.key;
        })
      );
      return PanResponder.create({
        onMoveShouldSetPanResponder: function () {
          return true;
        },
        onPanResponderGrant: function () {
          setIsShow(true);
        },
        onPanResponderMove: function (event, _a) {
          var _b;
          var dx = _a.dx,
            dy = _a.dy,
            x0 = _a.x0,
            y0 = _a.y0,
            vx = _a.vx,
            vy = _a.vy,
            moveX = _a.moveX,
            moveY = _a.moveY;
          show();
          (_b = sidebarRef.current) === null || _b === void 0
            ? void 0
            : _b.measure(function (fx, fy, width, height, px, py) {
                index = Math.floor((moveY - py) / sidebarItemHeight);
                if (0 <= index && index < defaultSidebarData.length) {
                  setIndicatorText(defaultSidebarData[index].key);
                  jumpToSection(targetList[index], 0);
                }
                try {
                } catch (e) {
                  console.log("move Error : ", e);
                }
              });
          return false;
        },
        onPanResponderEnd: function () {
          setIsShow(false);
          setIndicatorText("");
        },
      });
    },
    [sidebarItemHeight]
  );
  var jumpToSection = useCallback(
    function (sectionIndex, itemIndex) {
      if (itemIndex === void 0) {
        itemIndex = 0;
      }
      try {
        ref.current.scrollToLocation({
          sectionIndex: sectionIndex,
          itemIndex: itemIndex,
        });
      } catch (e) {}
    },
    [ref]
  );
  var renderDefaultSidebarItem = useCallback(
    function (_a) {
      var item = _a.item,
        index = _a.index;
      return (
        <View key={item}>
          <TouchableOpacity
            pressRetentionOffset={{ bottom: 8, left: 8, right: 8, top: 8 }}
            hitSlop={{ bottom: 0, left: 10, right: 10, top: 0 }}
            style={[styles.sidebarItemStyle, sidebarItemStyle]}
          >
            <Text
              style={[
                styles.sidebarItemTextStyle,
                sidebarItemTextStyle,
                {
                  height: sidebarItemHeight,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [jumpToSection, sidebarItemStyle, sidebarItemTextStyle, sidebarItemHeight]
  );
  return (
    <View style={[styles.container, containerStyle]} onLayout={onLayout}>
      {/* <TextIndicator isShow={isShow} text={indicatorText} /> */}
      <View
        style={{
          flexDirection: rtl === true ? "row-reverse" : "row",
          height: hp(54.5),
        }}
      >
        <SectionList
          keyExtractor={sectionKeyExtract}
          refreshing={_a.isLoading}
          onRefresh={_a.onRefresh}
          getItemLayout={getItemLayout}
          onScroll={function () {
            show();
            setVisibleSidebar(true);
          }}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          sections={data}
          {...props}
          showsVerticalScrollIndicator={false}
        />
        {/* 
        <SectionList
          sections={data}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          keyExtractor={sectionKeyExtract}
          getItemLayout={getItemLayout}
          {...props}
        /> */}

        <View
          ref={sidebarRef}
          style={[
            styles.sidebarItemContainerStyle,
            sidebarContainerStyle,
            // { opacity: sidebarOpacity },
          ]}
          {...panResponder.panHandlers}
        >
          {true &&
            defaultSidebarData
              .map(function (item) {
                return item.key;
              })
              .map(function (item, index) {
                return renderSidebarItem === undefined
                  ? renderDefaultSidebarItem({ item: item, index: index })
                  : renderSidebarItem({ item: item, index: index });
              })}
        </View>
      </View>
    </View>
  );
};
export default memo(forwardRef(SectionListSidebar));

//renderDefaultSidebarItem({ item: item, index: index })
