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
