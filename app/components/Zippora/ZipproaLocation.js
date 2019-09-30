/**
 * Created by liuyu on 2017/9/30.
 */
import React, { PureComponent } from 'react'
//import MapView from 'react-native-maps'
import {
    View,
    Text,
    StyleSheet,
    //WebView,
    Platform
} from 'react-native'
import {WebView} from 'react-native-webview'


export default class ZipproaLocation extends PureComponent {

    constructor(props) {
        super(props);
      
        this.mapUrl = (this.props.zippora.addressUrl!=null&&this.props.zippora.addressUrl.indexOf('://')>0)
            ?this.props.zippora.addressUrl
            :`https://www.google.com/maps/place/${this.props.zippora.address}`
            console.log(this.mapUrl);
    }

    render() {
        return (
            // <MapView
            //     style={{flex:1}}
            //     initialRegion={{
            //         latitude:parseFloat(this.props.zippora.latitude),
            //         longitude:parseFloat(this.props.zippora.longitude),
            //         latitudeDelta: 0.0922,
            //         longitudeDelta: 0.0421,
            //     }}
            // >
            //     <MapView.Marker
            //         title={`zipporaId: ${this.props.zippora.cabinetId}`}
            //         description={this.props.zippora.address}
            //         coordinate={{
            //             latitude:parseFloat(this.props.zippora.latitude),
            //             longitude:parseFloat(this.props.zippora.longitude),
            //         }}
            //     >
            //     </MapView.Marker>
            // </MapView>

            <View style={{flex:1, flexDirection:'column', backgroundColor:'white'}}>
            {/* <Text>{this.mapUrl}</Text> */}
            <WebView style={{fontSize:20}}
            source={{uri:this.mapUrl}}
            style = {{flex:1}}
            scalesPageToFit={true}
            /> 
            </View>
        )
    }
}