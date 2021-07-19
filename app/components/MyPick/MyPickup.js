/**
 * Created by liuyu on 2017/11/4.
 */
import React, { PureComponent } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import * as myPickActions from '../../actions/myPickupAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import ZIPText from '../ZIPText'


class SepComponent extends PureComponent {
    render() {
        return (
            <View style={{ height: 10 }} />
        )
    }
}

class MyPickup extends PureComponent {


    componentDidMount() {
        this.props.loadPickList();
    }

    _renderList() {
        const {
            loading,
            loadError,
            error,
            list,
        } = this.props;

        if (loading && list === null) {
            return (
                <LoadingView />
            )
        }

        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            return (
                <ErrorView
                    text={error}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.loadPickList()
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
                    this.props.loadPickList()
                }} text="No Data" type="empty" />
            )
        }

        return (
            <FlatList
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{ flexDirection: 'column' }}
                ItemSeparatorComponent={SepComponent}
                data={list}
                renderItem={(item) => this._renderItem(item.item)}
                refreshing={loading}
                onRefresh={() => {
                    this.props.loadPickList()
                }}
                onScrollBeginDrag={this.props.onScrollBeginDrag}
                onScrollEndDrag={this.props.onScrollEndDrag}
                keyExtractor={(item, index) => (index)}
            />
        )
    }

    _renderItem(item) {
        return (
            <TouchableOpacity
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}
                activeOpacity={1}
                onPress={() => {
                    this.props.navigator.push({
                        screen: 'DeliverInfo',
                        title: 'MyPickup info',
                        passProps: { deliverInfo: item },
                        animationType: 'slide-horizontal',
                        navigatorStyle: navigatorStyle,
                    })
                }}
            >
                <View style={{ paddingLeft: 16, paddingRight: 16, flexDirection: 'row', alignItems: 'center' }}>
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
                <View style={{ marginTop: 8, height: 1, backgroundColor: Color.tipsColor }} />
                <View
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexDirection: 'row',
                        marginTop: 8
                    }}
                >
                    <ZIPText
                        style={{
                            color: Color.titleColor,
                            flex: 1,
                        }}
                    >
                        {`${item.cargo.cargoTypeName}   ${item.cargo.cargoWeight}   ${item.to.box.boxModelName}`}
                    </ZIPText>
                    <ZIPText>
                        Pickup Code: {item.to.pickCode}
                    </ZIPText>
                </View>
                <View
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <ZIPText
                        style={{
                            width: 55,
                            fontSize: 16,
                            textAlign: 'right'
                        }}
                    >
                        FROM:
                    </ZIPText>
                    <ZIPText
                        style={{
                            flex: 1,
                            marginLeft: 16,
                        }}
                    >
                        {item.from.name}
                    </ZIPText>
                </View>
                <View
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4,
                    }}
                >
                    <ZIPText
                        style={{
                            width: 55,
                            fontSize: 16,
                            textAlign: 'right'
                        }}
                    >
                        TO:
                    </ZIPText>
                    <ZIPText
                        style={{
                            flex: 1,
                            marginLeft: 16,
                        }}
                    >
                        ID: {item.to.cabinetId}
                    </ZIPText>
                </View>
                <View
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4,
                    }}
                >
                    <View style={{ width: 50 }}>

                    </View>
                    <ZIPText
                        style={{
                            flex: 1,
                            marginLeft: 16,
                        }}
                    >
                        {item.to.address}
                    </ZIPText>
                </View>
                <View
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        marginTop: 16,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Color.themeColor }} />
                    <ZIPText
                        style={{ flex: 1, marginLeft: 8 }}
                    >
                        {item.deliverTraceList[0].text}
                    </ZIPText>
                    <ZIPText>
                        {item.deliverTraceList[0].time}
                    </ZIPText>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
                {this._renderList()}
            </View>
        )
    }
}


export default connect(
    (state) => ({
        loading: state.myPickup.loading,
        loadError: state.myPickup.loadError,
        error: state.myPickup.error,
        list: state.myPickup.list,
    }),
    (dispatch) => ({
        loadPickList: () => dispatch(myPickActions.loadPickList())
    }),
)(MyPickup)