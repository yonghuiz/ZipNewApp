/**
 * Created by liuyu on 2017/5/16.
 */
import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    NativeModules,
    Image,
    TouchableOpacity,
} from 'react-native'
import {
    Svg,
    Line,
    Circle,
} from 'react-native-svg'
import {connect} from 'react-redux'
import ZIPText from '../ZIPText'
import Hud from 'react-native-lyhud'
import * as deliverAction from '../../actions/deliverAction'
import {
    CANCEL_DELIVER,
    PAY_DELIVER,
} from '../../config/API'

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: Color.bgColor,
    },
    pageContentContainer: {
        flexDirection: 'column',
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'column',
    },
    tipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
    },
    tipsText: {
        color: Color.orange,
        paddingRight: 8,
        flex: 1,
    },
    printViewContainer: {
        padding: 16,
        borderWidth: 4,
        borderColor: 'black',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    printImage: {
        height: 100,
    },
    printTextContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    printTextTitle: {
        color: Color.themeColor,
        fontWeight: 'bold'
    },
    goodsContainer: {
        padding: 8,
        paddingLeft:16,
        paddingRight:16,
        backgroundColor: 'white',
        marginTop: 8,
        flexDirection: 'column'
    },
    goodsTextContainer: {
        flexDirection: 'column',
    },
    goodsText: {
        color: Color.themeColor,
        fontWeight: 'bold',
        //textAlign:'center',
        fontSize: 10,
        marginTop:8,
    },
    trackContainer: {
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'column',
        marginTop: 8,
    },
    trackTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
    },
    trackOrderItem: {
        height: 40,
        flexDirection: 'row'
    },
    bottomButton: {
        height: 50,
        alignItems: 'center',
        backgroundColor: Color.themeColor,
        justifyContent: 'center',
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 20,
    }
});

const TrackItem = (props) => {
    return (
        <View style={{height: 24, flexDirection: 'row', alignItems: 'center'}}>
            <Svg
                width="8" height="24"
            >
                <Line
                    x1="4"
                    y1="0"
                    x2="4"
                    y2="24"
                    stroke={Color.blue}
                    strokeWidth="1"
                />
                <Circle
                    cx="4"
                    cy="12"
                    r="4"
                    fill={Color.blue}
                />
            </Svg>
            <ZIPText style={{flex: 1, marginLeft: 4, color: Color.tipsColor, fontSize: 12}}>
                {props.desc}
            </ZIPText>
            <ZIPText style={{color: Color.tipsColor, fontSize: 12}}>
                {props.time}
            </ZIPText>
        </View>
    )
};

TrackItem.propTypes = {
    desc: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};

