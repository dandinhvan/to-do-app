
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,Easing,ImageBackground,
  Modal,Image,Animated,
  ActivityIndicator
} from 'react-native';
import { scale, moderateScale, verticalScale } from "../utils/Scale";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: "#000", shadowOffset: { width: 2, height: 10 }, shadowOpacity: 0.5, elevation: 3
  },
  textContent: {
    top: 80,
    height: 50,
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];
spinValue = new Animated.Value(0)

// First set up animation 
Animated.timing(
    this.spinValue,
  {
    toValue: 1,
    duration: 10000,
    easing: Easing.linear
  }
).start()

// Second interpolate beginning and end values (in this case 0 and 1)
const spin = this.spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '9000deg']
})
export default class Spinner extends React.Component {

  constructor(props) {
    super(props);
    this.state = { visible: this.props.visible, textContent: this.props.textContent };
  }

  static propTypes = {
    visible: PropTypes.bool,
    cancelable: PropTypes.bool,
    textContent: PropTypes.string,
    animation: PropTypes.oneOf(ANIMATION),
    color: PropTypes.string,
    size: PropTypes.oneOf(SIZES),
    overlayColor: PropTypes.string
  };

  static defaultProps = {
    visible: false,
    cancelable: false,
    textContent: '',
    animation: 'none',
    color: 'white',
    size: 'large', // 'normal',
    overlayColor: 'rgba(0, 0, 0, 0)'
  };
  
  close() {
    this.setState({ visible: false });
  }


  _handleOnRequestClose() {
    if (this.props.cancelable) {
      this.close();
    }
  }

  _renderDefaultContent() {
    return (
      <View style={styles.background}>
        <ActivityIndicator
          color={this.props.color}
          size={this.props.size}
          style={{ flex: 1 }}
        />
        
      </View>);
  }

  _renderSpinner() {
    const { visible } = this.state;

    if (!visible)
      return null;

    const spinner = (
      <View style={[
        styles.container,
        { backgroundColor: 'rgba(0, 0, 0, 0)' }
      ]} key={`spinner_${Date.now()}`}>
        {this.props.children ? this.props.children : this._renderDefaultContent()}
      </View>
    );

    return (
      <Modal
        animationType={this.props.animation}
        onRequestClose={() => this._handleOnRequestClose()}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={visible}>
        {spinner}
      </Modal>
    );

  }

  render() {
    return this._renderSpinner();
  }

}