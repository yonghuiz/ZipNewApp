/**
 * Created by liuyu on 2017/11/27.
 */
import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
    Keyboard,
    StatusBar,
} from 'react-native'
import ZIPText from '../ZIPText'
import ZIPTextInput from '../ZIPTextInput'
import Icon from 'react-native-vector-icons/Ionicons'
import Hud from 'react-native-lyhud'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Animatable from 'react-native-animatable'
import CommonTextInput from '../CommonTextInput'
import {
    LOGIN_REGISTER,
    CHECK_VCODE,
    GET_VCODE,
} from '../../config/API'
import { Navigation } from 'react-native-navigation'
import Md5 from '../../config/md5'

export default class Register extends PureComponent {

    signing = false;
    constructor(props) {
        super(props);
        this.state = {
            useEmail: true,

            email: '',
            password: '',
            confirmPassword: '',

            phoneNum: '',
            vId: '',
            vCode: '',

            hudType: 'none',

            showCount: false,
            count: 59,
            canSendVCode: true,

            region: {
                "Countries and Regions": "United States of America",
                "chinese": "美国",
                "country": "US",
                "code": "1"
            },
        }
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
        this.interval && clearInterval(this.interval);
    }

    _renderNameContainer() {
        return (
            <View
                style={{
                    height: 70,
                    flexDirection: 'row',
                }}
            >
                <View style={{ flex: 1, marginRight: 8, flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <View
                        style={{
                            height: 50,
                            width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: 'lightgray',
                            flexDirection: 'row'
                        }}
                    >
                        <View style={{ width: 95, height: 50, justifyContent: 'center', paddingLeft: 8 }}>
                            <ZIPText style={{ fontSize: 16 }}>
                                Name
                            </ZIPText>
                        </View>
                        <ZIPTextInput
                            style={{ flex: 1 }}
                            placeholder={'John Appleseed'}
                            placeholderTextColor={'lightgray'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>
                <View
                    style={{
                        height: 70,
                        width: 70,
                        backgroundColor: 'lightgray',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name="ios-camera" color="white" size={30} />
                </View>
            </View>
        )
    }

    signInButtonColor() {
        if (this.state.useEmail) {
            if (this.state.email.length !== 0 && this.state.password.length !== 0 && this.state.confirmPassword.length !== 0) {
                return 'rgba(42,187,103,1)'
            } else {
                return 'rgba(42,187,103,0.5)'
            }
        } else {
            if (this.state.phoneNum.length !== 0 && this.state.vCode.length !== 0 && this.state.vId.length !== 0) {
                return 'rgba(42,187,103,1)'
            } else {
                return 'rgba(42,187,103,0.5)'
            }
        }
    }

    signInTextColor() {
        if (this.state.useEmail) {
            if (this.state.email.length !== 0 && this.state.password.length !== 0 && this.state.confirmPassword.length !== 0) {
                return 'white'
            } else {
                return 'rgba(255,255,255,0.3)'
            }
        } else {
            if (this.state.phoneNum.length !== 0 && this.state.vCode.length !== 0 && this.state.vId.length !== 0) {
                return 'white'
            } else {
                return 'rgba(255,255,255,0.3)'
            }
        }
    }

    sendVCode() {
        if (this.state.phoneNum.length === 0) {
            if (this.state.hudType !== 'error') {
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show('Please Enter mobile number', 2000);
                });
            } else {
                this.hud.show('Please Enter mobile number', 2000);
            }
            return;
        }

        this.setState({
            canSendVCode: false,
        });
        this.hud.show('Sending verify code...');
        let param = new FormData();
        param.append('phone', this.state.phoneNum);
        netWork('POST', GET_VCODE, param, false)
            .then(json => {
                this.setState({
                    showCount: true,
                    count: 59,
                    vId: json.data.vid,
                });
                this.interval = setInterval(() => {
                    if (this.state.count === 1) {
                        this.setState({
                            showCount: false,
                            canSendVCode: true,
                        });
                        clearInterval(this.interval);
                    }
                    this.setState({
                        count: this.state.count - 1,
                    })
                }, 1000);
                this.setState({
                    hudType: 'success'
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
            })
            .catch(err => {
                this.setState({
                    canSendVCode: true,
                });
                this.hud.show(err, 1500);
            })
    }

    signUpWithEmail() {
        this.signing = true;
        if (this.state.hudType === 'none') {
            this.hud.show('please wait');
        } else {
            this.setState({
                hudType: 'none'
            }, () => {
                this.hud.show('Please wait');
            })
        }

        let formData = new FormData();

        formData.append('email', this.state.email);
        formData.append('psd1', Md5.digest_s(this.state.password));
        formData.append('psd2', Md5.digest_s(this.state.confirmPassword));

        netWork('POST', LOGIN_REGISTER, formData, false)
            .then(json => {
                this.signing = false;
                userInfo.accessToken = json.data.accessToken;
                userInfo.memberId = json.data.memberId;
                userInfo.psd = json.data.psd;
                this.setState({
                    hudType: 'success',
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
                this.time = setTimeout(() => {
                    Navigation.push(this.props.componentId, {
                        component: {
                            name: 'AddAddress',

                            options: {
                                topBar: {
                                    title: {
                                        text: 'Add a delivery address',
                                    }
                                }
                            }
                        }
                    });
                    // this.props.navigator.push({
                    //     screen: 'AddAddress',
                    //     title: 'Add a delivery address',
                    //     animationType: 'slide-horizontal',
                    //     navigatorStyle: navigatorStyle,
                    // })
                }, 1500);
            })
            .catch(err => {
                this.signing = false;
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 1500);
                })
            })
    }

    signUpWithPhone() {
        this.signing = true;
        if (this.state.hudType === 'none') {
            this.hud.show('please wait');
        } else {
            this.setState({
                hudType: 'none'
            }, () => {
                this.hud.show('Please wait');
            })
        }

        let formData = new FormData();
        formData.append('phone', this.state.phoneNum);
        formData.append('vid', this.state.vId);
        formData.append('vcode', this.state.vCode);

        netWork('POST', CHECK_VCODE, formData, false)
            .then(json => {
                this.signing = false;
                this.setState({
                    hudType: 'success',
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
                this.timeout = setTimeout(() => {
                    userInfo.accessToken = json.data.accessToken;
                    userInfo.memberId = json.data.memberId;
                    userInfo.psd = json.data.psd;
                    if (json.data.statusDetail.hasBindAddress == 0) {
                        Navigation.push(this.props.componentId, {
                            component: {
                                name: 'AddAddress',

                                options: {
                                    topBar: {
                                        title: {
                                            text: 'Add a delivery address',
                                        }
                                    }
                                }
                            }
                        });
                        // this.props.navigator.push({
                        //     screen: 'AddAddress',
                        //     title: 'Add a delivery address',
                        //     animationType: 'slide-horizontal',
                        //     navigatorStyle: navigatorStyle,
                        // })
                    } else {
                        if (json.data.serviceMode == null) {
                            Navigation.push(this.props.componentId, {
                                component: {
                                    name: 'ChooseModel',

                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'Choose your use model',
                                            }
                                        }
                                    }
                                }
                            });

                            // this.props.navigator.push({
                            //     screen: 'ChooseModel',
                            //     title: 'Choose your use model',
                            //     backButtonTitle: 'Back',
                            //     animationType: 'slide-horizontal',
                            //     navigatorStyle: navigatorStyle,
                            // });
                        } else {
                            storage.save({
                                key: 'isLogin',
                                data: true,
                                expires: null,
                            });
                            storage.save({
                                key: 'userInfo',
                                data: {
                                    accessToken: userInfo.accessToken,
                                    memberId: userInfo.memberId,
                                    psd: userInfo.psd,
                                },
                                expires: null,
                            });
                            storage.save({
                                key: 'serviceMode',
                                data: json.data.serviceMode,
                                expires: null,
                            });
                            if (json.data.serviceMode === 'ziplocker') {
                                Navigation.setRoot({
                                    root: {
                                        stack: {
                                            id: 'Stack.Home3',
                                            children: [
                                                {
                                                    component: {
                                                        id: 'ZipLockerHome',
                                                        name: 'ZipLockerHome',
                                                    },
                                                },
                                            ],
                                        }
                                    }
                                });
                                // Navigation.startSingleScreenApp({
                                //     screen: {
                                //         screen: 'ZipLockerHome',
                                //         navigatorStyle: navigatorStyle,
                                //     },
                                //     appStyle: {
                                //         orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                                //         hideBackButtonTitle: true
                                //     },
                                //     drawer: {
                                //         left: { // optional, define if you want a drawer from the left
                                //             screen: 'DrawerScreen',
                                //         },
                                //         style: {
                                //             drawerShadow: false,
                                //             leftDrawerWidth: 60,
                                //             contentOverlayColor: 'rgba(0,0,0,0.25)',
                                //         },
                                //         disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                                //     },
                                //     animationType: 'fade',
                                // });

                            } else {
                                Navigation.setRoot({
                                    root: {
                                        stack: {
                                            id: 'Stack.Home2',
                                            children: [
                                                {
                                                    component: {
                                                        id: 'ZipporaHome',
                                                        name: 'ZipporaHome',
                                                    },
                                                },
                                            ],
                                        }
                                    }
                                });
                                // Navigation.startSingleScreenApp({
                                //     screen: {
                                //         screen: 'ZipporaHome',
                                //         navigatorStyle: navigatorStyle,
                                //     },
                                //     appStyle: {
                                //         orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                                //         hideBackButtonTitle: true
                                //     },
                                //     drawer: {
                                //         left: { // optional, define if you want a drawer from the left
                                //             screen: 'DrawerScreen',
                                //         },
                                //         style: {
                                //             drawerShadow: false,
                                //             leftDrawerWidth: 60,
                                //             contentOverlayColor: 'rgba(0,0,0,0.25)',
                                //         },
                                //         disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                                //     },
                                //     animationType: 'fade'
                                // })
                            }
                        }
                    }
                }, 1500);
            })
            .catch(err => {
                this.signing = false;
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 1500);
                })
            })

    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle="light-content" animated={true} />
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        padding: 8,
                    }}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {/*{this._renderNameContainer()}*/}
                    {
                        this.state.useEmail ?
                            <Animatable.View
                                ref={r => this.emailView = r}
                                style={{
                                    height: 150,
                                    flexDirection: 'column'
                                }}
                            >
                                <CommonTextInput
                                    leftTitle="Email"
                                    placeholder={'Enter E-mail address'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.email}
                                    keyboardType="email-address"
                                    onChangeText={(text) => {
                                        this.setState({
                                            email: text,
                                        })
                                    }}
                                />
                                <CommonTextInput
                                    leftTitle="Password"
                                    placeholder={'Enter Password'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    value={this.state.password}
                                    onChangeText={(text) => {
                                        this.setState({
                                            password: text,
                                        })
                                    }}
                                />
                                <CommonTextInput
                                    leftTitle="Confirm"
                                    placeholder={'Confirm Password'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    value={this.state.confirmPassword}
                                    onChangeText={(text) => {
                                        this.setState({
                                            confirmPassword: text,
                                        })
                                    }}
                                />
                            </Animatable.View> :
                            <Animatable.View
                                ref={r => this.phoneView = r}
                                style={{
                                    height: 100,
                                    flexDirection: 'column'
                                }}
                            >
                                {/*<TouchableOpacity*/}
                                {/*activeOpacity={1}*/}
                                {/*onPress={()=>{*/}
                                {/*this.props.navigator.push({*/}
                                {/*screen:'CountryPick',*/}
                                {/*title:'Select Region',*/}
                                {/*navigatorStyle:navigatorStyle,*/}
                                {/*animationType:'slide-horizontal',*/}
                                {/*passProps:{*/}
                                {/*selectRegion:(region)=>{*/}
                                {/*this.setState({*/}
                                {/*region,*/}
                                {/*})*/}
                                {/*}*/}
                                {/*}*/}
                                {/*})*/}
                                {/*}}*/}
                                {/*style={{*/}
                                {/*flex:1,*/}
                                {/*borderBottomWidth: 1,*/}
                                {/*borderBottomColor: 'lightgray',*/}
                                {/*flexDirection: 'row',*/}
                                {/*alignItems: 'center',*/}
                                {/*}}*/}
                                {/*>*/}
                                {/*<ZIPText style={{fontSize: 16, flex: 1, paddingLeft: 8}}>*/}
                                {/*Region*/}
                                {/*</ZIPText>*/}
                                {/*<ZIPText style={{fontSize: 16, paddingRight: 8, color: Color.themeColor}}>*/}
                                {/*{`${this.state.region["Countries and Regions"]}(+${this.state.region.code})`}*/}
                                {/*</ZIPText>*/}
                                {/*</TouchableOpacity>*/}
                                <CommonTextInput
                                    leftTitle="Phone"
                                    placeholder={'Enter mobile number (optional)'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.props.phoneNum}
                                    keyboardType={'numeric'}
                                    onChangeText={(text) => {
                                        let phoneNum = text.replace(/[^0-9]/g, '');
                                        this.setState({
                                            phoneNum,
                                        })
                                    }}
                                />
                                <CommonTextInput
                                    leftTitle="SMS Code"
                                    rightTitle={this.state.showCount ? `Resend after ${this.state.count}s` : 'Send'}
                                    onRightClick={() => {
                                        if (this.state.canSendVCode) {
                                            this.sendVCode();
                                        }
                                    }}
                                    placeholder={'Enter verification code'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'numeric'}
                                    value={this.state.vCode}
                                    onChangeText={(text) => {
                                        let vCode = text.replace(/[^0-9]/g, '');
                                        this.setState({
                                            vCode,
                                        })
                                    }}
                                />
                            </Animatable.View>
                    }
                    <ZIPText
                        style={{ color: Color.themeColor, marginTop: 8, marginLeft: 8, fontSize: 16 }}
                        onPress={() => {
                            Keyboard.dismiss();
                            this.setState({
                                useEmail: !this.state.useEmail,
                            }, () => {
                                if (this.state.useEmail) {
                                    this.emailView.slideInRight(500);
                                } else {
                                    this.phoneView.slideInRight(500);
                                }
                            })
                        }}
                    >
                        Use {this.state.useEmail ? 'Mobile number' : 'Email'} to register
                    </ZIPText>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            backgroundColor: this.signInButtonColor(),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            marginTop: 16,
                        }}
                        activeOpacity={1}
                        onPress={() => {
                            Keyboard.dismiss();
                            if (this.signInButtonColor() === 'rgba(42,187,103,0.5)') {
                                return;
                            }
                            if (!this.signing) {
                                if (this.state.useEmail) {
                                    this.signUpWithEmail();
                                } else {
                                    this.signUpWithPhone();
                                }
                            }
                        }}
                    >
                        <ZIPText
                            style={{
                                fontSize: 18,
                                color: this.signInTextColor()
                            }}
                        >
                            Sign Up
                        </ZIPText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            Navigation.push(this.props.componentId, {
                                component: {
                                    name: 'NewRegister',

                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'Sign Up',
                                            }
                                        }
                                    }
                                }
                            });
                            // this.props.navigator.push({
                            //     screen: 'NewRegister',
                            //     title: 'Sign Up',
                            //     navigatorStyle: navigatorStyle,
                            //     animationType: 'slide-horizontal',
                            // });
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 8,
                        }}
                    >
                        <ZIPText
                            style={{
                                fontSize: 15,
                                color: Color.red
                            }}
                        >
                            Already registered in the apartment
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <Hud ref={r => this.hud = r} hudType={this.state.hudType} />
            </View>
        )
    }
}

