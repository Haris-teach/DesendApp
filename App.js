import React from "react";
import { LogBox, SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import MainStackNavigator from "./src/routes/MainStackNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/index";
import { MenuProvider } from "react-native-popup-menu";

const App = () => {
  LogBox.ignoreLogs(["all"]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <SafeAreaView style={{flex: 1}}> */}
        <MenuProvider>
          <MainStackNavigator />
        </MenuProvider>
        {/* </SafeAreaView> */}
      </PersistGate>
    </Provider>
  );
};
export default App;

// import AudioRecorderPlayer, {
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AudioEncoderAndroidType,
//   AudioSet,
//   AudioSourceAndroidType,
//   PlayBackType,
//   RecordBackType,
// } from "react-native-audio-recorder-player";
// import {
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import Button from "./src/components/Button";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#455A64",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   titleTxt: {
//     marginTop: 100,
//     color: "white",
//     fontSize: 28,
//   },
//   viewRecorder: {
//     marginTop: 40,
//     width: "100%",
//     alignItems: "center",
//   },
//   recordBtnWrapper: {
//     flexDirection: "row",
//   },
//   viewPlayer: {
//     marginTop: 60,
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   viewBarWrapper: {
//     marginTop: 28,
//     marginHorizontal: 28,
//     alignSelf: "stretch",
//   },
//   viewBar: {
//     backgroundColor: "#ccc",
//     height: 4,
//     alignSelf: "stretch",
//   },
//   viewBarPlay: {
//     backgroundColor: "white",
//     height: 4,
//     width: 0,
//   },
//   playStatusTxt: {
//     marginTop: 8,
//     color: "#ccc",
//   },
//   playBtnWrapper: {
//     flexDirection: "row",
//     marginTop: 40,
//   },
//   btn: {
//     borderColor: "white",
//     borderWidth: 1,
//   },
//   txt: {
//     color: "white",
//     fontSize: 14,
//     marginHorizontal: 8,
//     marginVertical: 4,
//   },
//   txtRecordCounter: {
//     marginTop: 32,
//     color: "white",
//     fontSize: 20,
//     textAlignVertical: "center",
//     fontWeight: "200",
//     fontFamily: "Helvetica Neue",
//     letterSpacing: 3,
//   },
//   txtCounter: {
//     marginTop: 12,
//     color: "white",
//     fontSize: 20,
//     textAlignVertical: "center",
//     fontWeight: "200",
//     fontFamily: "Helvetica Neue",
//     letterSpacing: 3,
//   },
// });

// const screenWidth = Dimensions.get("screen").width;

// const App = () => {
//   let playWidth =
//     (currentPositionSec / currentDurationSec) * (screenWidth - 56);

//   if (!playWidth) {
//     playWidth = 0;
//   }
//   const audioRecorderPlayer = new AudioRecorderPlayer();

//   const [recordSecs, setRecordSecs] = useState(0);
//   const [recordTime, setRecordTime] = useState("00:00:00");
//   const [currentDurationSec, setCurrentDurationsec] = useState(0);
//   const [currentPositionSec, setCurrentPositionSec] = useState(0);
//   const [playTime, setPlayTime] = useState("00:00:00");
//   const [duration, setDuration] = useState("00:00:00");
//   const [isUri, setIsUri] = useState("");

//   const onStatusPress = (e: any) => {
//     const touchX = e.nativeEvent.locationX;
//     console.log(`touchX: ${touchX}`);
//     const playWidth =
//       (currentPositionSec / currentDurationSec) * (screenWidth - 56);
//     console.log(`currentPlayWidth: ${playWidth}`);

//     const currentPosition = Math.round(currentPositionSec);

//     if (playWidth && playWidth < touchX) {
//       const addSecs = Math.round(currentPosition + 1000);
//       audioRecorderPlayer.seekToPlayer(addSecs);
//       console.log(`addSecs: ${addSecs}`);
//     } else {
//       const subSecs = Math.round(currentPosition - 1000);
//       audioRecorderPlayer.seekToPlayer(subSecs);
//       console.log(`subSecs: ${subSecs}`);
//     }
//   };

//   const onStartRecord = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);

//         console.log("write external stroage", grants);

//         if (
//           grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants["android.permission.READ_EXTERNAL_STORAGE"] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants["android.permission.RECORD_AUDIO"] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log("permissions granted");
//         } else {
//           console.log("All required permissions not granted");
//           return;
//         }
//       } catch (err) {
//         console.warn(err);
//         return;
//       }
//     }

//     const audioSet: AudioSet = {
//       AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//       AudioSourceAndroid: AudioSourceAndroidType.MIC,
//       AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//       AVNumberOfChannelsKeyIOS: 2,
//       AVFormatIDKeyIOS: AVEncodingOption.aac,
//     };

//     console.log("audioSet", audioSet);

//     const uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);
//     setIsUri(uri);

//     audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
//       console.log("record-back", e);
//       setRecordSecs(e.currentPosition);
//       setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//     });
//     console.log(`uri: ${uri}`);
//   };

//   const onPauseRecord = async () => {
//     try {
//       await audioRecorderPlayer.pauseRecorder();
//     } catch (err) {
//       console.log("pauseRecord", err);
//     }
//   };

//   const onResumeRecord = async () => {
//     await audioRecorderPlayer.resumeRecorder();
//   };

//   const onStopRecord = async () => {
//     const result = await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//     setRecordSecs(0);

//     console.log(result);
//   };

//   const onStartPlay = async () => {
//     console.log("onStartPlay");

//     const msg = await audioRecorderPlayer.startPlayer(
//       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
//     );
//     const volume = await audioRecorderPlayer.setVolume(1.0);
//     console.log(`file: ${msg}`, `volume: ${volume}`);

//     audioRecorderPlayer.addPlayBackListener((e) => {
//       setRecordSecs(e.currentPosition);
//       setCurrentPositionSec(e.currentPosition);
//       setCurrentDurationsec(e.duration);
//       setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//       setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
//     });
//   };

//   const onPausePlay = async () => {
//     await audioRecorderPlayer.pausePlayer();
//   };

//   const onResumePlay = async () => {
//     await audioRecorderPlayer.resumePlayer();
//   };

//   const onStopPlay = async () => {
//     console.log("onStopPlay");
//     audioRecorderPlayer.stopPlayer(
//       "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
//     );
//     audioRecorderPlayer.removePlayBackListener();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.titleTxt}>Audio Recorder Player</Text>
//       <Text style={styles.txtRecordCounter}>{recordTime}</Text>
//       <View style={styles.viewRecorder}>
//         <View style={styles.recordBtnWrapper}>
//           <Button
//             style={styles.btn}
//             onPress={onStartRecord}
//             textStyle={styles.txt}
//           >
//             Record
//           </Button>
//           <Button
//             style={[
//               styles.btn,
//               {
//                 marginLeft: 12,
//               },
//             ]}
//             onPress={onPauseRecord}
//             textStyle={styles.txt}
//           >
//             Pause
//           </Button>
//           <Button
//             style={[
//               styles.btn,
//               {
//                 marginLeft: 12,
//               },
//             ]}
//             onPress={onResumeRecord}
//             textStyle={styles.txt}
//           >
//             Resume
//           </Button>
//           <Button
//             style={[styles.btn, { marginLeft: 12 }]}
//             onPress={onStopRecord}
//             textStyle={styles.txt}
//           >
//             Stop
//           </Button>
//         </View>
//       </View>
//       <View style={styles.viewPlayer}>
//         <TouchableOpacity style={styles.viewBarWrapper} onPress={onStatusPress}>
//           <View style={styles.viewBar}>
//             <View style={[styles.viewBarPlay, { width: playWidth }]} />
//           </View>
//         </TouchableOpacity>
//         <Text style={styles.txtCounter}>
//           {playTime} / {duration}
//         </Text>
//         <View style={styles.playBtnWrapper}>
//           <Button
//             style={styles.btn}
//             onPress={onStartPlay}
//             textStyle={styles.txt}
//           >
//             Play
//           </Button>
//           <Button
//             style={[
//               styles.btn,
//               {
//                 marginLeft: 12,
//               },
//             ]}
//             onPress={onPausePlay}
//             textStyle={styles.txt}
//           >
//             Pause
//           </Button>
//           <Button
//             style={[
//               styles.btn,
//               {
//                 marginLeft: 12,
//               },
//             ]}
//             onPress={onResumePlay}
//             textStyle={styles.txt}
//           >
//             Resume
//           </Button>
//           <Button
//             style={[
//               styles.btn,
//               {
//                 marginLeft: 12,
//               },
//             ]}
//             onPress={onStopPlay}
//             textStyle={styles.txt}
//           >
//             Stop
//           </Button>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;
