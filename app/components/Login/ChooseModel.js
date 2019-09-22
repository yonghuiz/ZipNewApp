/**
 * Created by liuyu on 2017/8/2.
 */
import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Hud from 'react-native-lyhud'
import {
    SWITCH_SERVICE_MODE,
} from '../../config/API'
import ZIPText from '../../components/ZIPText'
import { Navigation } from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:Color.bgColor,
        flexDirection:'column',
        padding:8,
    },
    modelContainer: {
        marginTop:20,
        height:90,
        alignItems:'center',
        justifyContent:'center',
    }
});

export default class ChooseModel extends Component {
    //216 181 174

    _chooseModel(mode) {
        this.hud.show('Loading...');
        netWork('GET',SWITCH_SERVICE_MODE,'serviceMode='+mode,true)
            .then(json=>{
                this.hud.show(json.msg,1500);
                if (json.ret === 0) {
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
                    storage.save({
                        key:'serviceMode',
                        data:mode,
                        expires:null,
                    });
                    this.timeout = setTimeout(()=>{
                        if (mode === 'ziplocker') {
                            Navigation.startSingleScreenApp({
                                screen: {
                                    screen: 'ZipLockerHome',
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
                                animationType: 'fade',
                            });
                        } else {
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
                        }
                        clearTimeout(this.timeout);
                    },1500)
                }
            })
            .catch(err=>{

            })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.modelContainer,{backgroundColor:Color.themeColor}]}
                    onPress={()=>{
                        this._chooseModel('ziplocker');
                    }}
                >
                    <ZIPText style={{padding:8, fontSize:16, color:'white', fontWeight:'bold'}}>
                        Ziplocker
                    </ZIPText>
                    <ZIPText style={{color:'white'}}>
                        Provide city logistics service
                    </ZIPText>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.modelContainer,{backgroundColor:'rgb(203,160,83)'}]}
                    onPress={()=>{
                        this._chooseModel('zippora');
                    }}
                >
                    <ZIPText style={{padding:8, fontSize:16, color:'white', fontWeight:'bold'}}>
                        Zippora
                    </ZIPText>
                    <ZIPText style={{color:'white'}}>
                        For apartment tenant
                    </ZIPText>
                </TouchableOpacity>
                <Hud textOnly={true} hudType={'none'} ref={r=>this.hud = r}/>
            </View>
        )
    }
}