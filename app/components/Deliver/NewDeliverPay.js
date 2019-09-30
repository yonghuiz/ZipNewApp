/**
 * Created by liuyu on 2017/11/6.
 */
import React, {PureComponent} from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Hud from 'react-native-lyhud'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import {
    CANCEL_DELIVER,
    PAY_DELIVER,
} from '../../config/API'
import * as deliverAction from '../../actions/deliverAction'
import * as myPickActions from '../../actions/myPickupAction'

const styles = StyleSheet.create({
    infoTitleContainer: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white'
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.titleColor
    },
    itemContainer: {
        padding: 8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 1,
        height: 70,
        backgroundColor: 'white',
    },
    itemTitle: {
        color: Color.titleColor,
        fontSize: 15,
    },
    itemSubTitle: {
        fontSize: 16,
    },
    payButton: {
        height: 50,
        backgroundColor: Color.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 18
    }
});

class NewDeliverPay extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            hudType: 'none',
        };
        IonIcon.getImageSource('ios-arrow-back', 40, 'white').then(image => {
            props.navigator.setButtons({
                leftButtons: [
                    {
                        icon: image,
                        id: 'payBackButton'
                    }
                ]
            })
        });
        props.navigator.setOnNavigatorEvent((event) => this.onNavigatorEvent(event));
    }

    componentDidMount() {

    }

    onNavigatorEvent(event) {

        if (event.id === 'didAppear') {
            this.props.navigator.setDrawerEnabled({
                side: 'left',
                enabled: true,
            });
        }

        if (event.id === 'didDisappear') {
            this.props.navigator.setDrawerEnabled({
                side: 'left',
                enabled: false
            });
        }


        if (event.id === 'payBackButton') {
            Alert.alert(
                'Cancel this deliver',
                'Sure to Cancel?',
                [
                    {
                        text: 'Cancel',
                    },
                    {
                        text: 'Sure',
                        onPress: () => {
                            this.cancelDeliver();
                        }
                    }
                ]
            )
        }
    }

    cancelDeliver() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
            }, () => {
                this.hud.show('Please wait');
            })
        } else {
            this.hud.show('Please wait');
        }

        netWork(
            'GET',
            CANCEL_DELIVER,
            'deliverId=' +
            this.props.deliverId,
            true
        )
            .then(json => {
                this.setState({
                    hudType: 'success',
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
                this.time = setTimeout(() => {
                    Navigation.pop(this.props.componentId);
                  //  this.props.navigator.pop();
                }, 1500);
            })
            .catch(err => {
                this.setState({
                    hudType: 'error'
                }, () => {
                    this.hud.show(err, 1500);
                });
            })
    }

    payDeliver() {
        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none',
            }, () => {
                this.hud.show('paying...');
            })
        } else {
            this.hud.show('paying...');
        }
        netWork('GET', PAY_DELIVER, 'deliverId=' + this.props.deliverId, true)
            .then(json => {
                this.setState({
                    hudType: 'success',
                }, () => {
                    this.hud.show(json.msg, 1500);
                });
                this.props.getDeliverList();
                this.props.loadPickList();
                this.time = setTimeout(() => {
                    this.props.navigator.push({
                        screen: 'NewDeliverDone',
                        title: 'New Delivery',
                        backButtonTitle: '',
                        navigatorStyle: navigatorStyle,
                        animationType: 'slide-horizontal'
                    });
                }, 1500);
            })
            .catch(err => {
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 1500);
                });
            })
    }

    render() {
        /*
        loading:state.newDeliverPay.loading,
        loadError:state.newDeliverPay.loadError,
        deliverInfo:state.newDeliverPay.deliverInfo,
        error:state.newDeliverPay.error,
        * */

        const { deliverInfo } = this.props;

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <ScrollView
                    style={{
                        flex: 1,
                        backgroundColor: 'white'
                    }}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        backgroundColor: Color.bgColor
                    }}
                >
                    <View style={styles.infoTitleContainer}>
                        <ZIPText style={styles.infoTitle}>
                            Delivery information
                        </ZIPText>
                    </View>
                    <View style={styles.itemContainer}>
                        <ZIPText style={styles.itemTitle}>
                            Package size
                        </ZIPText>
                        <ZIPText style={styles.itemSubTitle}>
                            {deliverInfo.boxModelName}
                        </ZIPText>
                    </View>
                    {
                        deliverInfo.toPhone !== '' && deliverInfo.toPhone !== undefined &&
                        <View style={styles.itemContainer}>
                            <ZIPText style={styles.itemTitle}>
                                Consignee phone
                            </ZIPText>
                            <ZIPText style={styles.itemSubTitle}>
                                {deliverInfo.toPhone}
                            </ZIPText>
                        </View>
                    }
                    {
                        deliverInfo.toEmail !== '' && deliverInfo.toEmail !== undefined &&
                        <View style={styles.itemContainer}>
                            <ZIPText style={styles.itemTitle}>
                                Consignee email
                            </ZIPText>
                            <ZIPText style={styles.itemSubTitle}>
                                {deliverInfo.toEmail}
                            </ZIPText>
                        </View>
                    }
                    <View style={[styles.itemContainer, {height: 100}]}>
                        <ZIPText style={styles.itemTitle}>
                            From ziplocker
                        </ZIPText>
                        <ZIPText style={[styles.itemSubTitle, {marginTop: 4}]}>
                            {deliverInfo.from.cabinetId}
                        </ZIPText>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 8,
                            paddingRight: 8
                        }}>
                            <ZIPText style={{color: Color.titleColor, flex: 1}}>
                                {deliverInfo.from.address}
                            </ZIPText>
                            <Icon name="location-on" color={Color.themeColor} size={28}/>
                        </View>
                    </View>
                    <View style={[styles.itemContainer, {height: 100}]}>
                        <ZIPText style={styles.itemTitle}>
                            To ziplocker
                        </ZIPText>
                        <ZIPText style={[styles.itemSubTitle, {marginTop: 4}]}>
                            {deliverInfo.to.cabinetId}
                        </ZIPText>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 8,
                            paddingRight: 8
                        }}>
                            <ZIPText style={{color: Color.titleColor, flex: 1}}>
                                {deliverInfo.to.address}
                            </ZIPText>
                            <Icon name="location-on" color={Color.themeColor} size={28}/>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 1,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 20,
                        }}
                    >
                        <ZIPText style={styles.itemTitle}>
                            Fee
                        </ZIPText>
                        <ZIPText
                            style={{
                                color: Color.red,
                                fontSize: 24,
                                fontWeight: 'bold'
                            }}
                        >
                            ${deliverInfo.price}
                        </ZIPText>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={styles.payButton}
                    activeOpacity={1}
                    onPress={() => {
                        this.payDeliver();
                    }}
                >
                    <ZIPText
                        style={styles.payButtonText}
                    >
                        Pay
                    </ZIPText>
                </TouchableOpacity>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        deliverId:state.newDeliverDone.deliverId,
    }),
    (dispatch) => ({
        getDeliverList: () => dispatch(deliverAction.getDeliverList()),
        loadPickList: () => dispatch(myPickActions.loadPickList())
    }),
)(NewDeliverPay)