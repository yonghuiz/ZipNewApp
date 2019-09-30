/**
 * Created by liuyu on 2017/9/14.
 */
import React, {PureComponent} from 'react'
import {
    NativeModules,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import * as rechargeAction from '../../actions/rechargeAction'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import * as walletActions from '../../actions/walletAction'
import * as ziplockerProfileActions from '../../actions/ziplockerProfileAction'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    PAY_WITH_CREDIT_CARD,
    PAY_WITH_PAYPAL,
} from '../../config/API'
import Hud from 'react-native-lyhud'
const { PayPal } = NativeModules;
import ZIPText from '../ZIPText'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: Color.bgColor
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 12
    },
    moneyText: {
        color: Color.red,
        fontSize: 20,
        fontWeight: 'bold'
    },
    tipsText: {
        color: Color.tipsColor,
        fontSize: 12,
        flex:1,
        marginLeft:8,
    },
    payWayButton: {
        flexDirection:'row',
        alignItems:'center',
        padding:8,
        paddingTop:4,
        paddingBottom:4,
        backgroundColor:'white',
        marginTop:8,
    },
    payButton: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Color.themeColor,
        height:40,
        marginTop:16,
        borderRadius:3,
    },
    payButtonText: {
        color:'white',
        fontWeight:'bold',
        fontSize:18
    },
    card: {
        height: 35,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        flexDirection: 'row',
        marginTop: 1,
    },
    addButton: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 1,
    },
});

class Recharge extends PureComponent {


    constructor(props){
        super(props);
        this.state = {
            hudType:'none',
            selectCardIndex:props.defaultIndex,
        }
    }

    paying = false;
    componentDidMount() {
        if (this.props.config === null) {
            this.props.getRechargeConfig();
        }
    }

