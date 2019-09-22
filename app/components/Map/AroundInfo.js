/**
 * Created by liuyu on 2017/8/22.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
} from 'react-native'
import MapView from 'react-native-maps'
import * as Animatable from 'react-native-animatable'


export default class AroundInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectType: null,
            selectIndex: 0,
        }
    }

    render() {
        /*
         fromPage:'deliverto',
         toPhone:this.props.toPhone,
         toName:this.props.toName,
         list:this.props.list,
         * */

        return (
            <View style={{flex: 1}}>
                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: 37.582,
                        longitude: -122.405,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onMapReady={() => {
                        console.log('map ready');
                    }}
                >
                    {
                        this.props.cabinetList.map((data, index) => {
                            return (
                                <MapView.Marker
                                    key={`cabinet ${index}`}
                                    coordinate={{
                                        latitude: 37.582 + index,//parseFloat(data.latitude) + index,
                                        longitude: -122.405 + index,//parseFloat(data.longitude) + index,
                                    }}
                                    title={`Cabinet Id: ${data.cabinetId}`}
                                    description={`Address: ${data.address}`}
                                    onPress={(e)=>{
                                        let index = e.nativeEvent.id.substr(e.nativeEvent.id.indexOf(' ') + 1);
                                        this.setState({
                                            selectType:'cabinet',
                                            selectIndex:index,
                                        })
                                    }}
                                    identifier={`cabinet ${index}`}
                                >
                                    <Image
                                        source={require('../../assets/images/annotation.png')}
                                    />
                                </MapView.Marker>
                            )
                        })
                    }
                    {
                        this.props.courierList.map((data, index) => {
                            return (
                                <MapView.Marker
                                    key={`courier ${index}`}
                                    coordinate={{
                                        latitude: 37.582 - index,// parseFloat(data.latitude) + index + 1,
                                        longitude: -122.405 - index,// parseFloat(data.longitude),
                                    }}
                                    title={`Courier Id: ${data.courierId}`}
                                    description={`distance: ${data.dis} miles`}
                                    onPress={(e)=>{
                                        let index = e.nativeEvent.id.substr(e.nativeEvent.id.indexOf(' ') + 1);
                                        this.setState({
                                            selectType:'courier',
                                            selectIndex:index,
                                        })
                                    }}
                                    identifier={`courier ${index}`}
                                >
                                    <Image
                                    source={require('../../assets/images/courier.png')}
                                    />
                                </MapView.Marker>
                            )
                        })
                    }
                </MapView>
                {
                    Platform.OS === 'android' && this.state.selectType !== null ?
                        <Animatable.View
                            easing="linear"
                            animation="slideInUp"
                            duration={200}
                            style={{
                                position:'absolute',
                                left:0,
                                right:0,
                                bottom:0,
                                height:60,
                                backgroundColor:'white',
                                width:screenSize.width,
                                flexDirection:'column',
                                justifyContent:'space-around'
                            }}
                        >
                            <Text>
                                {
                                    this.state.selectType === 'courier' ?
                                        `Courier Id: ${this.props.courierList[this.state.selectIndex].courierId}`
                                        : `Cabinet Id: ${this.props.cabinetList[this.state.selectIndex].cabinetId}`
                                }
                            </Text>
                            <Text>
                                {
                                    this.state.selectType === 'courier' ?
                                        `Distance: ${this.props.courierList[this.state.selectIndex].dis} miles`
                                        : `Address: ${this.props.cabinetList[this.state.selectIndex].address}`
                                }
                            </Text>
                        </Animatable.View>
                        : null
                }
            </View>
        )
    }
}