/**
 * Created by liuyu on 2017/8/3.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    Image,
    Alert,
    NativeModules,
    TouchableOpacity,
    Platform,
    TouchableHighlight,
    Picker,
    SectionList,
    Linking
} from 'react-native'
import {
    connect
} from 'react-redux'
import {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Animatable from 'react-native-animatable';
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import Permissions from 'react-native-permissions'
import ZIPText from '../ZIPText'
import {
    allEvents,
    addEventListener,
    setCredential,
    setAccount,
    enableDebug,
    register,
} from '../XGPush'
import Hud from 'react-native-lyhud'
import { repeatPress } from '../RepeatPress'

let AnimateTouchable = Animatable.createAnimatableComponent(TouchableOpacity);
const {
    DeviceOperate,
    Permission,
    DeviceInfoManager,
    MyLocationManager
} = NativeModules;
import {
    GET_APP_VERSION
} from '../../config/API'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.bgColor,
    },
    userInfoContainer: {
        //height: 40,
        padding:8,
        backgroundColor: Color.assistColor,
        flexDirection: 'row',
        alignItems: 'center',
    },
    newOrderButton: {
        width: 100,
        height: 30,
        backgroundColor: Color.blue,
        borderRadius: 30,
        padding: 8
    },
    newOrderText: {
        textAlign: 'center',
        color: Color.grayText,
        fontSize: 13,
        fontWeight: 'bold'
    },
    scanButton: {
        position: 'absolute',
        left: (screenSize.width - 60) / 2,
        bottom: 10,
        backgroundColor: Color.themeColor,
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    zipporaItemContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
    },
    apartmentInfoContainer: {
        paddingTop:4,
        paddingBottom:4,
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    zipporaOrderContainer: {
        borderTopWidth:1,
        borderTopColor:Color.bgColor,
    },
    zipporaContainer: {
        height: 36,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingLeft: 36,
        paddingRight: 16,
        alignItems: 'center',
    },
    zipporaOrders: {
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    selfStoreHeader: {
        padding:8,
        backgroundColor:Color.themeColor,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    selfStoreItem: {
        paddingLeft:10,
        paddingRight:10,
        marginTop:4
    },
    selfStoreItemInfo: {
        padding:4,
        backgroundColor:'white',
        flexDirection:'column',
        paddingTop:0
    },
    selfStoreItemInfoContainer: {
        flexDirection:'row',
        paddingTop:4
    },
    selfStoreItemTitle: {
        width:95,
        fontSize:14,
        textAlign:'right'
    }
});

class ZipporaHome extends Component {

    show = true;
    messageClickCount = 0;
    constructor(props) {
        super(props);
        // MaterIcon.getImageSource('message', 26,).then(source => {
        //     this.props.navigator.setButtons({
        //         rightButtons: [
        //             {
        //                 id: 'message',
        //                 icon: source,
        //             }
        //         ],
        //         animated: true,
        //     });
        // })
        // Icon.getImageSource('ios-menu', 30,)
        //     .then(source => {
        //         this.props.navigator.setButtons({
        //             leftButtons: [
        //                 {
        //                     id: 'menu',
        //                     icon: source,
        //                 }
        //             ],
        //             animated: true
        //         })
        //     })
        //     .catch(err => {
        //
        //     });
        // this.props.navigator.setButtons({
        //     leftButtons:[{
        //         id:'account',
        //         icon:require('../../assets/images/profile.png')
        //     }]
        // });
        this.props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        });
        this.state = {
            hudType: 'error',
        };
    }

    componentDidMount() {
        let haveLoadList = false;
        if (Platform.OS !== 'android') {
            //enableDebug(true);
            let registerHolder = addEventListener('register',(data)=>{
                console.log('注册成功',data,userInfo.memberId);
                setAccount(`${userInfo.memberId}`);
            });

            let errorHolder = addEventListener('error',err=>{
                console.log('注册失败',err);
            });

            let notificationHolder = addEventListener('notification',notif=>{
                console.log('收到通知',notif);
                haveLoadList = true;
                this.props.loadZipList()
            });

            if (!registerHolder) console.log('fail to add event to handle register');
            if (!errorHolder) console.log('fail to add event to handle error');
            if (!notificationHolder) console.log('fail to add event to handle notification');

            setCredential(2200268639,'I3MVLZF8738W');
        } else {
          //rz  MyLocationManager.initMapBox();
            //allEvents();
            let registerHolder = addEventListener('register',(data)=>{
                console.log('注册成功',data,userInfo.memberId);
            });

            let errorHolder = addEventListener('error',err=>{
                console.log('注册失败',err);
            });
            let notificationHolder = addEventListener('notification',notif=>{
                console.log('收到通知',notif);
                haveLoadList = true;
                this.props.loadZipList()
            });



            if (!registerHolder) console.log('fail to add event to handle register');
            if (!errorHolder) console.log('fail to add event to handle error');
            if (!notificationHolder) console.log('fail to add event to handle notification');

            setCredential(2100268641,'A6P73LN27FCB');
            register(`${userInfo.memberId}`);
        }

        setTimeout(() => {
            this.props.navigator.setTitle({
                title: 'Zippora Package Locker',
                animated: true,
            });
            this.props.navigator.setStyle({
                navBarTitleTextCentered: true,
            });
        }, 500);
        if (!haveLoadList) {
            this.props.loadZipList();
        }
        this.props.getMember();

        this.checkVersion()
    }

    checkVersion() {
        let appVersion = DeviceInfoManager.appVersion;
        netWork('GET',GET_APP_VERSION,null,false)
            .then(json=>{
                console.log('==deviceVersion', appVersion);
                console.log('==serverAppVersion',json.data);
                let androidVersion = json.data.android.version;
                let androidDesc = json.data.android.desc;
                let iosVersion = json.data.ios.version;
                let iosDesc = json.data.ios.desc;
                if (Platform.OS === 'android') {
                    if (appVersion < androidVersion) {
                        //提示升级
                        Alert.alert(
                            'found a new version',
                            androidDesc,
                            [
                                {
                                    text:'Cancel',
                                },
                                {
                                    text:'Upgrade',
                                    onPress:()=>{
                                        Linking.openURL('https://play.google.com/store/apps/details?id=com.zipnewapp');
                                    }
                                }
                            ]
                        )
                    }
                } else {
                    if (appVersion < iosVersion) {
                        //提示升级
                        Alert.alert(
                            'found a new version',
                            iosDesc,
                            [
                                {
                                    text:'Cancel',
                                },
                                {
                                    text:'Upgrade',
                                    onPress:()=>{
                                        Linking.openURL('https://itunes.apple.com/us/app/zipcodexpress/id1320712564')
                                    }
                                }
                            ]
                        )
                    }
                }
            })
            .catch(err=>{})
    }

    onNavigatorEvent(event) {
        // handle a deep link
        //alert(event.type);
        switch (event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                this.props.navigator.setDrawerEnabled({
                    side: 'left',
                    enabled: true,
                });
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                this.props.navigator.setDrawerEnabled({
                    side: 'left',
                    enabled: false,
                });
                break;
        }
        if (event.type === 'DeepLink') {
            const parts = event.link.split('/'); // Link parts
            //const payload = event.payload; // (optional) The payload
            //console.log(parts);
            if (parts[0] === 'Profile') {
                this.props.navigator.push({
                    screen: 'Profile',
                    title: 'Personal center',
                    backButtonTitle: 'Back',
                    navigatorStyle: {
                        ...navigatorStyle,
                        navBarNoBorder: true,
                    },
                    animationType: 'slide-horizontal',
                })

            } else if (parts[0] === 'ziplocker') {
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
            } else if (parts[0] === 'Login') {
                Navigation.dismissLightBox();
                this.props.navigator.toggleDrawer({
                    side: 'left',
                    animated: true,
                    to: 'closed',
                });
                this.props.navigator.resetTo({
                    screen: 'Login',
                    navigatorStyle: {
                        ...navigatorStyle,
                        navBarHidden: true,
                    },
                    animationType: 'fade',
                    animated: true,
                })
            }
        } else if (event.type === 'NavBarButtonPress') {
            if (event.id === 'menu') {
                this.props.navigator.toggleDrawer({
                    side: 'left',
                    animated: true,
                })
            } else if (event.id === 'message') {
                this.messageClickCount += 1;
                if (this.messageClickCount === 5) {
                    if (baseURL === 'http://zipcodexpress.unibox.com.cn/zpi/') {
                        //提示是否切换到正式环境
                        Alert.alert(
                            'Change environment',
                            'change to product',
                            [
                                {
                                    text:'OK',
                                    onPress:()=>{
                                        baseURL = 'http://www.zipcodexpress.com/zpi/';
                                        logout();
                                        this.props.navigator.resetTo({
                                            screen: 'Login',
                                            navigatorStyle: {
                                                ...navigatorStyle,
                                                navBarHidden: true,
                                            },
                                            animationType: 'fade',
                                            animated: true,
                                        });
                                    }
                                }
                            ],
                            {cancelable: false}
                        )
                    } else {
                        //提示是否切换到测试环境
                        Alert.alert(
                            'Change environment',
                            'change to test',
                            [
                                {
                                    text:'OK',
                                    onPress:()=>{
                                        baseURL = 'http://zipcodexpress.unibox.com.cn/zpi/';
                                        logout();
                                        this.props.navigator.resetTo({
                                            screen: 'Login',
                                            navigatorStyle: {
                                                ...navigatorStyle,
                                                navBarHidden: true,
                                            },
                                            animationType: 'fade',
                                            animated: true,
                                        });
                                    }
                                }
                            ],
                            {cancelable: false}
                        )
                    }

                    this.messageClickCount = 0;
                }

            } else if (event.id === 'account') {
                this.props.navigator.push({
                    screen: 'Profile',
                    title: 'Personal center',
                    backButtonTitle: 'Back',
                    navigatorStyle: {
                        ...navigatorStyle,
                        navBarNoBorder: true,
                    },
                    animationType: 'slide-horizontal',
                })
            }
        }
    }

    _renderSelfStoreItem(item) {
        return (
            <View style={styles.selfStoreItem}>
                <View style={styles.selfStoreItemInfo}>
                    <View style={styles.selfStoreItemInfoContainer}>
                        <ZIPText
                            style={[styles.selfStoreItemTitle,{fontSize:18,width:95}]}
                        >
                            Pickup Code:
                        </ZIPText>
                        <ZIPText style={{flex:1, color:Color.red, fontSize:18, fontFamily:'Menlo'}}>
                            {` ${item.pickCode}`}
                        </ZIPText>
                    </View>
                    <View style={styles.selfStoreItemInfoContainer}>
                        <ZIPText
                            style={styles.selfStoreItemTitle}
                        >
                            Time:
                        </ZIPText>
                        <ZIPText style={{flex:1, color:'#5698C5'}}>
                            {` ${item.storeTime}`}
                        </ZIPText>
                    </View>
                    <View style={styles.selfStoreItemInfoContainer}>
                        <ZIPText
                            style={styles.selfStoreItemTitle}
                        >
                            Zippora ID:
                        </ZIPText>
                        <ZIPText style={{flex:1}}>
                            {` ${item.cabinetId}`}
                        </ZIPText>
                    </View>
                    <View style={styles.selfStoreItemInfoContainer}>
                        <ZIPText
                            style={styles.selfStoreItemTitle}
                        >
                            Address:
                        </ZIPText>
                        <ZIPText style={{flex:1}}>
                            {` ${item.address}`}
                        </ZIPText>
                    </View>
                </View>
            </View>
        )
    }

    _renderItem(item) {

        //console.log(item);
        let timeUnit = 'th';
        if (item.chargeDay == '1' || item.chargeDay == '21') {
            timeUnit = 'st';
        }
        if (item.chargeDay == '2' || item.chargeDay == '22') {
            timeUnit = 'nd';
        }
        if (item.chargeDay == '3' || item.chargeDay == '33') {
            timeUnit = 'rd';
        }

        return (
            <View style={styles.zipporaItemContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        if(repeatPress(this)) return;
                        this.props.navigator.push({
                            screen: 'ZipporaAPTInfo',
                            title: 'Apartment Info',
                            backButtonTitle: 'Back',
                            animationType: 'slide-horizontal',
                            navigatorStyle: navigatorStyle,
                            passProps: {
                                info: item,
                            }
                        })
                    }}
                    style={styles.apartmentInfoContainer}
                >
                    <Image
                        source={require('../../assets/images/room.png')}
                        style={{marginRight: 16}}
                    />
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                        <ZIPText>
                            {`Unit: ${item.unitName}, ${item.apartmentName}`}
                        </ZIPText>
                        <ZIPText style={{color: Color.tipsColor, marginTop: 2}}>
                            <ZIPText>
                                {item.zipporaCount}
                            </ZIPText>
                            {
                                item.approveStatus == 1 ?
                                    ` ${item.zipporaCount>1?'zipporas':'zippora'}, renew on ${item.chargeDay}${timeUnit} monthly` :
                                    ` ${item.zipporaCount>1?'zipporas':'zippora'}, `
                            }
                            {
                                item.approveStatus == 0 ?
                                    <Text style={{color:'red'}}>
                                        Pending audit
                                    </Text>
                                    : item.approveStatus == 2 ? 'Rejected' : null
                            }
                        </ZIPText>
                    </View>
                    <Icon
                        style={{marginLeft: 16}}
                        name="ios-arrow-forward"
                        color={Color.themeColor}
                        size={30}
                    />
                </TouchableOpacity>

                {
                    item.zipporaList.map((data, index) => {
                        return (
                            <View
                                key={data.cabinetId}
                                style={styles.zipporaOrderContainer}
                            >
                                <View style={styles.zipporaContainer}>

                                    <Image
                                        source={require('../../assets/images/kuaidigui.png')}
                                        style={{
                                            marginLeft: -2
                                        }}
                                    />

                                    <ZIPText style={{marginLeft: 10, color: Color.tipsColor}}>
                                        {data.cabinetId}
                                    </ZIPText>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <ZIPText style={{textAlign: 'right', color: Color.tipsColor}}>
                                            <ZIPText>
                                                {`${data.storeCount} `}
                                            </ZIPText>
                                            {data.storeCount>1?'packages':'package'} to pick up
                                        </ZIPText>
                                    </View>
                                </View>
                                <View
                                    style={styles.zipporaOrders}
                                >
                                    {
                                        data.storeList.map((data, index) => {

                                            return (
                                                <View key={data.storeId}
                                                      style={{
                                                          flexDirection: 'column',
                                                          marginTop: index === 0 ? 0 : 4,
                                                          borderTopColor:'lightgray',
                                                          borderTopWidth:1,
                                                          marginLeft:40,
                                                      }}>
                                                    <ZIPText style={{fontSize: 14, color: Color.assistColor}}>
                                                        {data.courierCompanyName || 'NULL'}
                                                    </ZIPText>
                                                    <ZIPText
                                                        numberOfLines={1}
                                                        style={{
                                                            //flex: 1,
                                                            //marginLeft: 16,
                                                            fontSize: 18,
                                                            color: Color.tipsColor,
                                                        }}
                                                    >
                                                        Pickup Code:
                                                        <ZIPText
                                                            style={{fontFamily: 'Menlo',color:Color.red}}
                                                        >
                                                            {` ${data.pickCode}`}
                                                        </ZIPText>
                                                    </ZIPText>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                        //flex: 1,
                                                        //textAlign: 'right',
                                                        fontSize: 13,
                                                        color: Color.tipsColor,
                                                        fontFamily: 'Menlo'
                                                    }}>
                                                        {data.storeTime}
                                                    </Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    _renderMemberInfo() {
        /*
         loadingMember:state.zipporaHome.loadingMember,
         member:state.zipporaHome.member,
         loadMemberError:state.zipporaHome.loadMemberError,
         memberError:state.zipporaHome.memberError,
        * */

        const {
            loadingMember,
            member,
            loadMemberError,
            memberError
        } = this.props;

        if (loadMemberError) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.getMember();
                    }}
                    style={{height: 40, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                    <ZIPText>
                        Tap to reload member info
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        if (member === null) {
            return null;
        }


        return (
            <View style={styles.userInfoContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                        if(repeatPress(this)) return;
                        this.props.navigator.push({
                            screen: 'Profile',
                            title: 'Personal center',
                            backButtonTitle: 'Back',
                            navigatorStyle: navigatorStyle,
                            animationType: 'slide-horizontal',
                        })
                    }}>
                    <View style={{height: 32, width: 32,  borderRadius: 16, padding: 1}}>
                        <Image
                            style={{flex: 1, borderRadius: 15, backgroundColor: 'transparent', width: 30, height: 30}}
                            source={member.profile.avatar === '' ? require('../../assets/images/proimage.png') : {uri: member.profile.avatar}}
                        />
                    </View>
                    <ZIPText style={{color: 'white', fontSize: 14, marginLeft: 4}}>
                        {(member.profile.nickName === null || member.profile.nickName === '') ? member.member.phone : member.profile.nickName}
                    </ZIPText>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
                    onPress={() => {
                        if(repeatPress(this)) return;
                        //check whether email is verified
                        var showScreen=(newScreen,newTitle)=>{
                            this.props.navigator.push({
                            screen: newScreen,
                            title: newTitle,
                            animationType: 'slide-horizontal',
                            animationType: 'slide-horizontal',
                            backButtonTitle: 'Back',
                        })}

                        if(member.member.statusDetail.isEmailVerified==='0'){
                            this.hud.show('Please verify your email before subscribe a new apartment',2500);
                            setTimeout(() => {
                                showScreen('VerifyEmail','Verify Email');
                            }, 2500);
                             
                        }
                        else if((member.profile.firstName||'').trim()===''||(member.profile.lastName||'').trim()===''){
                            this.hud.show('Please input your first name and last name before subscribe a new apartment',3000);
                            setTimeout(() => {
                                showScreen('ProfileInfo','ProfileInfo');
                            }, 3000);
                        }
                        else{
                            showScreen('NewApartment','New Apartment');
                        }
                        
                    

                        // this.props.navigator.push({
                        //     screen: 'NewApartment',
                        //     title: 'New apartment',
                        //     navigatorStyle: navigatorStyle,
                        //     animationType: 'slide-horizontal',
                        // })
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="md-add" size={20} color="white" style={{marginTop: 2, marginRight: 2}}/>
                        <ZIPText style={{color: 'white', fontSize: 14}}>
                            Subscribe a new apartment
                        </ZIPText>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderList() {
        const {
            loading,
            list,
            loadError,
            error,
        } = this.props;

        if (loading && list === null) {
            return <LoadingView/>
        }

        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            return (
                <ErrorView
                    text={error}
                    onReloadPress={() => {
                        //重新加载数据
                        //this.props.getDeliverList()
                        this.props.loadZipList();
                    }}
                    type={type}
                />
            )
        }


        if (list === null) {
            return null;
        }

        if (list[0].data.length === 0 && list[1].data.length === 0) {
            return (
                <ErrorView
                    text="have no data"
                    onReloadPress={() => {
                        this.props.loadZipList();
                    }}
                    type={'empty'}
                />
            )
        }

        return (
            <SectionList
                sections={list}
                onRefresh={()=>this.props.loadZipList()}
                refreshing={loading}
                renderItem={(item)=>{
                    console.log('selction list:item',list,item);
                    if (item.section.section === 'apartment') {
                        return this._renderItem(item.item);
                    } else {
                        return this._renderSelfStoreItem(item.item);
                    }

                }}
                renderSectionHeader={(item)=>{
                    if (item.section.section === 'apartment') {
                        return (
                            <View />
                        )
                    } else {
                        if (item.section.data.length === 0) {
                            return (
                                <View />
                            )
                        }
                        return (
                            <View
                                style={styles.selfStoreHeader}
                            >
                                <ZIPText style={{color:'white'}}>
                                    My deposit
                                </ZIPText>
                            </View>
                        )
                    }
                }}
                keyExtractor={(item,index)=>{
                    if (item.apartmentId !== undefined) {
                        return item.apartmentId;
                    } else {
                        return item.storeId;
                    }
                }}
            />
        );
    }

    pushToBarScan() {
        this.props.setCanScan(false);
        if (Platform.OS === 'android') {
            Permissions.check('camera')
                .then(promise => {
                    switch (promise) {
                        case 'undetermined':
                            Permissions.request('camera')
                                .then(response => {
                                    if (response === 'authorized') {
                                        this.props.navigator.push({
                                            screen: 'BarScan',
                                            title: 'Scan',
                                            navigatorStyle: navigatorStyle,
                                            animationType: 'slide-horizontal',
                                        });
                                    } else {
                                        this.props.setCanScan(true)
                                    }
                                });
                            break;
                        case 'authorized':
                            this.props.navigator.push({
                                screen: 'BarScan',
                                title: 'Scan',
                                navigatorStyle: navigatorStyle,
                                animationType: 'slide-horizontal',
                            });
                            break;
                        default:
                            this.props.setCanScan(true)
                            Alert.alert('Warm Tip', 'Camera permissions are not available', [
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
            Permission.checkCamera((status) => {
                switch (status) {
                    case 'authorized':
                        this.props.navigator.push({
                            screen: 'BarScan',
                            title: 'Scan',
                            navigatorStyle: navigatorStyle,
                            animationType: 'slide-horizontal',
                        });
                        break;
                    case 'undetermined':
                        Permission.requestCamera((status) => {
                            switch (status) {
                                case 'authorized':
                                    this.props.navigator.push({
                                        screen: 'BarScan',
                                        title: 'Scan',
                                        navigatorStyle: navigatorStyle,
                                        animationType: 'slide-horizontal',
                                    });
                                    break;
                                default:
                                    this.props.setCanScan(true);
                                    Alert.alert('Warm Tip', 'Camera permissions are not available', [
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
                        this.props.setCanScan(true);
                        Alert.alert('Warm Tip', 'Camera permissions are not available', [
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
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} animated={true}/>
                {this._renderMemberInfo()}
                {this._renderList()}
                <AnimateTouchable
                    ref={(r) => this.scan = r}
                    activeOpacity={0.8}
                    style={styles.scanButton}
                    onPress={() => {
                        if(repeatPress(this)) return;
                        if (this.props.canToScan) {
                            this.pushToBarScan()
                        }
                    }}
                >
                    <MaterIcon
                        name="qrcode"
                        size={32}
                        color={'white'}
                        style={{paddingTop: 2}}
                    />
                </AnimateTouchable>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.zipporaHome.loading,
        list: state.zipporaHome.list,
        loadError: state.zipporaHome.loadError,
        error: state.zipporaHome.error,
        loadingMember: state.zipporaHome.loadingMember,
        member: state.zipporaHome.member,
        loadMemberError: state.zipporaHome.loadMemberError,
        canToScan:state.zipporaHome.canToScan,
        //memberError:state.zipporaHome.memberError,
    }),
    (dispatch) => ({
        loadZipList: () => dispatch(zipporaHomeActions.loadZipList()),
        getMember: () => dispatch(zipporaHomeActions.getMember()),
        setCanScan:(canScan)=>dispatch(zipporaHomeActions.setCanScan(canScan))
    })
)(ZipporaHome)