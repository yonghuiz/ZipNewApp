/**
 * Created by liuyu on 2017/8/2.
 */
import React, {PureComponent} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native'
import FontConf from '../config/fontConf'
import {
    SWITCH_SERVICE_MODE
} from '../config/API'
import ZIPText from '../components/ZIPText'

const styles = StyleSheet.create({
    drawerContainer: {
        width: screenSize.width * 0.6,
        height: screenSize.height,
        backgroundColor: 'rgb(57,58,59)',
        flexDirection: 'column'
    },
    modelContainer: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: 'rgb(107,107,107)',
        borderTopColor: 'rgb(107,107,107)',
    },
    modelButton: {
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:8,
        marginTop:8,
    },
    personalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    }
});

export default class DrawerScreen extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    _switchMode(mode) {
        this.props.navigator.showLightBox({
            screen: 'SwitchModeLightBox',
            style: {
                backgroundBlur: 'none',
                backgroundColor: 'rgba(255,255,255,0.5)'
            }
        });
        /*
         this.props.navigator.toggleDrawer({
         side: 'left',
         animated: true,
         });
         this._switchMode('ziplocker');
         this.props.navigator.handleDeepLink({
         link: 'ziplocker/',
         })
         this.props.navigator.handleDeepLink({
         link: 'zippora/',
         })
         * */

        netWork('GET', SWITCH_SERVICE_MODE, 'serviceMode=' + mode, true)
            .then(json => {
                this.props.navigator.dismissLightBox();
                this.props.navigator.toggleDrawer({
                    side: 'left',
                    animated: true,
                });
                this.props.navigator.handleDeepLink({
                    link: mode + '/',
                });
                storage.save({
                    key: 'serviceMode',
                    data: mode,
                    expires: null,
                });
            })
            .catch(err => {
                this.props.navigator.dismissLightBox();
                Alert.alert(
                    'tips',
                    err,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => {
                                this.props.navigator.toggleDrawer({
                                    side: 'left',
                                    animated: true,
                                });
                            }
                        }
                    ]
                );
            })
    }

    render() {
        return (
            <View style={styles.drawerContainer}>
                <View
                    style={{
                        paddingTop: 40,
                        paddingBottom: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ZIPText style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                        Service model
                    </ZIPText>
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modelButton}
                    onPress={() => {
                        //切换到zippora
                        //判断当前用户是否是zippora
                        //true  不变  false 切换到zippora
                        storage.load({
                            key: 'serviceMode'
                        }).then(ret => {
                            if (ret !== 'zippora') {
                                this._switchMode('zippora');
                            } else {
                                this.props.navigator.toggleDrawer({
                                    side: 'left',
                                    animated: true,
                                });
                            }
                        }).catch(err => {
                            this._switchMode('zippora');
                        });
                    }}
                >
                    <Image source={require('../assets/images/zippora.png')}/>
                    <ZIPText style={{color: 'white', fontWeight: 'bold', marginLeft:8}}>
                        Zippora
                    </ZIPText>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modelButton}
                    onPress={() => {
                        //切换到ziplocker
                        //判断当前用户是否是ziplocker
                        //true 不变  false 切换到ziplocker
                        storage.load({
                            key: 'serviceMode'
                        }).then(ret => {
                            if (ret !== 'ziplocker') {
                                this._switchMode('ziplocker');
                            } else {
                                this.props.navigator.toggleDrawer({
                                    side: 'left',
                                    animated: true,
                                });
                            }
                        }).catch(err => {
                            this._switchMode('ziplocker');
                        });
                    }}
                >
                    <Image source={require('../assets/images/ziplocker.png')}/>
                    <ZIPText style={{color: 'white', fontWeight: 'bold', marginLeft:8}}>
                        Ziplocker
                    </ZIPText>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modelButton}
                    onPress={() => {
                        //alert(this.props.navigator);
                        this.props.navigator.toggleDrawer({
                            side: 'left',
                            animated: true,
                        });
                        this.props.navigator.handleDeepLink({
                            link: 'Profile/',
                            //payload: '' // (optional) Extra payload with deep link
                        });

                    }}
                >
                    <Image source={require('../assets/images/profile.png')}/>
                    <ZIPText style={{color: 'white', fontWeight:'bold', marginLeft:8}}>
                        Personal center
                    </ZIPText>
                </TouchableOpacity>
            </View>
        )
    }
}