import React from "react";
import ToDoList from "./screens/ToDoList";
import ToDoCompleted from "./screens/ToDoCompleted";

import {createAppContainer} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';


const NavRoot = createStackNavigator(
  {
    ToDoList: {
      screen: ToDoList
    },
    ToDoCompleted:ToDoCompleted,
   
  },
  {
    initialRouteName: "ToDoList",
    headerMode: "none",
    swipeEnabled: true, // fixes a bug in react navigation
    lazy: false, // fixes a bug in react navigation
    header: null,
    navigationOptions: {}
  }
);

export default createAppContainer(NavRoot);
