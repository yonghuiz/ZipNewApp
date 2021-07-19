/**
 * Created by liuyu on 2017/5/15.
 */
import React, { Component, PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native'
import Svg, {
    Polygon,
    Circle,
    Rect,
    Line,
} from 'react-native-svg'
import { connect } from 'react-redux'
import * as deliverAction from '../../actions/deliverAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    assistHeader: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    assistTitle: {
        flex: 1,
        lineHeight: 25,
    },
    itemHeader: {
        height: 44,
        flexDirection: 'row',
    },
    deliverButton: {
        width: 120,
        height: 30,
        backgroundColor: Color.blue,
        borderRadius: 30,
        padding: 8
    },
    deliverButtonText: {
        textAlign: 'center',
        color: Color.grayText,
        fontSize: 13,
        fontWeight: 'bold'
    }
});

class ItemSeparatorComponent extends Component {
    render() {
        return (
            <View style={{ height: 20 }}>

            </View>
        )
    }
}


class Deliver extends PureComponent {


    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.list === null) {
            this.props.getDeliverList();
        }
        this.props.getCabinetList();
    }

    _renderItem(item) {
        console.log(item.deliverTraceList);
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.push({
                        screen: 'DeliverInfo',
                        title: 'Deliver info',
                        passProps: { deliverInfo: item },
                        animationType: 'slide-horizontal',
                        navigatorStyle: navigatorStyle,
                    })
                }}
                activeOpacity={1}
                style={{
                    flexDirection: 'column',
                    padding: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    backgroundColor: 'white'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ZIPText style={{ flex: 1 }}>
                        Order ID: {item.deliverId}
                    </ZIPText>
                    <View
                        style={{
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#B5AE35',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 8,
                            paddingRight: 8,
                            paddingTop: 4,
                            paddingBottom: 4,
                        }}
                    >
                        <ZIPText style={{ color: '#B5AE35', fontSize: 12 }}>
                            {item.cargo.cargoStatusText}
                        </ZIPText>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View
                        style={{
                            width: 40,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ZIPText style={{ fontSize: 20 }}>
                            To
                        </ZIPText>
                    </View>
                    <ZIPText style={{ flex: 1, color: Color.titleColor }}>
                        {item.to.address}
                    </ZIPText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View
                        style={{
                            width: 40,
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ width: 1, height: 10, backgroundColor: Color.themeColor }} />
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Color.themeColor }} />
                        <View style={{ width: 1, height: 10, backgroundColor: Color.themeColor }} />
                    </View>
                    <ZIPText style={{ flex: 1, color: Color.titleColor }}>
                        {item.deliverTraceList[0].text}
                    </ZIPText>
                    <ZIPText style={{ color: Color.titleColor }}>
                        {item.deliverTraceList[0].time}
                    </ZIPText>
                </View>
            </TouchableOpacity>
        )
    }

    renderList() {
        const { loading, error, list, errText } = this.props;
        if (loading && list === null) {
            return <LoadingView />
        }
        if (error) {
            let type = errText === 'time out' ? 'timeout' : 'error';
            return (
                <ErrorView
                    text={errText}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.getDeliverList()
                    }}
                    type={type}
                />
            )
        }
        if (list === null) {
            return null;
        }
        if (list.length === 0) {
            if (loading) {
                return <LoadingView />
            }
            return (
                <ErrorView onReloadPress={() => {
                    this.props.getDeliverList()
                }} text="No Data" type="empty" />
            )
        }
        return (
            <FlatList
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{ flexDirection: 'column' }}
                ItemSeparatorComponent={ItemSeparatorComponent}
                data={list}
                renderItem={(item) => this._renderItem(item.item)}
                refreshing={loading}
                onRefresh={() => {
                    this.props.getDeliverList()
                }}
                onScrollBeginDrag={this.props.onScrollBeginDrag}
                onScrollEndDrag={this.props.onScrollEndDrag}
                keyExtractor={(item, index) => (index)}
            />
        )
    }

    _renderAroundInfo() {
        /*
         aroundInfo:null,
         getAroundError:false,
         aroundErrorText:'',
         * */
        const { aroundInfo, getAroundError, aroundErrorText } = this.props;
        if (getAroundError) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.getCabinetList();
                    }}
                    style={[styles.assistHeader]}
                >
                    <Text style={{ flex: 1, color: Color.red }}>
                        {aroundErrorText + ' tap to reload'}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            if (aroundInfo === null) {
                return null;
            } else {
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigator.push({
                                screen: 'AroundInfo',
                                title: 'Around you',
                                navigatorStyle: navigatorStyle,
                                animationType: 'slide-horizontal',
                                passProps: {
                                    cabinetList: aroundInfo.cabinetList,
                                    courierList: aroundInfo.courierList,
                                }
                            })
                        }}
                        style={styles.assistHeader}
                    >
                        <ZIPText style={styles.assistTitle}>
                            There is <ZIPText style={{ color: Color.red }}>{aroundInfo.cabinetList.length}</ZIPText> Lockers, <Text style={{ color: Color.red }}>{aroundInfo.courierList.length} </Text>
                            couriers within 2 miles
                        </ZIPText>
                        <Image source={require('../../assets/images/ditu.png')} />
                    </TouchableOpacity>
                )
            }
        }
    }


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: Color.bgColor }}>
                {this._renderAroundInfo()}
                <View style={{ padding: 16, paddingBottom: 8, paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontSize: 18 }}>
                        My delivery orders
                    </Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigator.push({
                                screen: 'NewDeliver',
                                title: 'New delivery',
                                navigatorStyle: navigatorStyle,
                                animationType: 'slide-horizontal'
                            })
                        }}
                        style={{
                            backgroundColor: Color.themeColor,
                            flexDirection: 'row',
                            padding: 8,
                            alignItems: 'center'
                        }}
                    >
                        <Icon name="md-add" color="white" size={16} />
                        <ZIPText style={{ color: 'white', marginLeft: 4 }}>
                            New deliver
                        </ZIPText>
                    </TouchableOpacity>
                </View>
                {this.renderList()}
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.deliver.loading,
        list: state.deliver.list,
        error: state.deliver.error,
        errText: state.deliver.errText,
        aroundInfo: state.deliver.aroundInfo,
        getAroundError: state.deliver.getAroundError,
        aroundErrorText: state.deliver.aroundErrorText,
    }),
    (dispatch) => ({
        getDeliverList: () => dispatch(deliverAction.getDeliverList()),
        getCabinetList: () => dispatch(deliverAction.getCabinetList()),
    }),
)(Deliver)