/**
 * Created by liuyu on 2017/7/10.
 */
import {
    NativeModules,
    Platform,
    Alert,
    PermissionsAndroid,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions'
//let Geolocation = require('Geolocation');
let MyLocationManager = NativeModules.MyLocationManager;
let DeviceOperate = NativeModules.DeviceOperate;
const Permission = NativeModules.Permission;

export default function GetLocation(success,fail) {

    if (Platform.OS === 'android') {
        Permissions.check('location').then(response => {
            switch (response) {
                case 'undetermined':
                    Permissions.request('location').then(response => {
                        if (response === 'authorized') {
                            //开始定位
                            MyLocationManager.getCurrentLocation((singal, lat, lon) => {
                                if (!singal) {
                                    //无法定位. 提示用户开启定位权限
                                    fail('Location denied');
                                    Alert.alert(
                                        "Tips",
                                        "Location was denied",
                                        [
                                            {
                                                text: 'Cancel',
                                            },
                                            {
                                                text: 'Go to setting',
                                                onPress: () => {
                                                    DeviceOperate.openSetting();
                                                }
                                            }
                                        ]
                                    )
                                } else {
                                    success(lat,lon);
                                }
                            })
                        }
                    });
                    break;
                case 'authorized':
                //开始定位
                    MyLocationManager.getCurrentLocation((singal, lat, lon) => {
                        if (!singal) {
                            //无法定位. 提示用户开启定位权限
                            fail('Location denied');
                            Alert.alert(
                                "Tips",
                                "Location was denied",
                                [
                                    {
                                        text: 'Cancel',
                                    },
                                    {
                                        text: 'Go to setting',
                                        onPress: () => {
                                            DeviceOperate.openSetting();
                                        }
                                    }
                                ]
                            )
                        } else {
                            success(lat,lon);
                        }
                    })
                    break;
                default:
                    //
                    fail('Location denied');
                    Alert.alert(
                        "Tips",
                        "Location was denied",
                        [
                            {
                                text: 'Cancel',
                            },
                            {
                                text: 'Go to setting',
                                onPress: () => {
                                    DeviceOperate.openSetting();
                                }
                            }
                        ]
                    );
            }
        });
    } else {
        Permission.checkLocation((status)=>{
            console.log(status);
            switch (status) {
                case 'authorized':
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log(position);
                            success(position.coords.latitude, position.coords.longitude);
                        },
                        (error) => {
                            fail('Get location time out');
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 20000,
                            maximumAge: 1000
                        }
                    );
                    break;
                case 'undtermined':
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log(position);
                            success(position.coords.latitude, position.coords.longitude);
                        },
                        (error) => {
                            fail('Get location time out');
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 20000,
                            maximumAge: 1000
                        }
                    );
                    break;
                default:
                    fail('Location denied');
                    Alert.alert(
                        "Tips",
                        "Location was denied",
                        [
                            {
                                text: 'Cancel',
                            },
                            {
                                text: 'Go to setting',
                                onPress: () => {
                                    DeviceOperate.openSetting();
                                }
                            }
                        ]
                    );
                    break;

            }
        });
    }
    // if (Platform.OS === 'android') {
    //     PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         {
    //             'title':'request location permission',
    //             'message':'ZipcodExpress request location to use'
    //         }
    //     )
    //         .then(granted=>{
    //             if (granted) {
    //                 MyLocationManager.getCurrentLocation((singal, lat, lon) => {
    //                     if (!singal) {
    //                         //无法定位. 提示用户开启定位权限
    //                         fail('Location denied');
    //                         Alert.alert(
    //                             "Tips",
    //                             "Location was denied",
    //                             [
    //                                 {
    //                                     text: 'Cancel',
    //                                 },
    //                                 {
    //                                     text: 'Go to setting',
    //                                     onPress: () => {
    //                                         DeviceOperate.openSetting();
    //                                     }
    //                                 }
    //                             ]
    //                         )
    //                     } else {
    //                         success(lat,lon);
    //                     }
    //                 })
    //             }
    //         })
    //         .catch(err=>{
    //
    //         });
    // } else {
    //     //检测权限
    //     MyLocationManager.checkLocationAuthor((authorized) => {
    //         if (authorized === 1) {
    //             Geolocation.getCurrentPosition(
    //                 (position) => {
    //                     success(position.coords.latitude, position.coords.longitude);
    //                 },
    //                 (error) => {
    //                     fail('Get location time out');
    //                 },
    //                 {
    //                     enableHighAccuracy: true,
    //                     timeout: 20000,
    //                     maximumAge: 1000
    //                 }
    //             );
    //         } else {
    //             //无法定位. 提示用户开启定位权限
    //             fail('Location denied');
    //             Alert.alert(
    //                 "Tips",
    //                 "Location was denied",
    //                 [
    //                     {
    //                         text: 'Cancel',
    //                     },
    //                     {
    //                         text: 'Go to setting',
    //                         onPress: () => {
    //                             DeviceOperate.openSetting();
    //                         }
    //                     }
    //                 ]
    //             );
    //         }
    //     })
    // }
}