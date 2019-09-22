/**
 * Created by liuyu on 2017/7/6.
 */
import React, { Component} from 'react'
import PropTypes from 'prop-types'
import {
    Image,
    View,
    StyleSheet,
    Text,
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: screenSize.width * 0.8,
        height: screenSize.width * 0.8 + 20,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: screenSize.width * 0.8 - 20,
        height: screenSize.width * 0.8 - 20,
    }
});

export default class ImageLightBox extends Component {
    render() {
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                <View style={styles.container}>
                    <Image
                        source={{uri: this.props.uri}}
                        style={styles.image}
                    />
                    <Text
                        style={{
                            marginTop: 10,
                            textAlign: 'center',
                            color: Color.orange,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}
                        onPress={() => {
                            this.props.navigator.dismissLightBox()
                        }}>
                        Close
                    </Text>
                </View>
            </View>
        )
    }
}

ImageLightBox.propTypes = {
    uri: PropTypes.string.isRequired
};