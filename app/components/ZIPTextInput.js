/**
 * Created by liuyu on 2017/10/9.
 */
import React, { PureComponent } from 'react'
import {
    TextInput,
    Platform
} from 'react-native'

export default class ZIPTextInput extends TextInput {
    render() {
        if (Platform.OS === 'android') {
            if (this.props.style !== undefined) {
                if (this.props.style.fontWeight !== undefined) {
                    return (
                        <TextInput
                            {...this.props}
                            style={[{fontFamily: 'Avenir-Medium'}, this.props.style,{fontWeight:'normal'}]}
                        />
                    )
                }
            }
        }
        return (
            <TextInput
                {...this.props}
                style={[{fontFamily:FontFamily},this.props.style]}
                underlineColorAndroid='transparent'
            />
        )
    }
}

ZIPTextInput.propTypes = TextInput.propTypes;