class DeliverInfo extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            hudType:'none'
        }
    }


    componentDidMount() {
        //this.props.getDeliverInfo(this.props.deliverId);
    }

    _renderGoodsView() {
        const {deliverInfo} = this.props;
        const goodsType = deliverInfo.cargo.cargoTypeName === null ?
            'Goods type: --' : `Goods type: ${deliverInfo.cargo.cargoTypeName}`;
        const weight = deliverInfo.cargo.cargoWeight === null ?
            'Weight: --' : `Weight: ${deliverInfo.cargo.cargoWeight} kg`;
        const worth = deliverInfo.cargo.cargoWorth === null ?
            'Worth: --' : `Worth: $${deliverInfo.cargo.cargoWorth}`;
        return (
            <View style={styles.goodsContainer}>
                <View style={styles.goodsTextContainer}>
                    <ZIPText style={{fontSize:16, fontWeight:'bold'}}>
                        Goods info
                    </ZIPText>
                    <ZIPText style={styles.goodsText}>
                        {goodsType}
                    </ZIPText>
                    <ZIPText style={styles.goodsText}>
                        {weight}
                    </ZIPText>
                    <ZIPText style={styles.goodsText}>
                        {worth}
                    </ZIPText>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        deliverInfo.cargo.deliverPhoto.map((data, index) => {
                            return (
                                <Image
                                    source={{uri: data}}
                                    key={index}
                                    style={{
                                        width: (screenSize.width - 30 - 32) / 4,
                                        height: (screenSize.width - 30 - 32) / 4,
                                        marginLeft: index % 4 === 0 ? 0 : 10,
                                        backgroundColor: 'white',
                                        marginTop: 10,
                                    }}
                                >
                                </Image>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    _renderTrackView() {
        const {deliverInfo} = this.props;
        return (
            <View style={styles.trackContainer}>
                <ZIPText style={styles.trackTitle}>
                    Order tracking
                </ZIPText>
                {
                    deliverInfo.deliverTraceList.map((data, index) => {
                        return (
                            <TrackItem key={index} desc={data.text} time={data.time}/>
                        )
                    })
                }
            </View>
        )
    }

    _renderBottomButton() {
        const {deliverInfo} = this.props;
        if (deliverInfo.canCancel == 1) {
            //返回取消按钮
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomButton}
                    onPress={() => {
                        //取消订单
                        this.cancelDeliver();
                    }}
                >
                    <ZIPText style={styles.bottomButtonText}>
                        Cancel
                    </ZIPText>
                </TouchableOpacity>
            )
        }
        if (deliverInfo.canComplain == 1) {
            //返回申述按钮
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomButton}
                    onPress={() => {
                        //提交申述
                        this.declareDeliver()
                    }}
                >
                    <ZIPText style={styles.bottomButtonText}>
                        Declare
                    </ZIPText>
                </TouchableOpacity>
            )
        }
        if (deliverInfo.canPay == 1) {
            //返回支付按钮
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomButton}
                    onPress={() => {
                        //支付
                        this.payDeliver();
                    }}
                >
                    <ZIPText style={styles.bottomButtonText}>
                        Pay
                    </ZIPText>
                </TouchableOpacity>
            )
        }
    }

    payDeliver() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            },()=>{
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait')
        }

        netWork('GET',PAY_DELIVER,'deliverId=' + this.props.deliverInfo.deliverId,true)
            .then(json=>{
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                    this.props.getDeliverList();
                    this.time = setTimeout(()=>{
                        Navigation.pop(this.props.componentId);
                       // this.props.navigator.pop();
                    },1500);
                })
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,1500);
                })
            })

    }

    cancelDeliver() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            },()=>{
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait')
        }
        netWork(
            'GET',
            CANCEL_DELIVER,
            'deliverId=' + this.props.deliverInfo.deliverId,
            true
        )
            .then(json=>{
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                    this.props.getDeliverList();
                    this.time = setTimeout(()=>{
                        Navigation.pop(this.props.componentId);
                       // this.props.navigator.pop();
                    },1500);
                })
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,1500);
                })
            })
    }

    declareDeliver() {
        //跳转到申述页面
        this.props.navigator.push({
            screen:'DeclareDeliver',
            title:'Declare',
            navigatorStyle:navigatorStyle,
            backButtonTitle:'',
            animationType:'slide-horizontal',
            passProps:{
                deliverId:this.props.deliverInfo.deliverId,
            }
        })
    }

    render() {
        /*
         loading:false,
         loadError:false,
         error:'',
         deliverInfo:null,
         * */
        const { deliverInfo} = this.props;
        //
        // if (loading) {
        //     return <LoadingView/>
        // }
        //
        // if (loadError) {
        //     let type = error === 'time out' ? 'timeout' : 'error';
        //     return (
        //         <ErrorView
        //             text={error}
        //             onReloadPress={() => {
        //                 //重新加载数据
        //                 this.props.getDeliverInfo()
        //             }}
        //             type={type}
        //         />
        //     )
        // }
        //
        // if (deliverInfo === null) {
        //     return <View style={styles.pageContainer}/>
        // }


        console.log(deliverInfo);
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <ScrollView
                    contentContainerStyle={styles.pageContentContainer}
                    style={styles.pageContainer}
                >
                    {/*<View style={styles.infoContainer}>*/}
                        {/*<View ref={r => this.printView = r} style={styles.printViewContainer}>*/}
                            {/*<Image resizeMode="contain" source={{uri: deliverInfo.cargo.cargoCodeUrl}}*/}
                                   {/*style={styles.printImage}>*/}

                            {/*</Image>*/}
                            {/*<View style={styles.printTextContainer}>*/}
                                {/*<ZIPText style={styles.printTextTitle}>*/}
                                    {/*{'Deliver from: '}*/}
                                {/*</ZIPText>*/}
                                {/*<ZIPText style={{flex: 1, color: Color.titleColor}}>*/}
                                    {/*{deliverInfo.from.address}*/}
                                {/*</ZIPText>*/}
                            {/*</View>*/}
                            {/*<View style={styles.printTextContainer}>*/}
                                {/*<ZIPText style={styles.printTextTitle}>*/}
                                    {/*{'Deliver to:      '}*/}
                                {/*</ZIPText>*/}
                                {/*<ZIPText style={{flex: 1, color: Color.titleColor}}>*/}
                                    {/*{deliverInfo.to.address}*/}
                                {/*</ZIPText>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {this._renderGoodsView()}
                    {this._renderTrackView()}
                </ScrollView>
                {this._renderBottomButton()}
                <Hud hudType={this.state.hudType} ref={(r)=>this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
        getDeliverList: () => dispatch(deliverAction.getDeliverList()),
    })
)(DeliverInfo)