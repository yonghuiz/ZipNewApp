/**
 * Created by liuyu on 2017/5/15.
 */
import React, { PureComponent } from 'react'
import {
    View,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Keyboard,
    NativeModules,
    Image,
    StatusBar,
} from 'react-native'
import Md5 from '../../config/md5'
import Icon from 'react-native-vector-icons/Ionicons'
import SplashScreen from 'react-native-splash-screen'

import Hud from 'react-native-lyhud'
import {
    GET_VCODE,
    CHECK_VCODE,
    LOGIN_LOGIN
} from '../../config/API'
import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view'
import ZIPText from '../ZIPText'
import { Navigation } from 'react-native-navigation'
import * as Animatable from 'react-native-animatable'
import CommonTextInput from '../CommonTextInput'
// rz const appPackage = require('../../../package.json')
const appPackage = require('../../../version.json')
import { repeatPress } from '../RepeatPress'

const styles = StyleSheet.create({
    phoneNumContainer: {
        width: screenSize.width - 48,
        height: 40,
        borderColor: 'lightgray',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 48,
    },
    vCodeContainer: {
        width: screenSize.width - 48,
        height: 40,
        marginTop: 20,
        flexDirection: 'row',
        borderColor: 'lightgray',
        borderBottomWidth: 1,
    },
    vCodeInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        width: screenSize.width,
        height: screenSize.height - navBarHeight,
        alignItems: 'center',
        flexDirection: 'column'
    },
    sendCodeButton: {
        width: 100,
        height: 30,
        backgroundColor: 'white',
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Color.themeColor,
    },
    loginButton: {
        width: screenSize.width - 48,
        marginTop: 50,
        marginLeft: 0,
        marginRight: 0
    }
});

export default class Login extends PureComponent {
    loginEnable = true;

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            useEmail: true,

            email: '',
            password: '',

            phoneNum: '',
            phonePsd: '',

            region: {
                "Countries and Regions": "United States of America",
                "chinese": "美国",
                "country": "US",
                "code": "1"
            },

            textOnly: false,
            hudType: 'none',

