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
class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
      isLoading:false,
      isLoadingTodos:false,
      toDo:"",
      todos:[],
      time: "---- -- -- : -- --",
      dateTimePicker:false,
      idUpdate: false,
    }

  }
  componentDidMount() {
    // firedatabase().goOnline();
    // const serverTime = firedatabase().getServerTime();
    // console.log(serverTime);
    this.loadTodos()
    
  }
  loadTodos = async () => {
    try {
      // await AsyncStorage.clear();
      const getTodos = await AsyncStorage.getItem('TODOS');
      const parsedTodos = JSON.parse(getTodos);
      if(parsedTodos){
        parsedTodos.sort(function (a, b) {
          return a.priority - b.priority;
        });
      }
      this.setState({ isLoadingTodos: false, todos: parsedTodos|| [] });
    } catch (err) {
        alert('Application Error. Cannot load data.')
    }
  }
  handleDatePicked=(date)=>{
    let time = Moment(date).format("YYYY-MM-DD H:m:ss");
    console.log("test",Moment(date).millisecond());
    
    this.setState({ time:time,dateTimePicker: false });
  }

  onPressAdd=async()=>{
    this.setState({isLoading:true});
    var todos = this.state.todos;
    if(this.state.idUpdate){
      let index = todos.findIndex(item => item.created_at == this.state.idUpdate);
      if(index != -1){
        todos[index].title = this.state.todo;
        todos[index].priority =  priority;
        todos[index].time =   this.state.time;
      }

    }else{
      const id = Date.now();
      let todo = {
        title: this.state.todo,
        priority: priority,
        time: this.state.time,
        created_at: id,
      }
      todos = [...this.state.todos,todo]
    }

    console.log("todos ADDD",todos);
    // this.state.todos = todos;
    
  //   const ref = firedatabase().ref();
  //   firedatabase().ref().on('value', (data) => {
  //     console.log(data.toJSON());
  // })
    // console.log(test);
    
    // ref.push({ foo: 'bar' });

    await AsyncStorage.setItem("TODOS",JSON.stringify(todos))
    this.loadTodos()
    this.setState({showModal:false,isLoading:false});
  }
  renderListRadioButton = (item,index) => {
    return (
        <RadioButton value={item.key} >
            <Text>{item.label}</Text>
        </RadioButton>
    )
  }
  onSelect(index, value){
    priority  = value;
  }
  onLoadmore(){

  }
  onRefresh(){
    this.loadTodos();
  }
  showTodo = todo => () =>{
    if(todo){
      priority = todo.priority;
      this.setState({showModal:true,todo:todo.title,time:todo.time,idUpdate:todo.created_at});
    }else{
      priority = 0;
      this.setState({showModal:true,todo:"",time:"---- -- -- : -- --",idUpdate:false});
    }
  }
  completed = todo => async() =>{
    const todos = this.state.todos;
    let index = todos.findIndex(item => item.created_at == todo.created_at);
    if(index != -1){
      todos.splice(index,1);
      AsyncStorage.setItem("TODOS",JSON.stringify(todos))
      let todos_completed = await AsyncStorage.getItem('TODOS_COMPLETED');
      const parsedTodos = JSON.parse(todos_completed);
      todos_completed = parsedTodos?parsedTodos:[];
      todos_completed = [...todos_completed,todo]
      AsyncStorage.setItem("TODOS_COMPLETED",JSON.stringify(todos_completed))
      this.setState({todos:todos});
    }
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
            AsyncStorage.setItem("TODOS",JSON.stringify(todos))
            this.setState({todos:todos});
          }
        }},
      ],
      { cancelable: false }
    )
  }
  listToDoCompleted = ()=>{
    this.props.navigation.navigate('ToDoCompleted');
  }
  renderTodo=(rowData)=>{
    let todo = rowData.item;
    return (
    <View key={rowData.index} style={styles.viewRow}>
      <TouchableOpacity style={{flex:1}} onPress={this.showTodo(todo)}>
        <Text style = {styles.txtRowTitle}>{todo.title}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.txtRowDetail}>{todo.time}</Text>
          <Text style={styles.txtRowDetail}>{"   Priority : "+ ArrPriority[todo.priority]}</Text>
        </View>
      </TouchableOpacity>
      <View style={{width:verticalScale(20)}}>
        <TouchableOpacity onPress={this.completed(todo)}>
          <Image resizeMode={'contain'} style={{tintColor:'#78a636',width:verticalScale(20),height:verticalScale(20)}}
            source={require('../images/icon_checked.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.removeTodo(todo)} style={{position:'absolute',bottom: -2,right: 0}}>
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
          <View style={{}}>
          </View>
          <Text ellipsizeMode={"tail"}  numberOfLines={1} style={styles.headerText}>
            {"List Task"}
          </Text>
          <TouchableOpacity onPress={this.listToDoCompleted} style={{ width:verticalScale(40),padding: verticalScale(5) }}>
            <Image
                source={require('../images/icon_checked.png')}
                style={styles.headerIconRight}
            />
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
        <Modal isVisible={this.state.showModal}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Spinner visible={this.state.isLoading} />
            <View style={styles.viewModal}>
              <Text style={{ fontWeight: "bold", marginVertical: verticalScale(20) }}>
                  {"ADD TASK"}
              </Text>
              <KeyboardAwareScrollView style={{ alignSelf: "stretch",marginLeft: verticalScale(15),}}>
                <TextInput
                    placeholder={"Task"}
                    style={{borderBottomColor: '#ddd', borderBottomWidth: verticalScale(1), width: WIDTH_CUSTOM,
                    height: verticalScale(50) }}
                    multiline={true}
                    numberOfLines={2}
                    value={this.state.todo}
                    onChangeText={(txt) => this.setState({todo:txt})}
                />
                <View style={{flexDirection: 'row', alignItems: "center" }}>
                  <Text style={{ fontWeight: 'bold',fontSize: verticalScale(14), color: 'black'}}>
                      {"Priority"}
                  </Text>
                  <RadioGroup
                      onSelect = {(index, value) => this.onSelect(index, value, '')}
                      color={"#6cb243"}
                      activeColor={"#6cb243"}
                      selectedIndex={priority}
                      style={{flexWrap: 'wrap',flexDirection: 'row'}}
                  >
                    {optionsType.map(this.renderListRadioButton)}
                  </RadioGroup>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Text style={{ fontWeight: 'bold',fontSize: verticalScale(14), color: 'black'}}>
                      {"Time require "}
                  </Text>
                  <TouchableOpacity onPress={()=>this.setState({dateTimePicker:true})} style={{marginLeft:verticalScale(20)}}>
                    <Text >
                      {this.state.time}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignSelf: "stretch", marginVertical: verticalScale(20), flexDirection: "row", justifyContent: "space-around" }}>
                  <Button onPress={()=>this.setState({showModal:false})}
                      style={{ backgroundColor: '#333', paddingHorizontal: verticalScale(35) }}
                      children={'Close'}
                  />
                  <Button
                      onPress={this.onPressAdd}
                      style={{ paddingHorizontal: verticalScale(35) }}
                      children={this.state.idUpdate?'Update':'Create'}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
          <DateTimePicker
            mode = {'datetime'}
            is24Hour = {true}
            isVisible={this.state.dateTimePicker}
            onConfirm={this.handleDatePicked}
            onCancel={()=>this.setState({dateTimePicker:false})}
          />
        </Modal>
        <TouchableOpacity onPress={this.showTodo(false)} style={styles.addButton}>
          <Image source={require('../images/icon_add.png')}
            style={styles.iconAdd}
          />
        </TouchableOpacity>
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
  iconAdd:{ 
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
  addButton:{
    position:'absolute',
    bottom:verticalScale(10),
    right: verticalScale(10),
    width:verticalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    backgroundColor: "#78a636",
    justifyContent:"center",
    alignItems:'center'
    
  }


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
