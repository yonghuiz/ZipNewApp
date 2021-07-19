/**
 * Created by liuyu on 2017/5/16.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Platform,
    NativeModules,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard,
    Picker,
    StatusBar,
    TextInput
} from 'react-native';
import {
    Icon,
    Button,
} from 'react-native-elements';
import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import Hud from 'react-native-lyhud';
import {
    UPDATE_PROFILE,
    GET_STATE_LIST,
} from '../../config/API';
import GetLocation from '../../config/GetLocation';
import ZIPText from '../ZIPText';
import ZIPTextInput from '../ZIPTextInput';

let MyLocationManager = NativeModules.MyLocationManager;

const ItemCell = (props) => {

    const Container = props.noInput ? TouchableOpacity : View;
    return (
        <Container style={{
            height: 45,
            backgroundColor: 'white',
            marginTop: 1,
            borderLeftColor: Color.blue,
            borderLeftWidth: 3,
            flexDirection: 'row',
            paddingLeft: 8,
            paddingRight: 8,
            alignItems: 'center',
        }}
            onPress={props.onPress}
        >
            <ZIPText style={{ color: Color.titleColor }}>
                {props.title}
            </ZIPText>
            {
                props.noInput ?
                    <View
                        activeOpacity={1}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingRight: 8
                        }}
                    >
                        {props.subTitle === null ?
                            <ActivityIndicator animating={true} size={'small'} /> :
                            <ZIPText>
                                {props.subTitle}
                            </ZIPText>
                        }
                    </View> :
                    <ZIPTextInput
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        style={{ flex: 1, marginLeft: 8, fontFamily: FontFamily }}
                        onChangeText={props.onChangeText}
                        underlineColorAndroid={'transparent'}
                        value={props.value}
                        keyboardType={props.keyboardType}
                        maxLength={props.maxLength}
                    />
            }
            {
                props.noInput ? <Icon name="ios-arrow-forward" color={Color.blue} type="ionicon" /> : null
            }
        </Container>
    )
};

ItemCell.propTypes = {
    title: PropTypes.string.isRequired,
    onChangeText: PropTypes.func,
    noInput: PropTypes.bool,
    subTitle: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    keyboardType: TextInput.propTypes.keyboardType,
};

ItemCell.defaultProps = {
    title: '',
    onChangeText: () => {
    },
    noInput: false,
    maxLength: 30,
    keyboardType: 'default',
};

export default class AddAddress extends Component {
    static navigationOptions = {
        title: 'Add a delivery address',
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentLocation: null,
            lat: null,
            lon: null,
            getLocationError: false,
            states: '',
            loading: false,
            loadError: false,
            data: null,
            selectState: null,
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            zipCode: '',
            completed: false,
        };
    }

    componentDidMount() {
        this.getCurrentLocation();
        if (Platform.OS === 'android') {
            //加载State列表
            this.loadStateList();
        }
    }

    isCompleted() {
        if (this.state.firstName === '') {
            return false
        }
        if (this.state.lastName === '') {
            return false
        }
        if (this.state.address === '') {
            return false
        }
        if (this.state.city === '') {
            return false
        }

        if (Platform.OS === 'android') {
            if (this.state.selectState === '') {
                return false;
            }
        } else {
            if (this.state.states === '') {
                return false;
            }
        }
        if (this.state.zipCode === '') {
            return false
        }
        return this.state.currentLocation !== null;
    }

    loadStateList() {
        this.setState({
            loading: true,
            loadError: false,
        });
        netWork('GET', GET_STATE_LIST, null, true)
            .then(json => {
                this.setState({
                    loading: false,
                    data: json.data.stateList,
                    selectState: json.data.stateList[0].stateCode,
                })
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    loadError: true,
                })
            })
    }

    updateProfile() {
        let tips = null;
        tips = this.configTips();
        if (tips !== null) {
            tips = `${tips} can't empty`;
            console.log(tips);
            this.hud.show(tips, 2000);
            return;
        }

        const {
            firstName,
            lastName,
            address,
            city,
            zipCode,
        } = this.state;

        this.hud.show('Please wait...');
        let param = new FormData();
        param.append('_accessToken', userInfo.accessToken);
        param.append('_memberId', userInfo.memberId);
        param.append('firstName', firstName);
        param.append('lastName', lastName);
        param.append('address', address);
        param.append('city', city);
        if (Platform.OS === 'android') {
            param.append('state', this.state.selectState);
        } else {
            param.append('state', this.state.states);
        }
        param.append('zipcode', zipCode);
        param.append('longitude', this.state.lon);
        param.append('latitude', this.state.lat);
        netWork('POST', UPDATE_PROFILE, param, false)
            .then(json => {
                this.hud.show(json.msg, 2000);
                if (json.ret === 0) {
                    //跳转到绑定Cabinet
                    this.timeout = setTimeout(() => {
                        this.props.navigator.push({
                            screen: 'BindCreditCard',
                            title: 'Bind Credit Card',
                            backButtonTitle: 'Back',
                            navigatorStyle: navigatorStyle,
                            animationType: 'slide-horizontal',
                        });
                    }, 2000);
                    // this.timeout = setTimeout(()=>{
                    //     Actions.BindCabinet({
                    //         userData:this.props.userData,
                    //     })
                    //     //navigate('BindCabinet',{userData:state.params.userData});
                    // },2000)
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    configTips() {
        if (this.state.firstName === '') {
            return 'firstName'
        }
        if (this.state.lastName === '') {
            return 'lastName'
        }
        if (this.state.address === '') {
            return 'address'
        }
        if (this.state.city === '') {
            return 'city'
        }
        if (Platform.OS === 'android') {
            if (this.state.selectState === '') {
                return 'state'
            }
        } else {
            if (this.state.states === '') {
                return 'state'
            }
        }

        if (this.state.zipCode === '') {
            return 'zipCode'
        }
        if (this.state.currentLocation === null) {
            return 'map location'
        }
        return null;
    }

    getCurrentLocation() {
        this.setState({
            getLocationError: false,
        });
        GetLocation((lat, lon) => {
            MyLocationManager.reverseGeocodeLocation(lat, lon, (address) => {
                if (!address) {
                    //反编码失败,显示经纬度
                    this.setState({
                        currentLocation: `${lat},${lon}`,
                        lat: lat,
                        lon: lon,
                    }, () => {
                        if (this.state.completed !== this.isCompleted()) {
                            this.setState({
                                completed: this.isCompleted()
                            })
                        }
                    })
                } else {
                    //显示位置
                    this.setState({
                        currentLocation: address,
                        lat: lat,
                        lon: lon,
                    }, () => {
                        if (this.state.completed !== this.isCompleted()) {
                            this.setState({
                                completed: this.isCompleted()
                            })
                        }
                    })
                }
            });
        }, (err) => {
            //提示重新获取地址
            this.setState({
                getLocationError: true,
            })
        });
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: Color.bgColor,
            }}>
                <StatusBar barStyle="light-content" animated={true} />
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16 }}
                >
                    <ItemCell
                        title="First Name"
                        onChangeText={(text) => {
                            let result = text.replace(/^\s+/g, "");
                            let reg = result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g, " ");
                            this.setState({
                                firstName: reg,
                            }, () => {
                                if (this.state.completed !== this.isCompleted()) {
                                    this.setState({
                                        completed: this.isCompleted()
                                    })
                                }
                            })
                        }}
                        value={this.state.firstName}
                    />
                    <ItemCell
                        title="Last Name"
                        onChangeText={(text) => {
                            let result = text.replace(/^\s+/g, "");
                            let reg = result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g, " ");
                            this.setState({
                                lastName: reg,
                            }, () => {
                                if (this.state.completed !== this.isCompleted()) {
                                    this.setState({
                                        completed: this.isCompleted()
                                    })
                                }
                            })
                        }}
                        value={this.state.lastName}
                    />
                    <ItemCell
                        title="Address"
                        onChangeText={(text) => {
                            let result = text.replace(/^\s+/g, "");
                            let reg = result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g, " ");
                            this.setState({
                                address: reg,
                            }, () => {
                                if (this.state.completed !== this.isCompleted()) {
                                    this.setState({
                                        completed: this.isCompleted()
                                    })
                                }
                            });
                        }}
                        value={this.state.address}
                    />
                    <ItemCell
                        title="City"
                        onChangeText={(text) => {
                            let result = text.replace(/^\s+/g, "");
                            let reg = result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g, " ");
                            this.setState({
                                city: reg,
                            }, () => {
                                if (this.state.completed !== this.isCompleted()) {
                                    this.setState({
                                        completed: this.isCompleted()
                                    })
                                }
                            })
                        }}
                        value={this.state.city}
                    />
                    {
                        Platform.OS === 'android' ?
                            <View
                                style={{
                                    height: 45,
                                    backgroundColor: 'white',
                                    marginTop: 1,
                                    borderLeftColor: Color.blue,
                                    borderLeftWidth: 3,
                                    flexDirection: 'row',
                                    paddingLeft: 8,
                                    paddingRight: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <ZIPText style={{ color: Color.titleColor }}>
                                    State
                                </ZIPText>
                                <View
                                    activeOpacity={1}
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        paddingRight: 8
                                    }}
                                >
                                    {
                                        this.state.loading ?
                                            <ActivityIndicator animating={true} size={'small'} /> :
                                            this.state.loadingError ?
                                                <ZIPText style={{ flex: 1, textAlign: 'center', color: Color.red }} onPress={() => { this.loadStateList() }}>
                                                    load error, tap to reload
                                                </ZIPText> :
                                                this.state.data === null ?
                                                    <View /> :
                                                    <Picker
                                                        onValueChange={(value, index) => {
                                                            //console.log(value);
                                                            this.setState({
                                                                selectState: value,
                                                                state: this.state.data[index].state,
                                                            }, () => {
                                                                if (this.state.completed !== this.isCompleted()) {
                                                                    this.setState({
                                                                        completed: this.isCompleted()
                                                                    })
                                                                }
                                                            });
                                                        }}
                                                        selectedValue={this.state.selectState}
                                                        style={{ height: 35, width: 150 }}
                                                        itemStyle={{ width: screenSize.width, backgroundColor: 'white' }}
                                                    >
                                                        {
                                                            this.state.data.map((data, index) => {
                                                                return (
                                                                    <Picker.Item
                                                                        key={index}
                                                                        label={data.state}
                                                                        value={data.stateCode}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </Picker>

                                    }
                                    <Icon name="ios-arrow-forward" color={Color.blue} type="ionicon" />
                                </View>
                            </View>
                            :
                            <ItemCell
                                title="State"
                                subTitle={this.state.states}
                                noInput={true}
                                onPress={() => {
                                    this.props.navigator.showModal({
                                        screen: 'PickerScreen',
                                        navigatorStyle: {
                                            navBarHidden: true,
                                            statusBarColor: Color.themeColor
                                        },
                                        animationType: 'none',
                                        passProps: {
                                            title: 'Choose a state',
                                            type: 'picker',
                                            onSureClick: (data) => {
                                                this.setState({
                                                    states: data,
                                                }, () => {
                                                    if (this.state.completed !== this.isCompleted()) {
                                                        this.setState({
                                                            completed: this.isCompleted()
                                                        })
                                                    }
                                                })

                                            }
                                        }
                                    })
                                }}
                            />

                    }
                    <ItemCell
                        title="Postal Code"
                        onChangeText={(text) => {
                            let result = text.replace(/(^\s+)|(\s+$)/g, "");
                            //let reg=result.replace(/(^\s{2,})|(\s{2,}$)|(\s{2,})/g," ");
                            this.setState({
                                zipCode: result,
                            }, () => {
                                if (this.state.completed !== this.isCompleted()) {
                                    this.setState({
                                        completed: this.isCompleted()
                                    })
                                }
                            });
                        }}
                        maxLength={5}
                        value={this.state.zipCode}
                    />
                    <ItemCell
                        title="Location"
                        noInput={true}
                        subTitle={this.state.getLocationError ? 'get location' : this.state.currentLocation}
                        onPress={() => {
                            if (this.state.getLocationError) {
                                this.getCurrentLocation();
                                return;
                            }
                            if (this.state.currentLocation === null) {
                                return;
                            }
                            this.props.navigator.push({
                                screen: 'SelectDeliverAddress',
                                title: 'Select a address',
                                animationType: 'slide-horizontal',
                                navigatorStyle: navigatorStyle,
                                passProps: {
                                    selectAddress: (address, lat, lon) => {
                                        this.setState({
                                            currentLocation: address,
                                            lat: lat,
                                            lon: lon,
                                        })
                                    },
                                    location: {
                                        currentLocation: this.state.currentLocation,
                                        lat: this.state.lat,
                                        lon: this.state.lon,
                                    }
                                }
                            });
                            // MyLocationManager.openSelectLocation((lat, lon, address) => {
                            //
                            // })
                        }}
                    />
                    <Button
                        raised
                        containerViewStyle={{ marginLeft: 0, marginRight: 0, marginTop: 20 }}
                        backgroundColor={Color.blue}
                        title="Next"
                        textStyle={{
                            fontFamily: FontFamily,
                        }}
                        disabled={!this.state.completed}
                        onPress={() => {
                            Keyboard.dismiss();
                            this.updateProfile();
                            //this.updateProfile()
                            //console.log(this.firstName,this.lastName,this.city,this.states,this.address,this.zipCode)
                            //Actions.BindCabinet();
                        }}
                    />
                </KeyboardAwareScrollView>
                <Hud textOnly={true} ref={r => {
                    this.hud = r
                }} />
            </View>
        )
    }
}