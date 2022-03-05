import React from "react";
import { LogBox, SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import MainStackNavigator from "./src/routes/MainStackNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/index";

const App = () => {
  LogBox.ignoreLogs(["all"]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <SafeAreaView style={{flex: 1}}> */}
        <MainStackNavigator />
        {/* </SafeAreaView> */}
      </PersistGate>
    </Provider>
  );
};
export default App;
