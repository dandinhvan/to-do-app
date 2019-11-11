import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity,SafeAreaView,
    ImageBackground
} from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class Header extends Component {

    static propTypes = {
        backgroundHeader: PropTypes.string,
        onLeftClick: PropTypes.func,
        onRightClick: PropTypes.func,
        onRightClickAdd: PropTypes.func,
        uriViewLeft: PropTypes.string,
        uriViewRight: PropTypes.string,
        uriViewRightAdd: PropTypes.string,
        colorViewLeft: PropTypes.string,
        titleColor: PropTypes.string,
        titleText: PropTypes.string,
        colorViewRight: PropTypes.string,
        colorViewRightAdd: PropTypes.string,
        paddingTop: PropTypes.number,
        customIconRight: PropTypes.bool,
        iconTitle: PropTypes.bool,
        titleClick: PropTypes.func,
        isListChatHeader: PropTypes.bool,
        numberFriendRequest: PropTypes.number,
    }

    static defaultProps = {
        backgroundHeader: 'transparent',
        uriViewLeft: require('../../resources/image/back_button.png'),
        colorViewLeft: '#6cb243',
        titleColor: '#fff',
        titleText: '',
        colorViewRight: '#fff',
        uriViewRight: undefined,
        paddingTop: 10,
        uriViewRightAdd: require('../../resources/image/icon_info.png'),
        customIconRight: false,
        iconTitle: false,
        isListChatHeader: false,
        numberFriendRequest: 0,
    }

    constructor(props) {
        super(props)
        this.state = {
            valueInput: "",
        }
    }

    onLeftClick(){
        this.props.navigation.goBack(null);
    }

    render() {
        return (
        <SafeAreaView
            style={{ alignSelf: 'stretch', flexDirection: "column",
            paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, 
             backgroundColor: this.props.backgroundHeader, justifyContent:'flex-start' }}
        >
            <View 
                style={{
                    elevation: 2,
                    width: DEVICE_WIDTH,
                    backgroundColor: this.props.backgroundHeader,
                    flexDirection: 'row',
                    paddingVertical: Base.verticalScale(10),
                    paddingTop: Base.verticalScale(this.props.paddingTop),
                    paddingHorizontal: Base.verticalScale(10),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                        <TouchableOpacity 
                            onPress={
                                this.props.onLeftClick ? 
                                    this.props.onLeftClick 
                                : 
                                    () => this.onLeftClick()
                            }
                            style={{padding: Base.verticalScale(5)}}
                        >
                            <Image 
                                source={this.props.uriViewLeft} 
                                style={{ width: Base.verticalScale(22), height: Base.verticalScale(22), tintColor: this.props.colorViewLeft, resizeMode: 'contain' }} 
                            />
                        </TouchableOpacity>

                {
                    this.props.uriViewLeftAdd ? 
                        this.props.isListChatHeader ? 
                            <TouchableOpacity 
                                onPress={
                                    this.props.onLeftClickAdd ? 
                                        this.props.onLeftClickAdd 
                                    : 
                                        () => {}
                                }
                                style={{padding: Base.verticalScale(5), flexDirection: 'row', height: Base.verticalScale(60)}}
                            >
                                <Image 
                                    source={this.props.uriViewLeftAdd} 
                                    style={{ width: Base.verticalScale(22), height: Base.verticalScale(22), marginTop: Base.verticalScale(14), tintColor: this.props.colorViewLeftAdd, resizeMode: 'contain' }} 
                                />
                                <View 
                                    style={{
                                        height: Base.verticalScale(20),
                                        width: Base.verticalScale(20),
                                        backgroundColor: Base.ColorApp.red,
                                        borderRadius: Base.verticalScale(10),
                                        marginTop: 0,
                                        marginLeft: -10,
                                    }}
                                >
                                    <Base.BaseText
                                        style={{
                                            fontSize: Base.moderateScale(15),
                                            fontWeight: 'bold',
                                            color: Base.ColorApp.white,
                                            textAlign: 'center',
                                        }}
                                    >{this.props.numberFriendRequest}</Base.BaseText>
                                </View>
                            </TouchableOpacity> : 
                            <TouchableOpacity 
                                onPress={
                                    this.props.onLeftClickAdd ? 
                                        this.props.onLeftClickAdd 
                                    : 
                                        () => {}
                                }
                                style={{padding: Base.verticalScale(5)}}
                            >
                                <Image 
                                    source={this.props.uriViewLeftAdd} 
                                    style={{ width: Base.verticalScale(22), height: Base.verticalScale(22), tintColor: this.props.colorViewLeftAdd, resizeMode: 'contain' }} 
                                />
                            </TouchableOpacity> : <View/>
                }

                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginHorizontal: Base.verticalScale(10), flexDirection: 'row', alignItems: 'center' }}>
                    <Base.BaseText 
                        ellipsizeMode={"tail"} 
                        numberOfLines={1}
                        style={{
                            fontSize: Base.moderateScale(20, 0.4),
                            color: this.props.titleColor,
                            backgroundColor: 'transparent',
                            fontWeight: 'bold',
                        }}
                    >
                        {this.props.titleText}
                    </Base.BaseText>
                    {
                        this.props.iconTitle ?
                            <TouchableOpacity 
                                onPress={this.props.titleClick}
                                style={{padding: Base.verticalScale(10)}}
                            >
                                <Image 
                                    source={require('../../resources/image/icon_edit_profile.png')} 
                                    style={{ width: Base.verticalScale(16), height: Base.verticalScale(16), tintColor: Base.ColorApp.silver, resizeMode: 'contain' }} 
                                />
                            </TouchableOpacity>
                        :
                            null
                        }
                </View>
                
                {
                    !this.props.customIconRight ?
                        <TouchableOpacity 
                            onPress={this.props.onRightClick ? this.props.onRightClick : null}
                            style={{ padding: Base.verticalScale(5) }}
                        >
                            <Image
                                source={this.props.uriViewRight}
                                style={{ width: Base.verticalScale(22), height: Base.verticalScale(22), tintColor: this.props.colorViewRight, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={this.props.onRightClickAdd ? this.props.onRightClickAdd : null}
                                style={{ padding: Base.verticalScale(5), marginHorizontal: Base.verticalScale(10) }}
                            >
                                <Image
                                    source={this.props.uriViewRightAdd}
                                    style={{ width: Base.verticalScale(24), height: Base.verticalScale(24), tintColor: this.props.colorViewRightAdd ? this.props.colorViewRightAdd : this.props.colorViewRight, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.props.onRightClick ? this.props.onRightClick : null}
                                style={{ padding: Base.verticalScale(5) }}
                            >
                                <Image
                                    source={this.props.uriViewRight}
                                    style={{ width: Base.verticalScale(22), height: Base.verticalScale(22), tintColor: this.props.colorViewRight, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                        </View>
                }
            </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden'
    },
})
