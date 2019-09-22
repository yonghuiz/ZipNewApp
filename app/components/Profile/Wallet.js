/**
 * Created by liuyu on 2017/8/16.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native'
import {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import * as walletActions from '../../actions/walletAction'
import Icon from 'react-native-vector-icons/Ionicons'
import Hud from 'react-native-lyhud'
import {
    SET_DEFAULT_CARD,
    DEL_CARDCREDIT,
} from '../../config/API'
import ZIPText from '../ZIPText'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor,
        flexDirection: 'column'
    },
    balanceText: {
        fontWeight: '600',
        fontSize:20,
        color:Color.titleColor,
    },
    headerButtonContainer: {
        marginTop: 16,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-around'
    },
    headerButton: {
        height: 40,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: Color.yellow,
        paddingLeft: 20,
        paddingRight: 20,
    },
    walletItemContainer: {
        marginTop: 16,
        height: 40,
        // marginLeft: 16,
        // marginRight: 16,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    card: {
        height: 35,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        marginTop: 1,
    },
    cardOperate: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    cardOperateText: {
        marginLeft: 6,
        color: 'white',
        overflow: 'hidden'
    },
    addButton: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 1,
    },
});

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openIndex: null,
            hudType: 'none',
        }
    }

    componentDidMount() {
        this.props.loadCreditCard();
    }

    _deleteCard(data, index) {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none'
            }, () => {
                this.hud.show('Please wait...')
            })
        } else {
            this.hud.show('Please wait...')
        }

        netWork(
            'GET',
            DEL_CARDCREDIT,
            'cardId=' + data.cardId,
            true
        )
            .then(json => {
                this.setState({
                    hudType:'success',
                    openIndex:null,
                },()=>{
                    this.hud.show(json.msg,1500);
                });
                this.props.deleteCard(index);
            })
            .catch(err => {
                this.setState({
                    hudType:'error'
                },()=>{
                    this.hud.show(err,1500);
                });
            })

    }

    _addCard() {
        this.props.navigator.push({
            screen:'BindCreditCard',
            title:'Add credit card',
            navigatorStyle:navigatorStyle,
            animationType: 'slide-horizontal',
            passProps:{
                fromWallet:true,
            }
        })
    }

    setDefaultCard(data,index) {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none'
            }, () => {
                this.hud.show('Please wait...')
            })
        } else {
            this.hud.show('Please wait...')
        }
        netWork(
            'GET',
            SET_DEFAULT_CARD,
            'cardId=' + data.cardId,
            true
        )
            .then(json=>{
                this.setState({
                    hudType:'success',
                    openIndex:null,
                },()=>{
                    this.hud.show(json.msg,1500);
                });
                this.props.changeDefault(index);
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                    openIndex:null,
                },()=>{
                    this.hud.show(err);
                })
            })
    }

    _renderCreditCard() {
        const {
            loading,
            loadError,
            card,
        } = this.props;
        if (loading) {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator
                        animated={true}
                        color={'gray'}
                        size="small"
                    />
                </View>
            )
        }

        if (loadError) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.loadCreditCard();
                    }}
                    style={{alignItems: 'center', justifyContent: 'center', height: 35, backgroundColor: 'white'}}
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
                            if (this.state.openIndex === index) {
                                this.setState({
                                    openIndex: null
                                })
                            } else {
                                this.setState({
                                    openIndex: index
                                })
                            }
                        }}
                    >
                        <ZIPText style={{flex: 1, fontFamily:'Menlo'}}>
                            **** **** **** {data.cardLast4}
                        </ZIPText>
                        {this.props.defaultIndex === index ?
                            <Icon name="md-checkmark" color={Color.themeColor} size={20}/>
                            : null
                        }
                    </TouchableOpacity>
                    <Animatable.View
                        duration={200}
                        easing="linear"
                        transition="height"
                        style={{
                            height: this.state.openIndex == index ? 35 : 0,
                            backgroundColor: Color.themeColor,
                            flexDirection: 'row',
                        }}
                        removeClippedSubviews={true}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                //delete
                                this._deleteCard(data,index);
                            }}
                            style={styles.cardOperate}
                        >
                            <Icon style={{marginTop: 2}} name="md-close" size={16} color="white"/>
                            <ZIPText style={styles.cardOperateText}>
                                Remove
                            </ZIPText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                //setAsDefault
                                if (this.props.defaultIndex != index) {
                                    this.setDefaultCard(data,index);
                                }
                            }}
                            style={styles.cardOperate}
                        >
                            <Icon style={{marginTop: 2}} name="ios-checkmark" size={26} color="white"/>
                            <ZIPText style={styles.cardOperateText}>
                                SetDefault
                            </ZIPText>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            )
        });
        cards.push(
            <TouchableOpacity
                onPress={() => {
                    //添加信用卡
                    this._addCard()
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
        let wallet = this.props.fromLocker === true ? this.props.profile.wallet : this.props.member.wallet;
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    <View style={{
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        padding:16,
                    }}>
                        <ZIPText style={styles.balanceText}>
                            balance:
                        </ZIPText>
                        <ZIPText style={{fontSize: 40, marginTop:16,color:'red', fontWeight:'bold'}}>
                            {`$${wallet.money}`}
                        </ZIPText>
                    </View>
                    <TouchableOpacity
                        style={styles.walletItemContainer}
                        activeOpacity={1}
                        onPress={()=>{
                            if (this.props.card !== null) {
                                this.props.navigator.push({
                                    screen: 'Recharge',
                                    title: 'Recharge',
                                    navigatorStyle: navigatorStyle,
                                    animationType: 'slide-horizontal',
                                    passProps: {
                                        card: this.props.card,
                                        fromLocker:this.props.fromLocker,
                                    }
                                })
                            }
                        }}
                    >
                        <Image source={require('../../assets/images/recharge.png')}/>
                        <ZIPText style={{ marginLeft:8}}>
                            Recharge
                        </ZIPText>
                    </TouchableOpacity>
                    <View style={[styles.walletItemContainer,{marginTop:1}]}>
                        <Image source={require('../../assets/images/withdraw.png')}/>
                        <ZIPText style={{marginLeft:8}}>
                            Withdraw
                        </ZIPText>
                    </View>
                    <View style={styles.walletItemContainer}>
                        <Image source={require('../../assets/images/ucoin.png')}/>
                        <ZIPText style={{marginLeft:8}}>
                            U-coin
                        </ZIPText>
                        <ZIPText style={{flex: 1, textAlign: 'right', fontWeight: '600',}}>
                            {wallet.ubi}
                        </ZIPText>
                    </View>
                    <View
                        // style={{paddingLeft: 16, paddingRight: 16}}
                    >
                        <ZIPText style={{marginTop: 8, marginBottom: 8, marginLeft:16}}>
                            My credit card
                        </ZIPText>
                        {this._renderCreditCard()}
                    </View>
                </ScrollView>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        member: state.zipporaHome.member,
        profile: state.ziplockerProfile.profile,
        card: state.wallet.card,
        loading: state.wallet.loading,
        loadError: state.wallet.loadError,
        defaultIndex: state.wallet.defaultIndex,
    }),
    (dispatch) => ({
        loadCreditCard: () => dispatch(walletActions.loadCreditCard()),
        changeDefault: (index) => dispatch(walletActions.changeDefault(index)),
        deleteCard: (index) => dispatch(walletActions.deleteCard(index)),
    })
)(Wallet)