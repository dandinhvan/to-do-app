import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers} from 'redux';
import React, { Component } from 'react';
import * as AppReducer from './src/reducers';
import thunk from "redux-thunk";
import { createLogger } from 'redux-logger';
import NavRoot from './src/NavigationScreen';
import {View,AsyncStorage, StatusBar} from 'react-native';
const logger = createLogger();
const reducer = combineReducers(AppReducer);
const store = createStore(reducer,
  applyMiddleware(thunk, logger),
);

class App extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  componentDidMount() {

  }

  
  
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1}}>
          <StatusBar barStyle={'light-content'}/>
            <NavRoot />
        </View>
      </Provider>
    );
  }
}
export default App
