/**
 * Created by liuyu on 2017/7/5.
 */
import React , { Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    TouchableOpacity,
} from 'react-native'
import * as Animatable from 'react-native-animatable'

export default class MenuComponent extends Component {
    static navigatorStyle = {
        screenBackgroundColor: 'transparent',
        modalPresentationStyle: 'overCurrentContext',
    };

    render() {
        return (
            <View
                style={{flex:1}}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={()=>{this.props.navigator.dismissModal({animationType:'none'})}}
                    style={{flex:1}}
                >
                    {this.props.renderMenu()}
                </TouchableOpacity>
            </View>
        )
    }
}

MenuComponent.propTypes = {
    renderMenu:PropTypes.func.isRequired,
};