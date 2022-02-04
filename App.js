//================================ React Native Imported Files ======================================//

import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

//================================ Local Imported Files ======================================//

import RootStack from './src/RootStack';
import ApiData from './redux/store/reducers/ApiData';

const rootReducer = combineReducers({
    ApiData: ApiData,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
    return (
        <Provider store={store}>
            <RootStack />
        </Provider>
    );
};

export default App;
