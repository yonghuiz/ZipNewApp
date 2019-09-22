/**
 * Created by liuyu on 2017/11/3.
 */
import React, {PureComponent} from 'react'
import {
    View,
    StatusBar,
    TouchableOpacity,
    NativeModules,
    Platform,
    Alert,
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ZiplockerTabBar from './TabBar/ZiplockerTabBar'
import Deliver from '../components/Deliver/Deliver'
import MyPickup from '../components/MyPick/MyPickup'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'
import * as Animatable from 'react-native-animatable'
import * as deliverAction from '../actions/deliverAction'
import * as myPickActions from '../actions/myPickupAction'
import MaterIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Permissions from 'react-native-permissions'
import {
    allEvents,
    addEventListener,
    setCredential,
    setAccount,
    enableDebug,
    register,
} from './XGPush'
const {
    DeviceOperate,
    Permission,
} = NativeModules;
let AnimateTouchable = Animatable.createAnimatableComponent(TouchableOpacity);

class ZipLockerHome extends PureComponent {

    show = true;

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            page: 0,
        };
        Icon.getImageSource('ios-menu', 30,)
            .then(source => {
                this.props.navigator.setButtons({
                    leftButtons: [
                        {
                            id: 'menu',
                            icon: source,
                        }
                    ],
                    animated: true
                })
            })
            .catch(err => {

            });
        // props.navigator.setButtons({
        //     rightButtons: [
        //         {
        //             icon: require('../assets/images/xiaoxi.png'),
        //             id: 'xiaoxi',
        //         }
        //     ],
        // });
        props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        });
    }

    onNavigatorEvent(event) {
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

        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'xiaoxi') {
                alert('xiaoxi');
            } else if (event.id === 'menu') {
                this.props.navigator.toggleDrawer({
                    side: 'left',
                })
            }
        }
        if (event.type === 'DeepLink') {
            if (event.link === 'Profile/') {
                this.props.navigator.toggleDrawer({
                    side: 'left',
                });
                //跳转到ziplocker 个人中心
                this.props.navigator.push({
                    screen: 'ZiplockerProfile',
                    title: 'Profile',
                    animationType: 'slide-horizontal',
                    navigatorStyle: navigatorStyle,
                })
            }
            if (event.link === 'Login/') {
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
            if (event.link === 'zippora/') {
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
        }
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    componentDidMount() {
        this.timeout = setTimeout(()=>{
            this.props.navigator.setTitle({
                title:'Ziplocker'
            })
        },500);
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
                if (this.props.deliverLoading === false) {
                    this.props.getDeliverList();
                }
                if (this.props.PickupLoading === false) {
                    this.props.loadPickList();
                }
            });

            if (!registerHolder) console.log('fail to add event to handle register');
            if (!errorHolder) console.log('fail to add event to handle error');
            if (!notificationHolder) console.log('fail to add event to handle notification');

            setCredential(2200268639,'I3MVLZF8738W');
        } else {
            //allEvents();
            let registerHolder = addEventListener('register',(data)=>{
                console.log('注册成功',data,userInfo.memberId);
            });

            let errorHolder = addEventListener('error',err=>{
                console.log('注册失败',err);
            });
            let notificationHolder = addEventListener('notification',notif=>{
                console.log('收到通知',notif);
                if (this.props.deliverLoading === false) {
                    this.props.getDeliverList();
                }
                if (this.props.PickupLoading === false) {
                    this.props.loadPickList();
                }
            });



            if (!registerHolder) console.log('fail to add event to handle register');
            if (!errorHolder) console.log('fail to add event to handle error');
            if (!notificationHolder) console.log('fail to add event to handle notification');

            setCredential(2100268641,'A6P73LN27FCB');
            register(`${userInfo.memberId}`);
        }

        //enableDebug(true);
        // let registerHolder = addEventListener('register', (data) => {
        //     console.log('注册成功', data, userInfo.memberId);
        //     setAccount(`${userInfo.memberId}`);
        // });
        // let errorHolder = addEventListener('error', err => {
        //     console.log('注册失败', err);
        // });
        // let notificationHolder = addEventListener('notification', notif => {
        //     console.log('收到通知', notif);
        //     if (this.props.deliverLoading === false) {
        //         this.props.getDeliverList();
        //     }
        //     if (this.props.PickupLoading === false) {
        //         this.props.loadPickList();
        //     }
        // });
        // if (!registerHolder) console.log('fail to add event to handle register');
        // if (!errorHolder) console.log('fail to add event to handle error');
        // if (!notificationHolder) console.log('fail to add event to handle notification');
        //
        // setCredential(2200268639, 'I3MVLZF8738W');
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
                                        this.props.setCanScan(true);
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
            <View style={{flex: 1}}>
                <StatusBar barStyle="light-content" animated={true}/>
                <ScrollableTabView
                    renderTabBar={() => (
                        <ZiplockerTabBar/>
                    )}
                    style={{backgroundColor: Color.bgColor}}
                    scrollEnabled={Platform.OS !== 'android'}
                >
                    <Deliver
                        navigator={this.props.navigator}
                        tabLabel="My delivery"
                        onScrollBeginDrag={() => {
                            if (this.show) {
                                this.show = !this.show;
                                this.scan.zoomOut(800);
                            }
                        }}
                        onScrollEndDrag={() => {
                            if (!this.show) {
                                this.show = !this.show;
                                this.scan.zoomIn(800);
                            }
                        }}
                        //style={{flex:1, backgroundColor:'red'}}
                    />
                    <MyPickup
                        navigator={this.props.navigator}
                        tabLabel="My pick up"
                        onScrollBeginDrag={() => {
                            if (this.show) {
                                this.show = !this.show;
                                this.scan.zoomOut(800);
                            }
                        }}
                        onScrollEndDrag={() => {
                            if (!this.show) {
                                this.show = !this.show;
                                this.scan.zoomIn(800);
                            }
                        }}
                    />
                </ScrollableTabView>
                <AnimateTouchable
                    ref={(r) => this.scan = r}
                    activeOpacity={0.8}
                    style={{
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
                    }}
                    onPress={() => {
                        if (this.props.canScan) {
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
            </View>
        );
    }
}

export default connect(
    (state) => ({
        deliverLoading: state.deliver.loading,
        canScan:state.deliver.canScan,
        PickupLoading: state.myPickup.loading,
    }),
    (dispatch) => ({
        getDeliverList: () => dispatch(deliverAction.getDeliverList()),
        loadPickList: () => dispatch(myPickActions.loadPickList()),
        setCanScan:(canScan)=>dispatch(deliverAction.setCanScan(canScan))
    })
)(ZipLockerHome)