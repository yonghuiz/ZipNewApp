/**
 * Created by liuyu on 2017/11/15.
 */
import {
    Platform,
    Alert,
    NativeModules,
} from 'react-native'
import Permissions from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'
import ImagePick from 'react-native-image-picker'
const {
    Permission,
    DeviceOperate
} = NativeModules;


export function openCamera() {
    return new Promise((resolve,reject)=>{
        if (Platform.OS === 'android') {
            Permissions.check('camera')
                .then(promise => {
                    switch (promise) {
                        case 'undetermined':
                            Permissions.request('camera')
                                .then(response => {
                                    if (response === 'authorized') {
                                        ImagePick.launchCamera({title: 'Select Avatar'}, (ret) => {
                                            if (ret.didCancel) {
                                                console.log('User cancelled image picker');
                                            }
                                            else if (ret.error) {
                                                console.log('ImagePicker Error: ', response.error);
                                            }
                                            else if (ret.customButton) {
                                                console.log('User tapped custom button: ', response.customButton);
                                            }
                                            else {
                                                //let source = { uri: ret.uri };

                                                // You can also display the image using data:
                                                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                                                ImageResizer.createResizedImage(ret.uri, 400, 400, 'JPEG', 50)
                                                    .then(value => {
                                                        //resize后所有图片的uri
                                                        resolve(value.uri);
                                                    })
                                                    .catch(err => {
                                                        reject(err);
                                                    })
                                            }
                                        });
                                    }
                                });
                            break;
                        case 'authorized':
                            ImagePick.launchCamera({title: 'Select Avatar'}, (ret) => {
                                if (ret.didCancel) {
                                    console.log('User cancelled image picker');
                                }
                                else if (ret.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                }
                                else if (ret.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                }
                                else {
                                    //let source = { uri: ret.uri };

                                    // You can also display the image using data:
                                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                                    ImageResizer.createResizedImage(ret.uri, 400, 400, 'JPEG', 50)
                                        .then(value => {
                                            //resize后所有图片的uri
                                            resolve(value.uri)
                                        })
                                        .catch(err => {
                                            reject(err);
                                        })
                                }
                            });
                            break;
                        default:
                            Alert.alert('Warm Tip', 'Camera permissions are not available', [
                                {
                                    text: 'Cancel'
                                },
                                {
                                    text: 'Go to setting',
                                    onPress: () => {
                                        DeviceOperate.openSetting();
                                    }
                                }
                            ]);
                    }
                });
        } else {
            Permission.checkCamera((status) => {
                switch (status) {
                    case 'authorized':
                        ImagePicker.openCamera({
                            width: 400,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            resolve(image.path);
                        }).catch(err => {
                            reject(err);
                        });
                        break;
                    case 'undetermined':
                        Permission.requestCamera((status) => {
                            switch (status) {
                                case 'authorized':
                                    ImagePicker.openCamera({
                                        width: 400,
                                        height: 400,
                                        cropping: true
                                    }).then(image => {
                                        resolve(image.path);
                                    }).catch(err => {
                                        reject(err);
                                    });
                                    break;
                                default:
                                    Alert.alert('Warm Tip', 'Camera permissions are not available', [
                                        {
                                            text: 'Cancel'
                                        },
                                        {
                                            text: 'Go to setting',
                                            onPress: () => {
                                                DeviceOperate.openSetting();
                                            }
                                        }
                                    ]);
                            }
                        });
                        break;
                    default:
                        Alert.alert('Warm Tip', 'Camera permissions are not available', [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'Go to setting',
                                onPress: () => {
                                    DeviceOperate.openSetting();
                                }
                            }
                        ]);
                }
            });
        }
    });
}

export function openPhotos(multiple = false) {
    return new Promise((resolve,reject)=>{
        if (Platform.OS !== 'android') {
            Permission.checkPhoto((status) => {
                switch (status) {
                    case 'authorized':
                        ImagePicker.openPicker({
                            multiple: multiple,
                        }).then(image => {
                            if (multiple) {
                                Promise.all(image.map((data, index) => {
                                    return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                }))
                                    .then(values => {
                                        resolve(values.map((img,index)=> img.uri));
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else {
                                ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 50)
                                    .then(value => {
                                        //resize后所有图片的uri
                                        resolve(value.uri)
                                    })
                                    .catch(err => {
                                        reject(err);
                                    })
                            }
                        }).catch(err => {
                            reject(err);
                        });
                        break;
                    case 'undtermined':
                        Permission.requestPhoto((sta) => {
                            if (sta === 'authorized') {
                                ImagePicker.openPicker({
                                    multiple: multiple,
                                }).then(image => {
                                    //Promise.all(image.map((data, index) => {
                                    if (multiple) {
                                        Promise.all(image.map((data, index) => {
                                            return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                        }))
                                            .then(values => {
                                                resolve(values.map((img,index)=> img.uri));
                                            })
                                            .catch(err => {
                                                reject(err);
                                            });
                                    } else {
                                        ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 50)
                                            .then(value => {
                                                //resize后所有图片的uri
                                                resolve(value.uri)
                                            })
                                            .catch(err => {
                                                reject(err);
                                            })
                                    }
                                }).catch(err => {
                                    reject(err);
                                });
                            } else {
                                Alert.alert('Warm Tip', 'Photo permissions are not available', [
                                    {
                                        text: 'Cancel'
                                    },
                                    {
                                        text: 'Go to setting',
                                        onPress: () => {
                                            DeviceOperate.openSetting();
                                        }
                                    }
                                ]);
                            }
                        });
                        break;
                    default:
                        Alert.alert('Warm Tip', 'Photo permissions are not available', [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'Go to setting',
                                onPress: () => {
                                    DeviceOperate.openSetting();
                                }
                            }
                        ]);
                }
            });
        } else {
            Permissions.check('photo').then(status => {
                switch (status) {
                    case 'undetermined':
                        Permissions.request('photo')
                            .then(response => {
                                if (response === 'authorized') {
                                    ImagePicker.openPicker({
                                        multiple: multiple,
                                    }).then(image => {
                                        if (multiple) {
                                            Promise.all(image.map((data, index) => {
                                                return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                            }))
                                                .then(values => {
                                                    resolve(values.map((img,index)=>img.uri));
                                                })
                                                .catch(err => {
                                                    reject(err);
                                                });
                                        } else {
                                            ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 50)
                                                .then(value => {
                                                    //resize后所有图片的uri
                                                    resolve(value.uri)
                                                })
                                                .catch(err => {
                                                    reject(err);
                                                })
                                        }
                                    }).catch(err => {
                                        reject(err);
                                    });
                                }
                            });
                        break;
                    case 'authorized':
                        ImagePicker.openPicker({
                            multiple: multiple,
                        }).then(image => {
                            //Promise.all(image.map((data, index) => {
                            if (multiple) {
                                Promise.all(image.map((data, index) => {
                                    return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                }))
                                    .then(values => {
                                        resolve(values.map((img,index)=>img.uri));
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else {
                                ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 50)
                                    .then(value => {
                                        //resize后所有图片的uri
                                        resolve(value.uri)
                                    })
                                    .catch(err => {
                                        reject(err);
                                    })
                            }
                        }).catch(err => {
                            reject(err);
                        });
                        break;
                    default:
                        Alert.alert('Warm Tip', 'Photo permissions are not available', [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'Go to setting',
                                onPress: () => {
                                    DeviceOperate.openSetting();
                                }
                            }
                        ]);
                }
            })
        }
    });

}