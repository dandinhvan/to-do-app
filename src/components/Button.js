import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {verticalScale} from '../utils/Scale';
class Button extends Component {
   
  static propTypes = {
    children: PropTypes.string.isRequired,
    type:PropTypes.string
  }
render = () => {
    return (
      <TouchableOpacity {... this.props}
        style={[{backgroundColor:'#78a636',paddingVertical:verticalScale(8),
          paddingHorizontal: verticalScale(35),borderRadius: verticalScale(5),
          justifyContent: 'center',alignItems: 'center',alignSelf: 'center',},this.props.style]}>
        <Text allowFontScaling={false} style={[this.props.styleText,{color:'white',fontSize: verticalScale(17),fontFamily: 'Arial',fontWeight:'bold'}]}>{this.props.children}</Text> 
        </TouchableOpacity>
    );
  
  }
}

export default Button;

