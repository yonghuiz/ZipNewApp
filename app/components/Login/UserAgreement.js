/**
 * Created by Jim on 2/6/2018.
 */
import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,

    Platform
} from 'react-native'
import { WebView } from 'react-native-webview'
import ZIPText from '../ZIPText'
import LoadingView from '../LoadingView'
const AgreementHtml = Platform.OS === 'ios' ? require('../../assets/APPTermsAndConditions2018.html') :
    { uri: 'file:///android_asset/APPTermsAndConditions2018_android.htm' };



const styles = StyleSheet.create({
    content: {
        padding: 8,
        color: Color.titleColor,
        lineHeight: 18
    }
});

export default class UserAgreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
        setTimeout(_ => {
            this.setState({ loading: false }), 100
        });
    }
    render() {
        if (this.state.loading) {
            return <View />
        }
        return (

            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <WebView style={{ fontSize: 20 }}
                    source={AgreementHtml}
                    style={{ flex: 1 }}
                    scalesPageToFit={true}
                />

            </View>
        )
    }
}