            showCount: false,
            count: 59,
            canSendVCode: true,
        }
        Navigation.events().bindComponent(this);
    }

    componentDidMount() {
        SplashScreen.hide();
        haveAlertLogin = false;
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.interval && clearInterval(this.interval);
    }

    sendVCode() {
        if (this.state.phoneNum.length === 0) {
            this.setState({
                textOnly: true,
            }, () => {
                this.hud.show('Please enter a Mobile number', 2000);
            });
            return;
        }

        this.setState({
            canSendVCode: false,
            textOnly: true,
        });
        this.hud.show('sending verify code...');
        let param = new FormData();
        param.append('phone', this.state.phoneNum);
        netWork('POST', GET_VCODE, param, false)
            .then(json => {
                console.log(json);
                if (json.ret !== 0) {
                    this.setState({
                        canSendVCode: true,
                        textOnly: true,
                    })
                } else {
                    this.setState({
                        showCount: true,
                        count: 59,
                        textOnly: true,
                        vid: json.data.vid,
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
                }
                this.hud.show(json.msg, 2000);
            })
            .catch(err => {
                this.setState({
                    canSendVCode: true,
                });
                this.hud.show(err, 2000);
            })
    }

    login() {
        this.loginEnable = false;
        if (this.state.phoneNum.length === 0 ||
            this.state.vCode.length === 0 ||
            this.state.vid.length === 0) {
            return;
        }

        this.state.textOnly && this.setState({
            textOnly: false,
        });
        this.hud.show();
        let param = new FormData();
        param.append('phone', this.state.phoneNum);
        param.append('vid', this.state.vid);
        param.append('vcode', this.state.vCode);
        netWork('POST', CHECK_VCODE, param, false)
            .then(json => {
                if (json.ret === 0) {
                    this.setState({
                        hudType: 'success'
                    }, () => {
                        this.hud.show('success', 1500);
                    });
                    this.timeout = setTimeout(() => {
                        this.loginEnable = true;
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
                                                text: 'Add a delivery address'
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
                                                    text: 'Choose your use model'
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
                                    // screen: {
                                    //     screen: 'ZipLockerHome',
                                    //     navigatorStyle: navigatorStyle,
                                    // },
                                    // appStyle: {
                                    //     orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                                    //     hideBackButtonTitle: true
                                    // },
                                    // drawer: {
                                    //     left: { // optional, define if you want a drawer from the left
                                    //         screen: 'DrawerScreen',
                                    //     },
                                    //     style: {
                                    //         drawerShadow: false,
                                    //         leftDrawerWidth: 60,
                                    //         contentOverlayColor: 'rgba(0,0,0,0.25)',
                                    //     },
                                    //     disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                                    // },
                                    // animationType: 'fade',


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
                                    // screen: {
                                    //     screen: 'ZipporaHome',
                                    //     navigatorStyle: navigatorStyle,
                                    // },
                                    // appStyle: {
                                    //     orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                                    //     hideBackButtonTitle: true
                                    // },
                                    // drawer: {
                                    //     left: { // optional, define if you want a drawer from the left
                                    //         screen: 'DrawerScreen',
                                    //     },
                                    //     style: {
                                    //         drawerShadow: false,
                                    //         leftDrawerWidth: 60,
                                    //         contentOverlayColor: 'rgba(0,0,0,0.25)',
                                    //     },
                                    //     disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                                    // },
                                    // animationType: 'fade'

                                }
                            }
                        }
                    }, 1500);
                }
            })
            .catch(err => {
                this.loginEnable = true;
                this.setState({
                    hudType: 'error'
                }, () => {
                    this.hud.show(err, 2000);
                });
            })
    }

    loginButtonColor() {
        if (this.state.useEmail) {
            if (this.state.email.length !== 0 && this.state.password.length !== 0) {
                return 'rgba(42,187,103,1)'
            } else {
                return 'rgba(42,187,103,0.5)'
            }
        } else {
            if (this.state.phoneNum.length !== 0 && this.state.phonePsd.length !== 0) {
                return 'rgba(42,187,103,1)'
            } else {
                return 'rgba(42,187,103,0.5)'
            }
        }
    }

    loginTextColor() {
        if (this.state.useEmail) {
            if (this.state.email.length !== 0 && this.state.password.length !== 0) {
                return 'white'
            } else {
                return 'rgba(255,255,255,0.3)'
            }
        } else {
            if (this.state.phoneNum.length !== 0 && this.state.phonePsd.length !== 0) {
                return 'white'
            } else {
                return 'rgba(255,255,255,0.3)'
            }
        }
    }

    /*
        oldVersionUI(){
            return (
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        style={{flex: 1}}
                        keyboardShouldPersistTaps={'handled'}
                        extraScrollHeight={60}
                    >
                        <View style={styles.contentContainer}>
                            <Image style={{marginTop: 80}} source={require('../../assets/images/logo.png')}/>
                            <View style={styles.phoneNumContainer}>
                                <Icon
                                    name="ios-phone-portrait"
                                    type="ionicon"
                                    color={Color.themeColor}
                                    iconStyle={{marginLeft: 8}}
                                />
                                <ZIPTextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 8,
                                        color: 'gray',
                                        fontSize: 13,
                                    }}
                                    placeholder={'Mobile Number'}
                                    placeholderTextColor={'gray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.phoneNum}
                                    keyboardType={'phone-pad'}
                                    onBlur={() => {
                                        if (this.state.phoneNum.length !== 10 && this.state.phoneNum.length !== 11) {
                                            if (!this.state.phoneNumError) {
                                                this.setState({
                                                    phoneNumError: true,
                                                })
                                            }
                                        }
                                    }}
                                    maxLength={11}
                                    onChangeText={(text) => {
                                        let phoneNum = text.replace(/[^0-9]/g, '');
                                        if (phoneNum.length === 10 || phoneNum.length === 11) {
                                            if (this.state.phoneNumError) {
                                                this.setState({
                                                    phoneNumError: false,
                                                    phoneNum,
                                                })
                                            } else {
                                                this.setState({
                                                    phoneNum,
                                                })
                                            }
                                        } else {
                                            this.setState({
                                                phoneNum,
                                            })
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.vCodeContainer}>
                                <View style={styles.vCodeInputContainer}>
                                    <Icon
                                        name="shield-outline"
                                        color={Color.themeColor}
                                        iconStyle={{marginLeft: 4}}
                                        type="material-community"
                                        size={18}
                                    />
                                    <ZIPTextInput
                                        style={{
                                            flex: 1,
                                            marginLeft: 4,
                                            color: 'gray',
                                            fontSize: 13,
                                        }}
                                        placeholder={'Verify Code'}
                                        placeholderTextColor={'gray'}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        underlineColorAndroid={'transparent'}
                                        value={this.state.vCode}
                                        onChangeText={(text) => {
                                            const num = /^\d*$/;
                                            if (!num.exec(text)) {
                                                let vCode = text.substr(0, text.length - 1);
                                                this.setState({
                                                    vCode,
                                                })
                                            } else {
                                                this.setState({
                                                    vCode: text,
                                                })
                                            }
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.sendCodeButton}
                                    onPress={() => {
                                        if (this.state.canSendVCode) {
                                            Keyboard.dismiss();
                                            this.sendVCode();
                                        }
                                    }}
                                >
                                    <ZIPText style={{fontSize: 12, color: Color.themeColor}}>
                                        {
                                            this.state.showCount ? `${this.state.count}s` : 'Get verify Code'
                                        }
                                    </ZIPText>
                                </TouchableOpacity>
                            </View>
                            <TouchableHighlight
                                style={{marginTop: 8}}
                                onPress={() => {
                                    this.props.navigator.push({
                                        screen: 'Register',
                                        title: 'Register',
                                        navigatorStyle: navigatorStyle,
                                        animationType: 'slide-horizontal',
                                    });
                                    return;
                                    if (this.state.vid.length === 0) {
                                        this.setState({
                                            textOnly: true,
                                        }, () => {
                                            this.hud.show('Please field phone number and get verify code', 2000);
                                        });
                                        return;
                                    }
                                    if (this.loginEnable) {
                                        this.login();
                                    }
                                }}
                                underlayColor={'transparent'}
                            >
                                <Image
                                    source={require('../../assets/images/loginBtn.png')}
                                    resizeMode={'contain'}
                                    style={
                                        this.state.vid.length === 0 ?
                                            {
                                                width: screenSize.width / 2 + 40,
                                                height: 70,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                tintColor: 'lightgray'
                                            } :
                                            {
                                                width: screenSize.width / 2 + 40,
                                                height: 70,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }
                                    }
                                >
                                    <ZIPText style={{color: 'white', fontWeight: '700'}}>
                                        LOGIN
                                    </ZIPText>
                                </Image>
                            </TouchableHighlight>
                        </View>
                    </KeyboardAwareScrollView>
                    <Hud
                        hudType={this.state.hudType}
                        textOnly={this.state.textOnly}
                        ref={(r) => {
                            this.hud = r
                        }}
                    />
                </View>
            )
        }
    */
    loginWithEmail() {
        this.loginEnable = false;
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
                textOnly: false,
            }, () => {
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let param = new FormData();
        param.append("email", this.state.email);
        param.append('psd', Md5.digest_s(this.state.password));

        netWork('POST', LOGIN_LOGIN, param, false)
            .then(json => {
                this.setState({
                    hudType: 'success'
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
                this.timeout = setTimeout(() => {
                    this.loginEnable = true;
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
                                            text: 'Add a delivery address'
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
                        //Navigation.startSingleScreenApp({

                        // screen: {
                        //     screen: 'ZipporaHome',
                        //     navigatorStyle: navigatorStyle,
                        // },
                        // appStyle: {
                        //     orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                        //     hideBackButtonTitle: true
                        // },
                        // drawer: {
                        //     left: { // optional, define if you want a drawer from the left
                        //         screen: 'DrawerScreen',
                        //     },
                        //     style: {
                        //         drawerShadow: false,
                        //         leftDrawerWidth: 60,
                        //         contentOverlayColor: 'rgba(0,0,0,0.25)',
                        //     },
                        //     disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                        // },
                        //  animationType: 'fade'

                    }
                }, 1500);
            })
            .catch(err => {
                this.loginEnable = true;
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 1500);
                })
            })
    }

    loginWithPhone() {
        this.loginEnable = false;
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
                textOnly: false,
            }, () => {
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let param = new FormData();
        param.append('phone', this.state.phoneNum.replace(/\s/g, ""));
        param.append('psd', Md5.digest_s(this.state.phonePsd));
        netWork('POST', LOGIN_LOGIN, param, false)
            .then(json => {
                this.setState({
                    hudType: 'success'
                }, () => {
                    this.hud.show('success', 1500);
                });
                this.timeout = setTimeout(() => {
                    this.loginEnable = true;
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
                                            text: 'Add a delivery address'
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

                    }
                }, 1500);
            })
            .catch(err => {
                this.loginEnable = true;
                this.setState({
                    hudType: 'error'
                }, () => {
                    this.hud.show(err, 2000);
                });
            })
    }

    // SignUp = () => Navigation.setRoot({ root: component(Screens.Pushed) });





    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <KeyboardAwareScrollView
                    style={{ flex: 0.9 }}
                    contentContainerStyle={{
                        padding: 8,
                        flexDirection: 'column'
                    }}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
                        <Image source={require('../../assets/images/logo.png')} />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                        <ZIPText style={{ fontSize: 24 }}>
                            Log In Via {this.state.useEmail ? 'Email' : 'Mobile Number'}
                        </ZIPText>
                    </View>
                    {
                        this.state.useEmail ?
                            <Animatable.View
                                style={{ height: 100 }}
                                ref={r => this.emailView = r}
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
                                    placeholder={'Enter password'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={(text) => {
                                        this.setState({
                                            password: text,
                                        })
                                    }}
                                />
                            </Animatable.View>
                            :
                            <Animatable.View
                                style={{ height: 100 }}
                                ref={r => this.phoneView = r}
                            >
                                {/*<TouchableOpacity*/}
                                {/*activeOpacity={1}*/}
                                {/*onPress={() => {*/}
                                {/*this.props.navigator.push({*/}
                                {/*screen: 'CountryPick',*/}
                                {/*title: 'Select Region',*/}
                                {/*navigatorStyle: navigatorStyle,*/}
                                {/*animationType: 'slide-horizontal',*/}
                                {/*passProps: {*/}
                                {/*selectRegion: (region) => {*/}
                                {/*this.setState({*/}
                                {/*region,*/}
                                {/*})*/}
                                {/*}*/}
                                {/*}*/}
                                {/*})*/}
                                {/*}}*/}
                                {/*style={{*/}
                                {/*flex: 1,*/}
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
                                    value={this.state.phoneNum}
                                    onChangeText={(text) => {
                                        let phone = text;
                                        if (text.length > this.state.phoneNum.length) {
                                            if (text.length === 3) {
                                                phone += ' ';
                                            } else if (text.length === 7) {
                                                phone += ' ';
                                            }
                                        } else {
                                            if (text.length === 9) {
                                                phone = phone.substr(0, 8);
                                            } else if (text.length === 4) {
                                                phone = phone.substr(0, 3);
                                            }
                                        }
                                        this.setState({
                                            phoneNum: phone,
                                        });
                                    }}
                                    maxLength={13}
                                    placeholder={'Enter mobile number'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'numeric'}
                                />
                                <CommonTextInput
                                    leftTitle="Password"
                                    placeholder={'Enter password'}
                                    placeholderTextColor={'lightgray'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.phonePsd}
                                    secureTextEntry={true}
                                    onChangeText={(text) => {
                                        this.setState({
                                            phonePsd: text,
                                        })
                                    }}
                                />
                            </Animatable.View>
                    }

                    <View style={{ paddingLeft: 8, paddingRight: 8, marginTop: 8, flexDirection: 'row' }}>
                        <ZIPText
                            style={{ fontSize: 16, color: Color.themeColor, flex: 1, marginRight: 16 }}
                            onPress={() => {
                                Keyboard.dismiss();
                                this.setState({
                                    useEmail: !this.state.useEmail,
                                    emailFocus: false,
                                    passwordFocus: false,
                                    phoneFocus: false,
                                    smsCodeFocus: false,
                                }, () => {
                                    if (this.state.useEmail) {
                                        this.emailView.slideInRight(500);
                                    } else {
                                        this.phoneView.slideInRight(500);
                                    }
                                })
                            }}
                        >
                            {this.state.useEmail ? 'Log in via mobile number' : 'Log in via Email'}
                        </ZIPText>
                        <ZIPText
                            onPress={() => {
                                Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'NewRegister',
                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'Sign Up',
                                                },
                                            },
                                        },
                                    }
                                });
                                // this.props.navigator.push({
                                //     screen: 'NewRegister',
                                //     title: 'Sign Up',
                                //     navigatorStyle: navigatorStyle,
                                //     animationType: 'slide-horizontal',
                                //     backButtonTitle: 'Back',
                                // });
                            }}
                            style={{ fontSize: 16, color: Color.themeColor }}
                        >
                            Sign Up
                        </ZIPText>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: this.loginButtonColor(),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            marginTop: 16,
                            height: 50,
                        }}
                        activeOpacity={1}
                        onPress={() => {
                            Keyboard.dismiss();
                            if (!this.loginEnable) {
                                return;
                            }
                            if (this.loginTextColor() === 'white') {
                                if (this.state.useEmail) {
                                    this.loginWithEmail();
                                } else {
                                    this.loginWithPhone();
                                }
                            }
                        }}
                    >
                        <ZIPText
                            style={{
                                fontSize: 18,
                                color: this.loginTextColor()
                            }}
                        >
                            Log In
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <View style={{ flex: 0.1, backgroundColor: 'white' }}>
                    <ZIPText style={{ position: 'absolute', width: '100%', textAlign: 'center', bottom: 10 }}>
                        Version:{appPackage.version}
                    </ZIPText>
                </View>
                <Hud
                    hudType={this.state.hudType}
                    textOnly={this.state.textOnly}
                    ref={(r) => {
                        this.hud = r
                    }}
                />
                {
                    this.state.useEmail ?
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 60,
                                right: 10,
                                padding: 4
                            }}
                            activeOpacity={1}
                            onPress={() => {
                                Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'ResetPassword',

                                    }
                                });
                                // this.props.navigator.push({
                                //     screen: 'ResetPassword',
                                //     title: 'Reset Password',
                                //     navigatorStyle: navigatorStyle,
                                //     animationType: 'slide-horizontal'
                                // })
                            }}
                        >
                            <Icon name="ios-help-circle-outline" color="lightgray" size={28} />
                        </TouchableOpacity>
                        :
                        null
                }

            </View>
        );
    }
}
