import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator,Text, Dimensions,FlatList, View,Platform, Image, SafeAreaView} from 'react-native';
import {
    SkypeIndicator,
} from 'react-native-indicators';
import { verticalScale } from '../utils/Scale';
const onEndReachedThreshold = Platform.OS == 'ios' ? 0 : 0.01
const TYPE_REFRESH = 1 , TYPE_LOADMORE = 2, TYPE_NONE = 3
var prePropData = [];

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export default class BaseFlatList extends Component{
    static propTypes = {
        renderItem: PropTypes.func.isRequired,
        numColumns: PropTypes.number.isRequired,
        datas: PropTypes.array,
        onGetListData: PropTypes.func,
        autoRefresh: PropTypes.bool,
        itemPerPage: PropTypes.number,
        onScroll: PropTypes.func,
        renderHeaderComponent: PropTypes.func,
        colorIndicator: PropTypes.string,
        colorList: PropTypes.string,
        style: PropTypes.object,
        sMessageResult: PropTypes.string,
        textEnd:PropTypes.string,

    }
    static defaultProps = {
        numColumns: 1,
        autoRefresh: false,
        itemPerPage: 1000,
        colorIndicator: "#6cb243",
        colorList: '#fff',
        style: {},
        sMessageResult: "Emty Data",
        textEnd: "",
    }
    constructor(props)
    {
        super(props)
        this.state={
            typeLoading:TYPE_NONE,
            isRefreshLoading:false,
            isLoadmoreLoading:false,
            listData:[],
            canLoadMore:false,
        }
    }
    componentDidMount(){
    }
    onRefresh=()=>{
        if(this.state.isRefreshLoading == false )
        {
            this.state.typeLoading = TYPE_REFRESH;
            this.state.isRefreshLoading = true;
            this.props.onRefresh()
        }
    }
    onEndReached=(info)=>{
        if(this.state.typeLoading == TYPE_NONE && this.state.canLoadMore == true && this.props.datas.length >= this.props.itemPerPage)
        {
            this.state.typeLoading = TYPE_LOADMORE;
            this.props.onLoadMore(info)
        }
    }
    onProcessData=()=>
    {  
        if( this.state.listData !== this.props.datas)
        {  
            if(this.state.typeLoading == TYPE_LOADMORE){
                this.state.listData = this.state.listData.concat(this.props.datas)
                
            }else if(this.state.typeLoading == TYPE_REFRESH){
                this.state.isRefreshLoading = false;
                this.state.listData = [...this.props.datas];
            }else{
                this.state.listData = [...this.props.datas];
            }
        }else if(this.state.listData === this.props.datas && this.props.isRefreshing == false && this.state.typeLoading == TYPE_REFRESH){
            this.state.isRefreshLoading = false;
        }
        this.props.onGetListData && this.props.onGetListData(this.state.listData)
        return this.state.listData;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.datas.length>0 && prePropData.length === nextProps.datas.length&& prePropData.every((value, index) => value === nextProps.datas[index])) {
            return false
        }
        prePropData = [...nextProps.datas]     
        return true;
    }
    renderEmptyComponent=()=>{

        if(this.props.isRefreshing)
        {
            return (
                <View style={{flex: 1, height: DEVICE_HEIGHT * 2 / 3, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}>
                    <SkypeIndicator color={this.props.colorIndicator} size={30} />
                </View>
            )
        } else
        {
            return(
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', marginTop: verticalScale(20)}}>
                    <Text style={{  fontWeight: 'bold', marginTop: verticalScale(10), color: "#333", marginVertical: 20, textAlign: 'center'}}>
                        {this.props.sMessageResult}
                    </Text>
                </View>
                )
        }   
    }
    onScroll = () => {
        if(!this.state.canLoadMore){
            this.setState({ canLoadMore: true })
        }
        this.props.onScroll
    }
    renderFooterComponent=()=>{
        if(this.state.listData.length > 0){
            if(this.state.typeLoading == TYPE_NONE){
                if(this.props.datas.length < this.props.itemPerPage){
                    return(
                        <View style={{flex:1,height:verticalScale(100), alignItems:'center'}}>
                            <Text style={{fontWeight: 'bold', marginTop: verticalScale(5),color:'#333', marginVertical:20,textAlign:'center'}}>
                                {this.props.textEnd}
                            </Text>
                        </View>
                    )
                }else{
                    return (
                        <View style={{flex:1,height:verticalScale(40), alignItems:'center'}}>
                        <ActivityIndicator/>
                        </View>
                    )
                }
            }
            else{
                return(
                    <View style={{flex:1,height:verticalScale(100), alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', marginTop: verticalScale(5),color:'#333', marginVertical:20,textAlign:'center'}}>
                            {this.props.textEnd}
                        </Text>
                    </View>
                )
            }
        }else{
            return (<View /> )
        }
    }
    renderHeaderComponent = () =>{
        return (<View/>)
    }
    componentDidUpdate(prevProps, prevState) {
        this.state.typeLoading = TYPE_NONE;
    }
    
    _onScrollToTop() {
        this._scrollList.scrollToIndex({animated: true, index: 0});
    }
    render(){
        return(
            <SafeAreaView style={[{flex: 1, alignSelf:'stretch'}, this.props.style]}>
                <FlatList
                    ref={(ref) => { this._scrollList = ref; }}
                    data={this.onProcessData()}
                    renderItem={this.props.renderItem}    
                    numColumns={this.props.numColumns}   
                    onRefresh={this.onRefresh}   
                    onEndReached={this.onEndReached}  
                    onEndReachedThreshold={onEndReachedThreshold}
                    refreshing={this.state.isRefreshLoading}
                    ListEmptyComponent={this.renderEmptyComponent}
                    ListFooterComponent={this.renderFooterComponent}
                    ListHeaderComponent={this.props.renderHeaderComponent ? this.props.renderHeaderComponent : this.renderHeaderComponent}
                    columnWrapperStyle={this.props.columnWrapperStyle}
                    scrollEnabled={this.props.isScrollList}
                    onScroll={this.onScroll}
                    extraData={this.state.listData}
                />
            </SafeAreaView>
        );
    }
}

