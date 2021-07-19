/**
 * Created by liuyu on 2017/8/16.
 */
import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
} from 'react-native'
import ZIPText from '../ZIPText'

export default class AboutUs extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <Image
                    style={{
                        width: screenSize.width,
                        height: 180,
                    }}
                    source={require('../../assets/images/aboutusheader.png')}
                    resizeMode={'cover'}
                />
                <ZIPText
                    style={{
                        padding: 8,
                        color: Color.titleColor,
                        lineHeight: 18
                    }}
                >
                    {'ZipcodeXpress Inc., ' +
                        'based in Austin TX, Specializes in total ' +
                        'smart-locker solution with cutting edge intelligent' +
                        ' smart-locker products and cloud-based software system. ' +
                        'Our goal is to provide our customer with faster, more secure ' +
                        'and lower cost logistics service to make your life ' +
                        'easier with great happiness.'}
                </ZIPText>
            </View>
        )
    }
}