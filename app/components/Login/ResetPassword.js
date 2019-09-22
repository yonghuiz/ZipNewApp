/**
 * Created by liuyu on 2017/11/29.
 */
import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
    Keyboard,
    StatusBar,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ZIPText from '../ZIPText'
import CommonTextInput from '../CommonTextInput'
import {
    LOGIN_FORGET_PSD,
    LOGIN_RESET_PSD
} from '../../config/API'
import Md5 from '../../config/md5'
import Hud from 'react-native-lyhud'

/*
* */
export default class ResetPassword extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            emailCode:'',
            memberId:'',
            password:'',
            confirmPassword:'',

            showCount: false,
            count: 59,
            canSendVCode:true,

            hudType:'none',
        }
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    sendVCode() {
        if (this.state.email.length === 0) {
            this.setState({
                hudType: 'error',
            }, () => {
                this.hud.show('Please enter Email address', 2000);
            });
            return;
        }

        this.setState({
            hudType:'none'
        },()=>{
            this.hud.show('sending code');
        });

        let param = new FormData();
        param.append('email',this.state.email);
        netWork('POST',LOGIN_FORGET_PSD,param,false)
            .then(json=>{
                this.setState({
                    hudType:'success',
                    memberId:json.data.memberId,
                },()=>{
                    this.hud.show(json.msg,1500);
                });
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,1500);
                })
            })
    }

    doneButtonColor() {
        if (this.state.email.length !== 0 &&
            this.state.emailCode.length !== 0 &&
            this.state.memberId.length !== 0 &&
            this.state.password.length !== 0 &&
            this.state.confirmPassword.length !== 0
        ) {
            return 'rgba(42,187,103,1)'
        } else {
            return 'rgba(42,187,103,0.5)'
        }
    }

    doneTextColor() {
        if (this.state.email.length !== 0 &&
            this.state.emailCode.length !== 0 &&
            this.state.memberId.length !== 0 &&
            this.state.password.length !== 0 &&
            this.state.confirmPassword.length !== 0
        ) {
            return 'white'
        } else {
            return 'rgba(255,255,255,0.3)'
        }
    }

    resetPsd() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none',
            },()=>{
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let param = new FormData();
        param.append('memberId',this.state.memberId);
        param.append('vcode',this.state.emailCode);
        param.append('psd1',Md5.digest_s(this.state.password));
        param.append('psd2',Md5.digest_s(this.state.confirmPassword));

        netWork('POST',LOGIN_RESET_PSD,param,false)
            .then(json=>{
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                });

                this.time = setTimeout(()=>{
                    this.props.navigator.pop();
                },1500);
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,1500);
                })
            })
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <StatusBar barStyle="light-content" animated={true}/>
                <KeyboardAwareScrollView
                    style={{flex:1}}
                    contentContainerStyle={{
                        flexDirection:'column',
                        padding:8,
                    }}
                    keyboardShouldPersistTaps={'handled'}
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
                        leftTitle="Email Code"
                        rightTitle={this.state.showCount ? `Resend after ${this.state.count}s` : 'Get Code'}
                        placeholder={'Enter verification code'}
                        placeholderTextColor={'lightgray'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        keyboardType="email-address"
                        onRightClick={() => {
                            if (this.state.canSendVCode) {
                                this.sendVCode();
                            }
                        }}
                        value={this.state.emailCode}
                        onChangeText={(text) => {
                            this.setState({
                                emailCode: text,
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
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={(text)=>{
                            this.setState({
                                password:text,
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
                        value={this.state.confirmPassword}
                        secureTextEntry={true}
                        onChangeText={(text)=>{
                            this.setState({
                                confirmPassword:text,
                            })
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            height: 50,
                            backgroundColor: this.doneButtonColor(),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            marginTop: 16,
                        }}
                        activeOpacity={1}
                        onPress={()=>{
                            Keyboard.dismiss();
                            if (this.doneTextColor() === 'white') {
                                this.resetPsd();
                            }
                        }}
                    >
                        <ZIPText
                            style={{
                                fontSize: 18,
                                color: this.doneTextColor()
                            }}
                        >
                            Done
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <Hud ref={r=>this.hud = r} hudType={this.state.hudType}/>
            </View>
        )
    }
}