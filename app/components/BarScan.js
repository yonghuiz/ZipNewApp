/**
 * Created by liuyu on 2017/6/27.
 */
import React, {PureComponent} from 'react'
import {
    View,
    Text,
    Alert,
    ActivityIndicator
} from 'react-native'
import Hud from 'react-native-lyhud'
import * as Animatable from 'react-native-animatable'
import Camera from 'react-native-camera'
import {
    QRCODELL_QRCODE,
} from '../config/API'
import {connect} from 'react-redux'
import * as zipporaHomeActions from '../actions/zipporaHomeAction'
import * as deliverActions from '../actions/deliverAction'


class BarScan extends PureComponent {
    isReading = false;
    static navigatorStyle = {
        navBarBackgroundColor: Color.themeColor,
        navBarTextColor: 'white',
        navBarButtonColor: 'white',
        navBarTitleTextCentered: true,
    };

    constructor(props) {
        super();
        props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        });
        this.state = {
            showCamera: false,
        }
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                this.time = setTimeout(()=>{
                    this.setState({
                        showCamera: true,
                    });
                },1000);
                break;
            case 'willDisappear':
                this.props.setCanScan(true);
                this.props.setScan(true);
                break;
            case 'didDisappear':

                break;
        }
    }

    _sendCode(text) {

        this.hud.show('Please wait...');
        netWork('GET', QRCODELL_QRCODE, 'text=' + encodeURIComponent(text), true)
            .then(json => {
                this.hud.show(json.msg, 1000);
                this.timer = setTimeout(() => {
                    this.isReading = false;
                    this.props.navigator.pop();
                }, 1000);

            })
            .catch(err => {
                this.hud.show(err, 1500);
                this.timer = setTimeout(() => {
                    this.isReading = false;
                }, 1500);

            })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.state.showCamera ?
                        <Camera
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                            }}
                            captureAudio={false}
                            aspect={Camera.constants.Aspect.fill}
                            captureQuality={'medium'}
                            onBarCodeRead={(data) => {
                                console.log(data);
                                if (this.isReading == false) {
                                    this.isReading = true;
                                    this._sendCode(data.data)
                                }
                                // this.refs.toast.show('Please wait...', 100000);
                            }}
                            //barCodeTypes={[Camera.constants.BarCodeType.qr]}
                        >
                            <View
                                style={{
                                    height: (screenSize.height - navBarHeight - (screenSize.width - 100)) / 2 - 60,
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View style={{height: 8, paddingLeft: 42, paddingRight: 42, flexDirection: 'row'}}>
                                    <View style={{width: 30, backgroundColor: Color.blue}}/>
                                    <View style={{flex: 1}}/>
                                    <View style={{width: 30, backgroundColor: Color.blue}}/>
                                </View>
                            </View>
                            <View style={{height: screenSize.width - 100, flexDirection: 'row'}}>
                                <View style={{
                                    width: 50, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}>
                                    <View style={{width: 8, flexDirection: 'column'}}>
                                        <View style={{height: 22, backgroundColor: Color.blue}}/>
                                        <View style={{flex: 1}}/>
                                        <View style={{height: 22, backgroundColor: Color.blue}}/>
                                    </View>
                                </View>
                                <View style={{width: screenSize.width - 100, borderColor: 'white', borderWidth: 1}}>
                                    <Animatable.Image
                                        animation={{from: {marginTop: 0}, to: {marginTop: screenSize.width - 100 - 10}}}
                                        easing="linear"
                                        iterationCount="infinite"
                                        duration={2000}
                                        style={{width: screenSize.width - 90, height: 10}}
                                        source={require('../assets/images/scan-line.png')}/>
                                </View>
                                <View style={{width: 50, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row'}}>
                                    <View style={{width: 8, flexDirection: 'column'}}>
                                        <View style={{height: 22, backgroundColor: Color.blue}}/>
                                        <View style={{flex: 1}}/>
                                        <View style={{height: 22, backgroundColor: Color.blue}}/>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'column'}}>
                                <View style={{height: 8, paddingLeft: 42, paddingRight: 42, flexDirection: 'row'}}>
                                    <View style={{width: 30, backgroundColor: Color.blue}}/>
                                    <View style={{flex: 1}}/>
                                    <View style={{width: 30, backgroundColor: Color.blue}}/>
                                </View>
                                <View style={{
                                    paddingLeft: 50,
                                    paddingRight: 50,
                                    height: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{color: 'white'}}>
                                        Align QR Code within frame to scan
                                    </Text>
                                </View>
                            </View>
                        </Camera> :
                        <View style={{flex:1, backgroundColor:'black', alignItems:'center', justifyContent:'center'}}>
                            <View style={{flexDirection:'row'}}>
                                <ActivityIndicator animated={true} color="white"/>
                                <Text style={{marginLeft:4,color:'white'}}>
                                    Starting camera
                                </Text>
                            </View>
                        </View>
                }
                <Hud textOnly={true} ref={(r) => {
                    this.hud = r
                }}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        setCanScan: (canScan) => dispatch(zipporaHomeActions.setCanScan(canScan)),
        setScan: (canScan) => dispatch(deliverActions.setCanScan(canScan)),
    }),
)(BarScan)