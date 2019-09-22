/**
 * Created by liuyu on 2017/7/10.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native'
import {
    Button
} from 'react-native-elements'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:Color.bgColor
    }
});

export default class ErrorView extends Component {
    render() {
        const imageSrc = this.props.type === 'timeout' ? require('../assets/images/timeout.png') :
            require('../assets/images/loaderror.png');

        const buttonTitle = this.props.type === 'login' ? 'Login' : 'Reload';
        return (
            <View style={[styles.container,this.props.style]}>
                <Image
                    source={imageSrc}
                />
                <Text style={{padding: 8}}>
                    {this.props.text}
                </Text>
                <Button
                    title={buttonTitle}
                    onPress={this.props.onReloadPress}
                    backgroundColor={Color.themeColor}
                    borderRadius={4}
                    containerViewStyle={{
                        borderRadius: 4,
                    }}
                />
            </View>
        )
    }
}

ErrorView.propTypes = {
    text: PropTypes.string.isRequired,
    onReloadPress: PropTypes.func.isRequired,
    type: PropTypes.oneOf([
        'error',
        'timeout',
        'login',
        'empty'
    ]).isRequired,
};