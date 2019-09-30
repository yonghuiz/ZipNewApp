/**
 * Created by liuyu on 2017/11/29.
 */
import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
} from 'react-native'
import CommonTextInput from '../CommonTextInput'
import Hud from 'react-native-lyhud'
import { CHANGE_PSD } from '../../config/API'
import Md5 from '../../config/md5'
import ZIPText from '../ZIPText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ModifyPassword extends PureComponent {

    modifying = false;

    constructor(props) {
        super(props);
        this.state = {
            oldPsd:'',
            psd1:'',
            psd2:'',
            hudType:'none',
        }
    }

    doneButtonColor() {
        if (this.state.oldPsd.length !== 0 &&
            this.state.psd1.length !== 0 &&
            this.state.psd2.length !== 0
        ) {
            return 'rgba(42,187,103,1)'
        } else {
            return 'rgba(42,187,103,0.5)'
        }
    }

    doneTextColor() {
        if (this.state.oldPsd.length !== 0 &&
            this.state.psd1.length !== 0 &&
            this.state.psd2.length !== 0
        ) {
            return 'white'
        } else {
            return 'rgba(255,255,255,0.3)'
        }
    }

    modifyPsd() {
        this.modifying = true;
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            },()=>{
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        let param = new FormData();
        param.append('oldPsd',Md5.digest_s(this.state.oldPsd));
        param.append('psd1',Md5.digest_s(this.state.psd1));
        param.append('psd2',Md5.digest_s(this.state.psd2));

        netWork('POST',CHANGE_PSD,param,true)
            .then(json=>{
                this.modifying = false;
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                });
                this.time = setTimeout(()=>{
                    logout();

                    Navigation.setStackRoot(this.props.componentId, [
                        {
                        component: {
                            name: 'Login',
                           
                            options: {
                                animations: {
                                setStackRoot: {
                                    enabled: true
                                }
                                }
                            }
                            }
                    }
                    ]);
                    // this.props.navigator.resetTo({
                    //     screen: 'Login',
                    //     navigatorStyle: {
                    //         ...navigatorStyle,
                    //         navBarHidden: true,
                    //     },
                    //     animationType: 'fade',
                    //     animated: true,
                    // });
                },1500);
            })
            .catch(err=>{
                this.modifying = false;
                this.setState({
                    hudType:'error'
                },()=>{
                    this.hud.show(err,1500);
                })
            })
    }

    render() {
        return (
            <View style={{flex:1}}>
                <KeyboardAwareScrollView
                    style={{flex:1}}
                    contentContainerStyle={{
                        flexDirection:'column',
                        padding:8,
                    }}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <CommonTextInput
                        leftTitle="Original"
                        placeholder={'Enter Original password'}
                        placeholderTextColor={'lightgray'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.oldPsd}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({
                                oldPsd: text,
                            })
                        }}
                    />
                    <CommonTextInput
                        leftTitle="New"
                        placeholder={'Enter New password'}
                        placeholderTextColor={'lightgray'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.psd1}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({
                                psd1: text,
                            })
                        }}
                    />
                    <CommonTextInput
                        leftTitle="Confirm"
                        placeholder={'Confirm new password'}
                        placeholderTextColor={'lightgray'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.psd2}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({
                                psd2: text,
                            })
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            height:50,
                            marginTop:16,
                            borderRadius:3,
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:this.doneButtonColor()
                        }}
                        activeOpacity={1}
                        onPress={()=>{
                            if (this.doneTextColor() === 'white') {
                                if (!this.modifying) {
                                    this.modifyPsd();
                                }
                            }
                        }}
                    >
                        <ZIPText style={{fontSize:18,color:this.doneTextColor()}}>
                            Done
                        </ZIPText>
                    </TouchableOpacity>
                    <Hud hudtype={this.state.hudType} ref={r=>this.hud = r}/>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}