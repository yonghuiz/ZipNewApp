/**
 * Created by liuyu on 2017/7/20.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    NativeModules,
    Platform,
} from 'react-native'
import MapView from 'react-native-maps'
const { MyLocationManager } = NativeModules;

export default class SelectDeliverAddress extends Component {
    isCenter = false;

    isMount = false;
    constructor(props) {
        super(props);
        this.state = {
            currentLocation:props.location.currentLocation,
            lat:props.location.lat,
            lon:props.location.lon,
        };
    }

    componentDidMount() {
        // if (Platform.OS === 'android') {
        //     MyLocationManager.initMapBox();
        // }

    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <MapView
                    style={{flex:1}}
                    initialRegion={{
                        latitude:this.state.lat,
                        longitude:this.state.lon,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onRegionChange={(region)=>{
                        if (Platform.OS === 'android') {
                            this.timeout && clearTimeout(this.timeout);
                            this.timeout = setTimeout(()=>{
                                MyLocationManager.reverseGeocodeLocation(region.latitude, region.longitude, (address) => {
                                    if (!address) {
                                        //反编码失败,显示经纬度
                                        this.setState({
                                            currentLocation: `${region.latitude},${region.longitude}`,
                                            lat:region.latitude,
                                            lon:region.longitude,
                                        })
                                    } else {
                                        //显示位置
                                        this.setState({
                                            currentLocation: address,
                                            lat:region.latitude,
                                            lon:region.longitude,
                                        })
                                    }
                                });
                            },1000);
                        }
                    }}
                    onRegionChangeComplete={(region)=>{
                        console.log('change');
                        MyLocationManager.reverseGeocodeLocation(region.latitude, region.longitude, (address) => {
                            if (!address) {
                                //反编码失败,显示经纬度
                                this.setState({
                                    currentLocation: `${region.latitude},${region.longitude}`,
                                    lat:region.latitude,
                                    lon:region.longitude,
                                })
                            } else {
                                //显示位置
                                this.setState({
                                    currentLocation: address,
                                    lat:region.latitude,
                                    lon:region.longitude,
                                })
                            }
                        });
                    }}
                />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: 16,
                        height: 40,
                        backgroundColor: Color.themeColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        this.props.selectAddress(this.state.currentLocation,this.state.lat,this.state.lon);
                        this.props.navigator.pop();
                    }}
                >
                    <Text style={{color: 'white', fontSize: 20}}>
                        SELECT
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        color: 'red',
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        fontSize: 20,
                    }}
                >
                    {this.state.currentLocation}
                </Text>
                <Image
                    style={{
                        position:'absolute',
                        width:50,
                        height:50,
                        top:(screenSize.height - navBarHeight - 50) / 2 - 25,
                        left:(screenSize.width - 50) / 2,
                    }}
                    pointerEvents={'none'}
                    source={require('../../assets/images/location.png')}
                />
            </View>
        )
    }
}