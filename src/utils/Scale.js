import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
//var DeviceInfo = require('react-native-device-info');
//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
var heightCustom = 0;
heightCustom = 680*375/350;
//DeviceInfo.getModel() === 'iPhone X'
if(height === 812) //iphone X
{
    heightCustom = 680;
}else if(height === 896){ //iphone xr
    heightCustom = 680*375/360;;
}else
{
    heightCustom = height;
}
const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => heightCustom / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};