    _renderMoneyBox() {
        const {
            loading,
            loadError,
            config,
            selectIndex,
        } = this.props;
        if (loading) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animated={true} size={'small'} color={Color.themeColor}/>
                </View>
            )
        }
        if (loadError) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.getRechargeConfig();
                    }}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    <ZIPText style={{fontSize: 13, color: Color.red}}>
                        Load error, tap to reload
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        if (config === null) {
            return null;
        }

        return (
            <View style={{paddingTop: 8, paddingBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                    config.map((data, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                onPress={() => {
                                    if (selectIndex !== index) {
                                        this.props.selectMoneyIndex(index)
                                    }
                                }}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: (screenSize.width - 32) / 3,
                                    height: (screenSize.width - 32) / 6,
                                    backgroundColor: selectIndex === index ? Color.themeColor : 'white',
                                    flexDirection: 'column',
                                    marginRight: index % 3 !== 2 ? 8 : 0,
                                    marginTop: parseInt(index / 3) > 0 ? 10 : 0,
                                }}
                            >
                                <ZIPText style={{color: selectIndex === index ? 'white' : 'black', fontWeight:'bold'}}>
                                    {data.amount}
                                </ZIPText>
                                {
                                    data.plus !== 0 ?
                                        <ZIPText style={{color: selectIndex === index ? 'white' : Color.red}}>
                                            +{data.plus}
                                        </ZIPText> :
                                        null
                                }
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    _pay() {
        this.paying = true;
        if (this.props.payWay === 0) {
            //信用卡支付
            this._payWithCreditCard();
        } else {
            //PayPal支付
            this._payWithPayPal();
        }
    }

    _payWithCreditCard() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            },()=>{
                this.hud.show('paying...')
            })
        } else {
            this.hud.show('paying...')
        }

        if (this.state.selectCardIndex < 0 || (this.state.selectCardIndex > this.props.card.length - 1)) {
            this.setState({
                hudType:'error',
            },()=>{
                this.hud.show('Please select a credit card',1500);
            });
            this.paying = false;
            return;
        }

        netWork(
            'GET',
            PAY_WITH_CREDIT_CARD,
            'cardId=' +
            this.props.card[this.state.selectCardIndex].cardId +
            '&amount=' +
            this.props.config[this.props.selectIndex].amount,
            true
        )
            .then(json=>{
                this.paying = false;
                this.setState({
                    hudType:'success',
                },()=>{
                    this.hud.show(json.msg,1500);
                });
                //刷新member信息
                this.props.getMember();
                this.time = setTimeout(()=>{
                    Navigation.popToRoot(this.props.componentId);
                   // this.props.navigator.popToRoot();
                },1500);
            })
            .catch(err=>{
                this.paying = false;
                this.setState({
                    hudType:'error'
                },()=>{
                    this.hud.show(err,1500);
                })
            })
    }

    _payWithPayPal() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType:'none'
            },()=>{
                this.hud.show('paying...')
            })
        } else {
            this.hud.show('paying...')
        }
        PayPal.payWithAmount(
            `${this.props.config[this.props.selectIndex].amount}`,
            (singal,nonce)=>{
                if (singal) {
                    netWork(
                        'GET',
                        PAY_WITH_PAYPAL,
                        'payment_method_nonce=' +
                        nonce +
                        '&amount=' +
                        `${this.props.config[this.props.selectIndex].amount}`,
                        true
                    ).then(json=>{
                        this.paying = false;
                        this.setState({
                            hudType:'success',
                        },()=>{
                            this.hud.show(json.msg,1500);
                        });
                        if (this.props.fromLocker === true) {
                            this.props.loadProfile();
                        } else {
                            this.props.getMember();
                        }
                        this.time = setTimeout(()=>{
                            Navigation.pop(this.props.componentId);
                            //this.props.navigator.pop();
                        },1500);
                    }).catch(err=>{
                        this.paying = false;
                        this.setState({
                            hudType:'error',
                        },()=>{
                            this.hud.show(error,1500);
                        })
                    })
                } else {
                    this.paying = false;
                    this.setState({
                        hudType:'error',
                    },()=>{
                        this.hud.show(nonce,1500);
                    });

                }
            });
    }

    _renderCard() {
        /*
        card: state.wallet.card,
        loadingCard: state.wallet.loading,
        loadCardError: state.wallet.loadError,
        defaultIndex: state.wallet.defaultIndex,
        * */
        if (this.props.payWay !== 0) {
            return null;
        }
        const {
            card,
            loadingCard,
            loadCardError,
            defaultIndex
        } = this.props;
        if (loadingCard) {
            return (
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                >
                    <ActivityIndicator
                        animated={true}
                        color="gray"
                        size="small"
                    />
                    <ZIPText style={{marginLeft:4}}>
                        Loading credit card
                    </ZIPText>
                </View>
            )
        }

        if (loadCardError) {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        height:35,
                        backgroundColor:'white',
                        marginTop:1,
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                    onPress={()=>{
                        this.props.loadCreditCard();
                    }}
                >
                    <ZIPText>
                        Tap to reload credit card
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        if (card === null) {
            return <View/>
        }

        let cards = card.map((data, index) => {
            return (
                <View
                    key={index}
                    style={{flexDirection: 'column'}}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.card}
                        onPress={() => {
                            if (this.state.selectCardIndex !== index) {
                                this.setState({
                                    selectCardIndex:index,
                                })
                            }
                        }}
                    >
                        <ZIPText style={{flex: 1, fontFamily:'Menlo'}}>
                            **** **** **** {data.cardLast4}
                        </ZIPText>
                        {this.state.selectCardIndex === index ?
                            <Icon name="md-checkmark" color={Color.themeColor} size={20}/>
                            : null
                        }
                    </TouchableOpacity>
                </View>
            )
        });
        cards.push(
            <TouchableOpacity
                onPress={() => {
                    Navigation.push(this.props.componentId, {
            component: {
                name: 'BindCreditCard',
                passProps: {
                    fromWallet:true
                    },
                options: {
                  topBar: {
                    title: {
                      text: 'Add credit card'
                    }
                  }
                }
              }
          })
                    //添加信用卡
                    
                //     this.props.navigator.push({
                //         screen:'BindCreditCard',
                //         title:'Add credit card',
                //         navigatorStyle:navigatorStyle,
                //         animationType: 'slide-horizontal',
                //         passProps:{
                //             fromWallet:true,
                //         }
                //     })
                }}
                key="add"
                style={styles.addButton}
            >
                <Icon name="md-add" color='black' size={20}/>
            </TouchableOpacity>
        );
        return cards;
    }

    render() {
        const {config, selectIndex, payWay} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{
                        flexDirection: 'column'
                    }}
                >
                    <ZIPText style={styles.titleText}>
                        Please select the amount
                    </ZIPText>
                    {this._renderMoneyBox()}
                    <View style={{padding:8, backgroundColor:'white'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ZIPText style={styles.titleText}>
                            You will pay for the amount of
                        </ZIPText>
                        <ZIPText style={styles.moneyText}>
                            {config === null ? '--' : (' $' + config[selectIndex].amount)}
                        </ZIPText>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ZIPText style={styles.titleText}>
                            You will get extra credit of
                        </ZIPText>
                        <ZIPText style={styles.moneyText}>
                            {config === null ? '--' : (' ' + config[selectIndex].plusUbi + ' U-COIN')}
                        </ZIPText>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Icon name="ios-information-circle" size={16} color={Color.tipsColor}/>
                        <ZIPText style={styles.tipsText}>
                            {'1U-coin=1cent, when you make payment' +
                            ', we charge your account in the order of U-coin' +
                            ', wallet and credit card.'}
                        </ZIPText>
                    </View>
                    </View>
                    <ZIPText style={[styles.titleText,{marginTop:8}]}>
                        Pay way
                    </ZIPText>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{
                            if (payWay !== 0) {
                                this.props.selectPayWay(0);
                            }
                        }}
                        style={styles.payWayButton}
                    >
                        <Icon
                            name={payWay === 0 ? 'ios-radio-button-on':'ios-radio-button-off'}
                            size={28}
                            color={Color.themeColor}
                        />
                        <ZIPText style={{marginLeft:8}}>
                            Credit Card
                        </ZIPText>
                    </TouchableOpacity>
                    {this._renderCard()}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{
                            if (payWay !== 1) {
                                this.props.selectPayWay(1);
                            }
                        }}
                        style={styles.payWayButton}
                    >
                        <Icon
                            name={payWay === 1 ? 'ios-radio-button-on':'ios-radio-button-off'}
                            size={28}
                            color={Color.themeColor}
                        />
                        <ZIPText style={{marginLeft:8}}>
                            PayPal
                        </ZIPText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.payButton}
                        activeOpacity={1}
                        onPress={()=>{
                            if (config !== null) {
                                if (this.paying === false) {
                                    this._pay();
                                }
                            }
                        }}
                    >
                        <ZIPText style={styles.payButtonText}>
                            Pay
                        </ZIPText>
                    </TouchableOpacity>
                </ScrollView>
                <Hud
                    hudType={this.state.hudType}
                    ref={r=>this.hud = r}
                />
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.recharge.loading,
        loadError: state.recharge.loadError,
        config: state.recharge.config,
        selectIndex: state.recharge.selectIndex,
        payWay:state.recharge.payWay,
        card: state.wallet.card,
        loadingCard: state.wallet.loading,
        loadCardError: state.wallet.loadError,
        defaultIndex: state.wallet.defaultIndex,
    }),
    (dispatch) => ({
        getRechargeConfig: () => dispatch(rechargeAction.getRechargeConfig()),
        selectMoneyIndex: (index) => dispatch(rechargeAction.selectIndex(index)),
        selectPayWay:(index)=>dispatch(rechargeAction.selectPayWay(index)),
        getMember: () => dispatch(zipporaHomeActions.getMember()),
        loadProfile: ()=> dispatch(ziplockerProfileActions.loadProfile()),
        loadCreditCard: () => dispatch(walletActions.loadCreditCard())
    })
)(Recharge)