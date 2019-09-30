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
    RESEND_EMAIL,
    VERIFY_EMAIL
} from '../../config/API'
import Hud from 'react-native-lyhud'
import { connect } from 'react-redux'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import * as ziplockerProfileActions from '../../actions/ziplockerProfileAction'

/*
* */
class VerifyEmail extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            emailCode: '',
            showCount: false,
            count: 59,
            canSendVCode: true,

            hudType: 'none',
        }
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    sendVCode() {


        this.setState({
            hudType: 'none'
        }, () => {
            this.hud.show('sending code to your email');
        });

        let param = new FormData();
        //param.append('email',this.state.email);
        netWork('POST', RESEND_EMAIL, param, true)
            .then(json => {
                this.setState({
                    hudType: 'success'
                }, () => {
                    this.hud.show(`We have sent a new code to ${this.props.email}, please check your email.`, 3000);
                });
            })
            .catch(err => {
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 3000);
                })
            })
    }

    doneButtonColor() {
        if (
            this.state.emailCode.length !== 0
        ) {
            return 'rgba(42,187,103,1)'
        } else {
            return 'rgba(42,187,103,0.5)'
        }
    }

    doneTextColor() {
        if (
            this.state.emailCode.length !== 0
        ) {
            return 'white'
        } else {
            return 'rgba(255,255,255,0.3)'
        }
    }

    verifyEmailCode() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
            }, () => {
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let param = new FormData();
        param.append('vcode', this.state.emailCode);
        let showError = (err) => {
            this.setState({
                hudType: 'error',
            }, () => {
                this.hud.show('Fail to verify email,please check your email,input the newest code.', 5000);
            })
        }
        netWork('POST', VERIFY_EMAIL, param, true)
            .then(json => {
                if (json.ret != 0) {
                    showError(json.ret);
                    return;
                }
                this.setState({
                    hudType: 'success',
                }, () => {
                    this.hud.show(json.msg, 2000);
                    this.props.getMember();
                    this.time = setTimeout(() => {
                        Navigation.pop(this.props.componentId);
                        //this.props.navigator.pop();
                    }, 2000);
                });


            })
            .catch(err => { showError(err) })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar barStyle="light-content" animated={true} />
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        padding: 8,
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
                        value={this.props.email}
                        keyboardType="email-address"
                        disable
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
                        onPress={() => {
                            Keyboard.dismiss();
                            if (this.doneTextColor() === 'white') {
                                this.verifyEmailCode();
                            }
                        }}
                    >
                        <ZIPText
                            style={{
                                fontSize: 18,
                                color: this.doneTextColor()
                            }}
                        >
                            Verify
                        </ZIPText>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <Hud ref={r => this.hud = r} hudType={this.state.hudType} />
            </View>
        )
    }
}



export default connect(
    (state) => ({ email: state.zipporaHome.member.member.email, }),
    (dispatch) => ({
        getMember: () => dispatch(zipporaHomeActions.getMember()),
        loadProfile: () => dispatch(ziplockerProfileActions.loadProfile()),
    })
)(VerifyEmail)