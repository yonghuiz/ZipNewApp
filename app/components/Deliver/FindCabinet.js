/**
 * Created by liuyu on 2017/5/16.
 */
import React, { Component } from 'react'
import {
    View,
    Text,
} from 'react-native'

export default class FindCabinet extends Component {
    static navigationOptions = {
        title:'Deliver To Cabinet'
    };
    render() {
        return (
            <View>
                <Text>
                    Deliver To Cabinet
                </Text>
            </View>
        )
    }
}