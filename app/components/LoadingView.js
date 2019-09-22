/**
 * Created by liuyu on 2017/7/10.
 */
import React, { Component } from 'react'
import {
    View,
    Image,
} from 'react-native'
import * as Animatable from 'react-native-animatable'

export default class LoadingView extends Component {
    render() {
        return (
            <View style={[{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:Color.bgColor},this.props.style]}>
                <Animatable.Image
                    iterationCount="infinite"
                    easing="linear"
                    direction="normal"
                    animation="rotate"
                    source={require('../assets/images/spinner.png')}
                    style={{width:50,height:50}}
                />
            </View>
        )
    }
}