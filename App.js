import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/redux/index";
import Stack from "./src/navigations/stackNavigation";
import { SafeAreaView } from "react-native";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
