/**
 * Created by liuyu on 2017/11/7.
 */
import React, {PureComponent} from 'react'
import {
    View,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ImageBackground,
    Alert,
    NativeModules,
    Platform,
} from 'react-native'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/Ionicons'
import Permissions from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'
const {
    Permission,
    DeviceOperate
} = NativeModules;

export default class NewDeliverUploadImage extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
        };
        if (props.fromChange !== true) {
            Icon.getImageSource('ios-close', 40, 'white').then(image => {
                props.navigator.setButtons({
                    leftButtons: [
                        {
                            icon: image,
                            id: 'closeButton'
                        }
                    ]
                })
            });
            props.navigator.setOnNavigatorEvent((event) => {
                this.onNavigatorEvent(event)
            });
            props.navigator.setStyle({
                disabledBackGesture:true,
            })
        }
    }

    componentWillUnmount() {
        console.log('didunmount');
        this.props.navigator.setStyle({
            disabledBackGesture:false,
        })
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'closeButton') {
                Alert.alert(
                    'Exit upload',
                    'After exit, this operation will not be saved, whether to exit?',
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                Navigation.pop(this.props.componentId);
                               // this.props.navigator.pop();
                            }
                        }
                    ]
                );
            }
        }
    }

    openPhoto() {
        this.setState({
            barStyle:'default',
        });
        if (Platform.OS !== 'android') {
            Permission.checkPhoto((status)=>{
                switch (status) {
                    case 'authorized':
                        ImagePicker.openPicker({
                            multiple: true,
                        }).then(image => {
                            //Promise.all(image.map((data, index) => {
                            Promise.all(image.map((data,index)=>{
                                return ImageResizer.createResizedImage(data.path,800,800,'JPEG',50)
                            }))
                                .then(values=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    });
                                    console.log(values);
                                    this.setState({
                                        images:[...this.state.images,...values],
                                    })
                                })
                                .catch(err=>{
                                    console.log(err);
                                    this.setState({
                                        barStyle:'light-content',
                                    })
                                });
                        }).catch(err => {
                            console.log(err);
                            this.setState({
                                barStyle: 'light-content'
                            });
                        });
                        break;
                    case 'undtermined':
                        Permission.requestPhoto((sta)=>{
                            if (sta === 'authorized') {
                                ImagePicker.openPicker({
                                    multiple: true,
                                }).then(image => {
                                    //Promise.all(image.map((data, index) => {
                                    Promise.all(image.map((data,index)=>{
                                        return ImageResizer.createResizedImage(data.path,800,800,'JPEG',50)
                                    }))
                                        .then(values=>{
                                            this.setState({
                                                barStyle:'light-content',
                                            });
                                            console.log(values);
                                            this.setState({
                                                images:[...this.state.images,...values],
                                            })
                                        })
                                        .catch(err=>{
                                            this.setState({
                                                barStyle:'light-content',
                                            })
                                        });
                                }).catch(err => {
                                    this.setState({
                                        barStyle: 'light-content'
                                    });
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
            Permissions.check('photo').then(status=>{
                switch (status) {
                    case 'undetermined':
                        Permissions.request('photo')
                            .then(response => {
                                if (response === 'authorized') {
                                    ImagePicker.openPicker({
                                        multiple: true,
                                    }).then(image => {
                                        Promise.all(image.map((data,index)=>{
                                            return ImageResizer.createResizedImage(data.path,800,800,'JPEG',50)
                                        }))
                                            .then(values=>{
                                                this.setState({
                                                    barStyle:'light-content',
                                                });
                                                console.log(values);
                                                this.setState({
                                                    images:[...this.state.images,...values],
                                                })
                                            })
                                            .catch(err=>{
                                                this.setState({
                                                    barStyle:'light-content',
                                                })
                                            });
                                    }).catch(err => {
                                        this.setState({
                                            barStyle: 'light-content'
                                        });
                                    });
                                }
                            });
                        break;
                    case 'authorized':
                        ImagePicker.openPicker({
                            multiple: true,
                        }).then(image => {
                            //Promise.all(image.map((data, index) => {
                            Promise.all(image.map((data,index)=>{
                                return ImageResizer.createResizedImage(data.path,800,800,'JPEG',50)
                            }))
                                .then(values=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    });
                                    console.log(values);
                                    this.setState({
                                        images:[...this.state.images,...values],
                                    })
                                })
                                .catch(err=>{

                                    this.setState({
                                        barStyle:'light-content',
                                    })
                                });
                        }).catch(err => {
                            this.setState({
                                barStyle: 'light-content'
                            });
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
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: 10
                    }}
                >
                    {
                        this.state.images.map((data, index) => {
                            if (index === 0) {
                                return (
                                    <ImageBackground
                                        key="0"
                                        style={{
                                            width: screenSize.width - 20,
                                            height: (screenSize.width - 20) / 2
                                        }}
                                        source={{uri: data.uri}}
                                    >
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={() => {
                                                //删除一张照片
                                                let images = [...this.state.images];
                                                images.splice(index,1);
                                                this.setState({
                                                    images,
                                                },()=>{
                                                    if (images.length === 0) {
                                                        Navigation.pop(this.props.componentId);
                                                      //  this.props.navigator.pop();
                                                    }
                                                });
                                            }}
                                        >
                                            <Icon
                                                name="ios-close-circle-outline"
                                                color="white"
                                                size={30}
                                                style={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                        </TouchableHighlight>
                                    </ImageBackground>
                                )
                            }
                            return (
                                <ImageBackground
                                    key={index}
                                    style={{
                                        width: (screenSize.width - 40) / 3,
                                        height: (screenSize.width - 40) / 4,
                                        marginTop: 10,
                                        marginLeft: (index - 1) % 3 !== 0 ? 10 : 0,
                                    }}
                                    source={{uri: data.uri}}
                                >
                                    <TouchableHighlight
                                        underlayColor={'transparent'}
                                        onPress={()=>{
                                            //删除照片
                                            let images = [...this.state.images];
                                            images.splice(index,1);
                                            this.setState({
                                                images,
                                            })
                                        }}
                                    >
                                    <Icon
                                        name="ios-close-circle-outline"
                                        color="white"
                                        size={30}
                                        style={{
                                            position: 'absolute',
                                            top: 2,
                                            right: 2,
                                            backgroundColor: 'transparent'
                                        }}
                                    />
                                    </TouchableHighlight>
                                </ImageBackground>
                            )
                        })
                    }
                    <TouchableOpacity
                        style={{
                            width: (screenSize.width - 40) / 3,
                            height: (screenSize.width - 40) / 4,
                            marginTop: 10,
                            marginLeft: (this.state.images.length - 1) % 3 !== 0 ? 10 : 0,
                            backgroundColor: Color.bgColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={1}
                        onPress={()=>{
                            //添加照片
                            this.openPhoto();
                        }}
                    >
                        <Icon name="ios-add-circle" color="white" size={30}/>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.setImages(this.state.images);
                        this.props.navigator.pop()
                    }}
                    style={{
                        height: 50,
                        backgroundColor: Color.themeColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ZIPText style={{color: 'white', fontSize: 18}}>
                        Done
                    </ZIPText>
                </TouchableOpacity>
            </View>
        )
    }
}