'use strict';

import React, { Component } from 'react';
import {connect} from 'react-redux';
import {View,SafeAreaView,Alert,FlatList,TextInput,Dimensions,Platform,Text,TouchableOpacity,Image,AsyncStorage,StyleSheet} from 'react-native';
import {verticalScale} from '../utils/Scale';
import firebase from 'react-native-firebase';
import NetInfo from "@react-native-community/netinfo";
import Modal from "react-native-modal";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import BaseFlatList from "../components/BaseFlatList";
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from "moment";
const DEVICE_WIDTH = Dimensions.get('window').width;
const WIDTH_CUSTOM = DEVICE_WIDTH * 5 / 6;
const ArrPriority = ["High","Medium","Low"]
const KEY_TODOS = "key_storage";
const optionsType = [{key: 0, label: "High"}, {key: 1,label: "Medium"}, {key: 2, label: "Low"}]
var priority = 0;
var todos_completed = [];
class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos:[],
            isLoading:false,
        }

    }
    componentDidMount() {
        this.loadTodos()
    }
    loadTodos = async () => {
        try {
            let getTodos = await AsyncStorage.getItem('TODOS_COMPLETED');
            const parsedTodos = JSON.parse(getTodos);
            console.log("parsedTodos",parsedTodos);
            
            this.setState({ isLoadingTodos: false, todos: parsedTodos|| [] });
        } catch (err) {
            alert('Application Error. Cannot load data.')
        }
    }
    onLoadmore(){

    }
    onRefresh(){
        this.loadTodos();
    }
  
    removeTodo = todo => () =>{
        Alert.alert("Delete Task", "Are you sure",
        [
            {text: "Close", onPress: ()=>{}},
            {text: "Delete", onPress: ()=>{
            const todos = this.state.todos;
            let index = todos.findIndex(item => item.created_at == todo.created_at);
            if(index != -1){
                todos.splice(index,1);
                AsyncStorage.setItem("TODOS_COMPLETED",JSON.stringify(todos))
                this.setState({todos:todos});
            }
            }},
        ],
        { cancelable: false }
        )
    }
  renderTodo=(rowData)=>{
    let todo = rowData.item;
    return (
    <View key={rowData.index} style={styles.viewRow}>
      <TouchableOpacity style={{flex:1}}>
        <Text style = {styles.txtRowTitle}>{todo.title}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.txtRowDetail}>{todo.time}</Text>
          <Text style={styles.txtRowDetail}>{"   Priority : "+ ArrPriority[todo.priority]}</Text>
        </View>
      </TouchableOpacity>
      <View style={{width:verticalScale(20)}}>
        <TouchableOpacity onPress={this.removeTodo(todo)} style={{}}>
          <Image resizeMode={'contain'} style={styles.imgRowRemove}
            source={require('../images/icon_trash.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
    )
  }
  render() {
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={styles.headerStyle}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)} style={{ padding: verticalScale(5) }}>
                <Image
                    source={require('../images/icon_back.png')}
                    style={styles.headerIconRight}
                />
            </TouchableOpacity>
          <Text ellipsizeMode={"tail"}  numberOfLines={1} style={styles.headerText}>
            {"List Task Completed "}
          </Text>
          <TouchableOpacity style={{ padding: verticalScale(5) }}>
            
          </TouchableOpacity>
        </SafeAreaView> 
        <View style={{flex:1}}>
        <BaseFlatList
            datas={this.state.todos}
            numColumns={1}
            isRefreshing={this.state.isLoadingTodos}
            renderItem={this.renderTodo}
            onEndReachedThreshold={10}
            loadmoreCustom={true}
            scrollEventThrottle={16}
            onRefresh={() => this.onRefresh()}
            onLoadMore={(info) => this.onLoadmore(info)}
        />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: { 
    flex: 1,
    backgroundColor: "#dddd",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyle:{ 
    alignSelf: 'stretch',
    alignItems: 'center', 
    flexDirection: "row",
    height:verticalScale(80),
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, 
    backgroundColor: "#78a636", justifyContent:'space-between' 
  },
  headerText:{
    fontSize: verticalScale(20),
    color: "#fff",
    fontWeight: 'bold',
  },
  headerIconRight:{ 
    width: verticalScale(22), 
    height: verticalScale(22), 
    tintColor: '#fff', 
    resizeMode: 'contain' ,
  },
  viewModal:{ 
    alignItems: 'center', 
    width: DEVICE_WIDTH - verticalScale(30), 
    backgroundColor: 'white', 
    borderRadius: verticalScale(20) 
  },
  viewRow:{
    backgroundColor:"#fff",
    padding:verticalScale(10),
    width:DEVICE_WIDTH,
    marginBottom:verticalScale(5),
    flexDirection: 'row',
  },
  txtRowTitle:{
    fontWeight: '600',
    fontSize:verticalScale(16),
    marginBottom: verticalScale(8),
  },
  txtRowDetail:{
    fontSize: verticalScale(12),
    color:'#bbb'
  },
  imgRowRemove :{
    tintColor:'#f74f57',
    width:verticalScale(18),
    height:verticalScale(18),
  },
})

function mapStateToProps(state) {
    return {

    };
  }
  function mapDispatchToProps(dispatch) {
    return {
      dispatch
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
