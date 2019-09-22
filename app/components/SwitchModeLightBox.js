/**
 * Created by liuyu on 2017/8/9.
 */
import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
} from 'react-native'

export default class SwitchModeLightBox extends Component {
    render() {
        return (
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator animating={true} color={'lightgray'} size={'small'}/>
            </View>
        )
    }
}