/**
 * Created by liuyu on 2017/5/16.
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Hud from 'react-native-lyhud'
import {
    INSERT_CARDCREDIT,
} from '../../config/API'
import * as walletActions from '../../actions/walletAction'
import { connect } from 'react-redux'
import ZIPText from '../ZIPText'
import ZIPTextInput from '../ZIPTextInput'
import { Navigation } from 'react-native-navigation'

const CreditCardItem = (props) => {
    return (
        <View
            style={{
                flexDirection:'column',
                paddingLeft:16,
                paddingRight:16,
                paddingTop:16,
            }}
        >
            <ZIPText style={{padding:4,color:Color.themeColor, fontWeight:'bold'}}>
                {props.title}
            </ZIPText>
            <ZIPTextInput
                autoCorrect={false}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                style={{
                    height:40,
                    paddingLeft:4,
                    paddingRight:4,
                    borderWidth:1,
                    borderColor:Color.tipsColor,
                    backgroundColor:'white'
                }}
                onChangeText={props.onChangeText}
            />
        </View>
    )
};

CreditCardItem.propTypes = {
    title:PropTypes.string.isRequired,
    onChangeText:PropTypes.func.isRequired,
};

class BindCreditCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expireTime:'',
            expireTimeError:false,
            cardNum:'',
            cardNumError:false,
            buttonDisabled:true,
            cvvCode:'',
            zipCode:'',
            holderName:'',
            hudType:'none',
            textOnly:false,
        };

        if (props.fromWallet !== true) {
            props.navigator.setButtons({
                rightButtons:[
                    {
                        title:'Skip',
                        id:'skip',
                    }
                ]
            });
            props.navigator.setOnNavigatorEvent((event)=>{this.onNavigatorEvent(event)});
        }
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            // if (event.id === 'camera') {
            //     DeviceOperate.openCardScan((singal,cardInfo)=>{
            //         console.log(singal,cardInfo);
            //     })
            // }
            if (event.id === 'skip') {
                console.log('skip');
                storage.save({
                    key:'isLogin',
                    data:true,
                    expires:null,
                });
                storage.save({
                    key: 'userInfo',
                    data:{
                        accessToken:userInfo.accessToken,
                        memberId:userInfo.memberId,
                        psd: userInfo.psd,
                    },
                    expires:null,
                });
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'ZipporaHome',
                        navigatorStyle: navigatorStyle,
                    },
                    appStyle: {
                        orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                        hideBackButtonTitle: true
                    },
                    drawer: {
                        left: { // optional, define if you want a drawer from the left
                            screen: 'DrawerScreen',
                        },
                        style: {
                            drawerShadow: false,
                            leftDrawerWidth: 60,
                            contentOverlayColor: 'rgba(0,0,0,0.25)',
                        },
                        disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
                    },
                    animationType: 'fade'
                })
                // this.props.navigator.push({
                //     screen:'ChooseModel',
                //     title:'Choose model',
                //     navigatorStyle:navigatorStyle,
                //     animationType:'slide-horizontal'
                // });
            }
        }
    }

    isTimeAvailable(time) {

        let error = false;

        //获取当前年月
        let nowTime = new Date();
        let nowYear = nowTime.getFullYear() % 100;
        let nowMonth = nowTime.getMonth() + 1;

        //获取用户输入的年份
        let expireYear = parseInt(time.substring(5));
        //获取用户输入的月份
        let expireMonth = parseInt(time.substring(0,2));

        if (expireYear === nowYear) {
            error = expireMonth < nowMonth
        } else if (expireYear < nowYear) {
            error = true
        } else {
            error = (expireYear - nowYear > 14);
        }

        if (this.state.expireTimeError !== error) {
            this.setState({
                expireTimeError:error,
            },()=>{this.completed()})
        }
    }

    completed() {
        if (this.state.cardNumError || this.state.expireTimeError) {
            if (!this.state.buttonDisabled) {
                this.setState({
                    buttonDisabled:true,
                })
            }
        } else {
            if (this.state.cardNum.length !== 0 &&
                this.state.expireTime.length !== 0 &&
                this.state.cvvCode.length !== 0 &&
                this.state.zipCode.length !== 0 &&
                this.state.holderName.length !== 0
            ) {
                console.log('ok');
                if (this.state.buttonDisabled) {
                    this.setState({
                        buttonDisabled:false,
                    })
                }
            }
        }
    }

    insertCard() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            })
        }
        this.hud.show();

        let dateArray = this.state.expireTime.split(' / ');
        let expDate = dateArray.join('');

        let cardNumber = this.state.cardNum.split(' ');
        let cardNum = cardNumber.join('');

        let param = new FormData();
        param.append('cardNum',cardNum);
        param.append('cardHolderName',this.state.holderName);
        param.append('expDate',expDate);
        param.append('cvv2',this.state.cvvCode);
        param.append('zipcode',this.state.zipCode);
        netWork('POST',INSERT_CARDCREDIT,param,true)
            .then(json=>{
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                });
                if (this.props.fromWallet) {
                    this.time = setTimeout(()=>{
                        this.props.loadCreditCard();
                        this.props.navigator.pop();
                    },1000);
                    return;
                }
                this.time = setTimeout(()=>{
                    // this.props.navigator.push({
                    //     screen:'ChooseModel',
                    //     title:'Choose model',
                    //     navigatorStyle:navigatorStyle,
                    //     animationType:'slide-horizontal'
                    // });
                    storage.save({
                        key:'isLogin',
                        data:true,
                        expires:null,
                    });
                    storage.save({
                        key: 'userInfo',
                        data:{
                            accessToken:userInfo.accessToken,
                            memberId:userInfo.memberId,
                            psd: userInfo.psd,
                        },
                        expires:null,
                    });
                    Navigation.startSingleScreenApp({
                        screen: {
                            screen: 'ZipporaHome',
                            navigatorStyle: navigatorStyle,
                        },
                        appStyle: {
                            orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
                            hideBackButtonTitle: true
                        },
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
                        animationType: 'fade'
                    })
                },1500);
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,2000);
                })
            })
    }

    render() {
        return (
            <View style={{flex:1}}>
                <StatusBar barStyle="light-content" animated={true}/>
                <KeyboardAwareScrollView
                    style={{
                        flex:1,
                        backgroundColor:Color.bgColor
                    }}
                    contentContainerStyle={{
                        flexDirection:'column',
                    }}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View
                        style={{
                            marginTop: 16,
                            backgroundColor:'white',
                            borderTopWidth:1,
                            borderBottomWidth:1,
                            borderColor:'lightgray',
                        }}
                    >
                        <ZIPTextInput
                            style={{
                                height:40,
                                fontSize:14,
                                paddingLeft:8,
                                paddingRight:8,
                                color:this.state.cardNumError ? Color.red:'black',
                                fontFamily:FontFamily,
                            }}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            placeholder={'Card Number'}
                            maxLength={19}
                            underlineColorAndroid={'transparent'}
                            value={this.state.cardNum}
                            onChangeText={(text)=>{
                                if (text.length < this.state.cardNum.length) {
                                    this.setState({
                                        cardNum:text,
                                    },()=>{
                                        this.completed();
                                    });
                                } else {
                                    let str = text.replace(/[^0-9]/g, '').replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
                                    this.setState({
                                        cardNum: str,
                                    }, () => {
                                        this.completed();
                                    });
                                }
                            }}
                        />
                        <View style={{height:1, backgroundColor:'lightgray'}} />
                        <View style={{
                            height:40,
                            flexDirection:'row',
                        }}>
                            <View style={{flex:1,paddingLeft:8,paddingRight:8}}>
                                <ZIPTextInput
                                    style={{
                                        flex:1,
                                        color:this.state.expireTimeError ? Color.red : 'black',
                                        fontFamily:FontFamily,
                                    }}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    keyboardType={'number-pad'}
                                    placeholder={'MMYY'}
                                    maxLength={7}
                                    value={this.state.expireTime}
                                    underlineColorAndroid={'transparent'}
                                    onBlur={()=>{
                                        if (this.state.expireTime.length !== 7) {
                                            this.setState({
                                                expireTimeError:true,
                                            })
                                        }
                                    }}
                                    onChangeText={(text)=>{
                                        if (this.state.expireTime.length > 2) {
                                            if (this.state.expireTime.length < 6 && this.state.expireTime.length > text.length) {
                                                this.setState({
                                                    expireTime:'',
                                                })
                                            } else {
                                                this.setState({
                                                    expireTime:text,
                                                },()=>{this.completed()})
                                            }
                                        } else {
                                            if (text.length === 2) {
                                                if (parseInt(text) <= 12) {
                                                    this.setState({
                                                        expireTime: text + ' / '
                                                    },()=>{this.completed()})
                                                }
                                            } else {
                                                if (parseInt(text) > 2) {
                                                    this.setState({
                                                        expireTime: '0' + text + ' / ',
                                                    },()=>{this.completed()})
                                                } else {
                                                    this.setState({
                                                        expireTime: text,
                                                    },()=>{this.completed()})
                                                }
                                            }
                                        }
                                        if (text.length === 7) {
                                            this.isTimeAvailable(text);
                                        } else {
                                            if (this.state.expireTimeError) {
                                                console.log('false');
                                                this.setState({
                                                    expireTimeError:false,
                                                },()=>{this.completed()})
                                            }
                                        }
                                    }}
                                />
                            </View>
                            <View style={{height:40,width:1, backgroundColor:'lightgray'}} />
                            <View style={{flex:1,paddingLeft:8,paddingRight:8}}>
                                <ZIPTextInput
                                    style={{flex:1, fontFamily:FontFamily}}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    keyboardType={'number-pad'}
                                    placeholder={'CVV'}
                                    maxLength={4}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.cvvCode}

                                    onChangeText={(str)=>{
                                        let text = str.replace(/[^0-9]/g,'');
                                        this.setState({
                                            cvvCode:text,
                                        },()=>{this.completed()})
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{height:1, backgroundColor:'lightgray'}}/>
                        <ZIPTextInput
                            style={{
                                height:40,
                                fontSize:14,
                                paddingLeft:8,
                                paddingRight:8,
                                fontFamily:FontFamily,
                            }}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            placeholder={'Postal Code'}
                            maxLength={20}
                            underlineColorAndroid={'transparent'}
                            value={this.state.zipCode}
                            onChangeText={(str)=>{
                                let text = str.replace(/[^0-9]/g,'');
                                this.setState({
                                    zipCode:text,
                                },()=>{this.completed()})
                            }}
                        />
                        <View style={{height:1, backgroundColor:'lightgray'}}/>
                        <ZIPTextInput
                            style={{
                                height:40,
                                fontSize:14,
                                paddingLeft:8,
                                paddingRight:8,
                                fontFamily:FontFamily,
                            }}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            placeholder={'Cardholder Name'}
                            value={this.state.holderName}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text)=>{
                                this.setState({
                                    holderName:text
                                },()=>{this.completed()})
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{
                            //提交信用卡信息
                            this.insertCard();
                        }}
                        style={{
                            height:40,
                            alignItems:'center',
                            justifyContent:'center',
                            marginLeft:16,
                            marginRight:16,
                            marginTop: 16,
                            backgroundColor:this.state.buttonDisabled ? 'lightgray' :Color.themeColor,
                            borderRadius:4,
                        }}
                    >
                        <ZIPText style={{fontSize:15,color:'white', fontWeight:'500'}}>
                            Done
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <Hud
                    ref={r=>this.hud = r}
                    hudType={this.state.hudType}
                    textonly={this.state.textOnly}
                />
            </View>
        )
    }
}

export default connect(
    (state)=>({}),
    (dispatch)=>({
        loadCreditCard: () => dispatch(walletActions.loadCreditCard()),
    })
)(BindCreditCard)