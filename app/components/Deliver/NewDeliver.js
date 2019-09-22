/**
 * Created by liuyu on 2017/11/4.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    NativeModules,
    Platform,
    StatusBar,
    Alert,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import ZIPText from '../ZIPText';
import ZIPTextInput from '../ZIPTextInput';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {connect} from 'react-redux';
import * as newDeliverActions from '../../actions/newDeliverAction';
import * as newDeliverDoneAction from '../../actions/newDeliverDoneAction';
import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import Hud from 'react-native-lyhud';
import {
    INSERT_DELIVER,
    UPLOAD_PHOTO,
} from '../../config/API';
import Md5 from '../../config/md5';
import CommonTextInput from '../CommonTextInput';

const {
    Permission,
    DeviceOperate
} = NativeModules;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor
    },
    imageContainer: {
        height: screenSize.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    infoTitleContainer: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white'
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.titleColor
    },
    boxContainer: {
        marginTop: 1,
        padding: 16,
        backgroundColor: 'white',
        borderBottomColor:'lightgray',
        borderBottomWidth:1,
    },
    boxItemContainer: {
        flexDirection: 'row',
        flexWrap:'wrap',
        marginTop: 8,
    },
    boxItem: {
        width: (screenSize.width - 64) / 3,
        height: (screenSize.width - 64) / 6 * 2,
        borderRadius: 2,
        borderColor: Color.bgColor,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        padding: 8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 1,
        height: 70,
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        width: screenSize.width - 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
    },
    nextButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:8,
        marginLeft:8,
        marginRight:8,
        borderRadius:3,
    },
    nextButtonText: {
        fontSize: 18
    }
});


class BoxView extends PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                activeOpacity={0.7}
                style={[
                    styles.boxItem,
                    {
                        backgroundColor: this.props.isSelect ? Color.themeColor : 'white'
                    }
                ]}
            >
                <Image
                    style={{
                        tintColor: this.props.isSelect ? 'white' : Color.themeColor,
                        //flex: 0.66,
                        width: (screenSize.width - 64) / 3,
                        height: (screenSize.width - 64) / 6 * 2 * 0.66,
                    }}
                    resizeMode={'center'}
                    source={this.props.image}
                />
                <ZIPText
                    style={{
                        fontSize: 14,
                        color: this.props.isSelect ? 'white' : 'black',
                        flex: 1
                    }}
                >
                    {this.props.title}
                </ZIPText>
            </TouchableOpacity>
        )
    }
}

BoxView.propTypes = {
    image: Image.propTypes.source.isRequired,
    // title: React.PropTypes.string.isRequired,
    // onPress: React.PropTypes.func.isRequired,
    // isSelect: React.PropTypes.bool
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isSelect: PropTypes.bool
};

BoxView.defaultProps = {
    isSelect: false,
};

class NewDeliver extends PureComponent {

    boxImages = [
        {
            image: require('../../assets/images/small.png'),
            title: 'SMALL',
        },
        {
            image: require('../../assets/images/middle.png'),
            title: 'MIDDLE',
        },
        {
            image: require('../../assets/images/large.png'),
            title: 'LARGE'
        }
    ];

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            barStyle: 'light-content',
            images: null,
            toZipcode: '',
            fromZipcode: '',
            phoneNum: '',
            email:'',
            hudType: 'none',
        };
    }

    componentDidMount() {
        this.props.getConfig();
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    openPhoto() {
        this.setState({
            barStyle: 'default',
        });
        if (Platform.OS !== 'android') {
            Permission.checkPhoto((status) => {
                switch (status) {
                    case 'authorized':
                        ImagePicker.openPicker({
                            multiple: true,
                        }).then(image => {
                            //Promise.all(image.map((data, index) => {
                            Promise.all(image.map((data, index) => {
                                return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                            }))
                                .then(values => {
                                    this.setState({
                                        barStyle: 'light-content',
                                    });
                                    this.props.navigator.push({
                                        screen: 'NewDeliverUploadImage',
                                        title: 'Upload photos',
                                        animationType: 'slide-horizontal',
                                        navigatorStyle: navigatorStyle,
                                        passProps: {
                                            images: values,
                                            setImages: (images) => {
                                                this.setState({
                                                    images,
                                                })
                                            }
                                        }
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({
                                        barStyle: 'light-content',
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
                        Permission.requestPhoto((sta) => {
                            if (sta === 'authorized') {
                                ImagePicker.openPicker({
                                    multiple: true,
                                }).then(image => {
                                    //Promise.all(image.map((data, index) => {
                                    Promise.all(image.map((data, index) => {
                                        return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                    }))
                                        .then(values => {
                                            this.setState({
                                                barStyle: 'light-content',
                                            });
                                            this.props.navigator.push({
                                                screen: 'NewDeliverUploadImage',
                                                title: 'Upload photos',
                                                animationType: 'slide-horizontal',
                                                navigatorStyle: navigatorStyle,
                                                overrideBackPress: true,
                                                passProps: {
                                                    images: values,
                                                    setImages: (images) => {
                                                        this.setState({
                                                            images,
                                                        })
                                                    }
                                                }
                                            })
                                        })
                                        .catch(err => {
                                            this.setState({
                                                barStyle: 'light-content',
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
            Permissions.check('photo').then(status => {
                switch (status) {
                    case 'undetermined':
                        Permissions.request('photo')
                            .then(response => {
                                if (response === 'authorized') {
                                    ImagePicker.openPicker({
                                        multiple: true,
                                    }).then(image => {
                                        Promise.all(image.map((data, index) => {
                                            return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                                        }))
                                            .then(values => {
                                                this.setState({
                                                    barStyle: 'light-content',
                                                });
                                                this.props.navigator.push({
                                                    screen: 'NewDeliverUploadImage',
                                                    title: 'Upload photos',
                                                    animationType: 'slide-horizontal',
                                                    navigatorStyle: navigatorStyle,
                                                    passProps: {
                                                        images: values,
                                                        setImages: (images) => {
                                                            this.setState({
                                                                images,
                                                            })
                                                        }
                                                    }
                                                })
                                            })
                                            .catch(err => {
                                                this.setState({
                                                    barStyle: 'light-content',
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
                            Promise.all(image.map((data, index) => {
                                return ImageResizer.createResizedImage(data.path, 800, 800, 'JPEG', 50)
                            }))
                                .then(values => {
                                    this.setState({
                                        barStyle: 'light-content',
                                    });
                                    this.props.navigator.push({
                                        screen: 'NewDeliverUploadImage',
                                        title: 'Upload photos',
                                        animationType: 'slide-horizontal',
                                        navigatorStyle: navigatorStyle,
                                        passProps: {
                                            images: values,
                                            setImages: (images) => {
                                                this.setState({
                                                    images,
                                                })
                                            }
                                        }
                                    })
                                })
                                .catch(err => {

                                    this.setState({
                                        barStyle: 'light-content',
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

    renderBoxModels() {
        const {
            loadingConfig,
            loadConfigError,
            boxModels,
            error,
            boxIndex,
        } = this.props;

        if (loadingConfig) {
            return (
                <View style={{padding: 8, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator color={Color.themeColor} size="small" animated={true}/>
                </View>
            )
        }

        if (loadConfigError) {
            return (
                <TouchableOpacity
                    style={{padding: 8, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => {
                        this.props.getConfig();
                    }}
                >
                    <ZIPText style={{color: Color.red}}>
                        Tap to reload package config
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        if (boxModels === null) {
            return null;
        }

        return (
            <View style={styles.boxItemContainer}>
                {
                    boxModels.map((data, index) => {
                        console.log(data.img);
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    Keyboard.dismiss();
                                    if (boxIndex !== index) {
                                        this.props.setBoxIndex(index);
                                    }
                                }}
                                style={{
                                    width: (screenSize.width - 64 - 16) / 3,
                                    height: 40,
                                    marginLeft:index % 3 !== 0 ? 16 : 0,
                                    marginTop:index / 3 >= 1 ? 8 : 0,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    backgroundColor:boxIndex === index ? Color.themeColor : 'white',
                                    borderColor:boxIndex === index ? 'transparent' : 'lightgray',
                                    borderWidth:1,
                                }}
                            >
                                <ZIPText style={{color:boxIndex === index ? 'white':Color.titleColor}}>
                                    {data.boxModelName}
                                </ZIPText>
                            </TouchableOpacity>
                        );
                        return (
                            <BoxView
                                key={index}
                                image={{uri: data.img}}
                                title={data.boxModelName}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    if (boxIndex !== index) {
                                        this.props.setBoxIndex(index);
                                    }
                                }}
                                isSelect={boxIndex === index}
                            />
                        )
                    })
                }
            </View>
        )
    }


    insertDeliver() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
            }, () => {
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let boxModelId = this.props.boxModels[this.props.boxIndex].boxModelId;

        if (this.state.images === null) {
            netWork(
                'GET',
                INSERT_DELIVER,
                'boxModelId=' + boxModelId +
                '&fromZipcode=' + this.state.fromZipcode +
                '&toZipcode=' + this.state.toZipcode +
                '&toPhone=' + this.state.phoneNum +
                '&toEmail=' + this.state.email,
                true)
                .then(json => {
                    this.setState({
                        hudType: 'success',
                    }, () => {
                        this.hud.show(json.msg, 1500);
                    });
                    this.props.setDeliverId(json.data.deliverId);
                    this.time = setTimeout(() => {
                        this.props.navigator.push({
                            screen: 'NewDeliverPay',
                            title: 'New Delivery',
                            navigatorStyle: navigatorStyle,
                            animationType: 'slide-horizontal',
                            passProps: {
                                deliverInfo: json.data,
                            },
                            overrideBackPress: true,
                        })
                    }, 1500);
                })
                .catch(err => {
                    if (err === 'Need bind credit card') {
                        this.props.navigator.push({
                            screen: 'BindCreditCard',
                            title: 'Bind Credit Card',
                            backButtonTitle: '',
                            navigatorStyle: navigatorStyle,
                            animationType: 'slide-horizontal',
                            fromWallet: true,
                        })
                    } else {
                        this.setState({
                            hudType: 'error',
                        }, () => {
                            this.hud.show(err, 1500);
                        });
                    }
                })
        } else {
            //上传图片
            this.hud.show('upload image');
            let formData = new FormData();
            this.state.images.map((data, index) => {
                const file = {uri: data.uri, type: 'multipart/form-data', name: Md5.digest_s(data.uri) + '.jpg'};
                formData.append(Md5.digest_s(data.uri), file);
            });
            netWork('POST', UPLOAD_PHOTO, formData, true)
                .then(photo => {
                    this.hud.show('insert deliver');
                    console.log(photo);
                    let photosIds = photo.data.succ.join(',');
                    netWork(
                        'GET',
                        INSERT_DELIVER,
                        'boxModelId=' + boxModelId +
                        '&fromZipcode=' + this.state.fromZipcode +
                        '&toZipcode=' + this.state.toZipcode +
                        '&toPhone=' + this.state.phoneNum + '&photoIds=' + photosIds,
                        true)
                        .then(json => {
                            this.setState({
                                hudType: 'success',
                            }, () => {
                                this.hud.show(json.msg, 1500);
                            });
                            this.props.setDeliverId(json.data.deliverId);
                            this.time = setTimeout(() => {
                                this.props.navigator.push({
                                    screen: 'NewDeliverPay',
                                    title: 'New Delivery',
                                    navigatorStyle: navigatorStyle,
                                    animationType: 'slide-horizontal',
                                    passProps: {
                                        deliverInfo: json.data
                                    },
                                    overrideBackPress: true,
                                })
                            }, 1500);
                        })
                        .catch(err => {
                            if (err === 'Need bind credit card') {
                                this.props.navigator.push({
                                    screen: 'BindCreditCard',
                                    title: 'Bind Credit Card',
                                    backButtonTitle: '',
                                    navigatorStyle: navigatorStyle,
                                    animationType: 'slide-horizontal',
                                    fromWallet: true,
                                })
                            } else {
                                this.setState({
                                    hudType: 'error',
                                }, () => {
                                    this.hud.show(err, 1500);
                                });
                            }
                        })
                })
                .catch(err => {
                    this.setState({
                        hudType: 'error',
                    }, () => {
                        this.hud.show(err, 1500);
                    })
                })

        }

    }

    render() {

        let btnDisable = true;
        if (this.props.boxIndex !== null &&
            this.state.toZipcode !== '' &&
            this.state.fromZipcode !== '' && (this.state.phoneNum !== '' || this.state.email !== ''))
        {
            btnDisable = false;
        }

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <StatusBar barStyle={this.state.barStyle} animated={true}/>
                <KeyboardAwareScrollView
                    style={{
                        flex: 1,
                        backgroundColor: Color.bgColor
                    }}
                    extraScrollHeight={70}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexDirection: 'column',
                        padding:8,
                    }}
                >
                    {
                        this.state.images === null ?
                            <TouchableOpacity
                                onPress={() => {
                                    this.openPhoto();
                                }}
                                activeOpacity={1}
                                style={styles.imageContainer}
                            >
                                <Image source={require('../../assets/images/shangchuan.png')}/>
                                <ZIPText style={{marginTop: 8}}>
                                    Upload package photo
                                </ZIPText>
                            </TouchableOpacity> :
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigator.push({
                                        screen: 'NewDeliverUploadImage',
                                        title: 'Upload photos',
                                        animationType: 'slide-horizontal',
                                        navigatorStyle: navigatorStyle,
                                        passProps: {
                                            images: this.state.images,
                                            setImages: (images) => {
                                                this.setState({
                                                    images,
                                                })
                                            },
                                            fromChange: true,
                                        },
                                        backButtonTitle: '',
                                    })
                                }}
                                style={styles.imageContainer}
                            >
                                <Image resizeMode={'cover'}
                                       style={{height: screenSize.width / 2, width: screenSize.width}}
                                       source={{uri: this.state.images[0].uri}}/>
                                <View
                                    style={{
                                        padding: 8,
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                    }}
                                >
                                    <ZIPText style={{color: 'white'}}>
                                        Change photos
                                    </ZIPText>
                                </View>
                            </TouchableOpacity>

                    }
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor:'white'
                        }}
                    >
                        <View
                            style={styles.infoTitleContainer}
                        >
                            <ZIPText style={styles.infoTitle}>
                                Delivery information
                            </ZIPText>
                        </View>
                        <View style={styles.boxContainer}>

                                <ZIPText style={{fontSize:16}}>
                                    Package size
                                </ZIPText>

                            {this.renderBoxModels()}
                        </View>
                        <CommonTextInput
                            leftTitle="From"
                            keyboardType="number-pad"
                            placeholder="Enter from zipcode"
                            placeholderTextColor={'lightgray'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.fromZipcode}
                            onChangeText={(text) => {
                                this.setState({
                                    fromZipcode: text,
                                })
                            }}
                        />
                        <CommonTextInput
                            leftTitle="To"
                            keyboardType="number-pad"
                            placeholder="Enter to zipcode"
                            placeholderTextColor={'lightgray'}
                            textStyle={{paddingLeft:8}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.toZipcode}
                            onChangeText={(text) => {
                                this.setState({
                                    toZipcode: text,
                                })
                            }}
                        />
                        <CommonTextInput
                            leftTitle="Email"
                            keyboardType="email-address"
                            placeholder="Enter Email address"
                            placeholderTextColor={'lightgray'}
                            textStyle={{paddingLeft:8}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.email}
                            onChangeText={(text)=>{
                                this.setState({
                                    email:text,
                                })
                            }}
                        />
                        <CommonTextInput
                            leftTitle="Phone"
                            keyboardType="number-pad"
                            placeholder="Enter mobile number"
                            placeholderTextColor={'lightgray'}
                            textStyle={{paddingLeft:8}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.phoneNum}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNum: text,
                                })
                            }}
                        />

                    </View>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            {
                                backgroundColor: btnDisable ? 'rgba(42,187,103,0.5)' : 'rgba(42,187,103,1)',
                            }
                        ]}
                        activeOpacity={1}
                        onPress={() => {
                            Keyboard.dismiss();
                            if (btnDisable) {
                                return;
                            }
                            this.insertDeliver();
                        }}
                    >
                        <ZIPText style={[styles.nextButtonText,{color: btnDisable ? 'rgba(255,255,255,0.3)': 'white'}]}>
                            Next
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

/*
loadingConfig,
    loadConfigError,
    boxModels,
    cargoTypes,
    error,
* */

export default connect(
    (state) => ({
        loadingConfig: state.newDeliver.loadingConfig,
        loadConfigError: state.newDeliver.loadConfigError,
        boxModels: state.newDeliver.boxModels,
        boxIndex: state.newDeliver.boxIndex,
    }),
    (dispatch) => ({
        getConfig: () => dispatch(newDeliverActions.getConfig()),
        setBoxIndex: (index) => dispatch(newDeliverActions.setBoxIndex(index)),
        setDeliverId: (deliverId) => dispatch(newDeliverDoneAction.setDeliverId(deliverId))
    })
)(NewDeliver)