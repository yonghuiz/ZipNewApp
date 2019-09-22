/**
 * Created by liuyu on 2017/11/6.
 */
import React,{ PureComponent } from 'react'
import {
    View,
    FlatList,
    StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import ZIPText from '../ZIPText'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import Svg,{
    Line,
} from 'react-native-svg'
import * as deliveryTransactionAction from '../../actions/deliveryTransactionAction'

const styles = StyleSheet.create({
    itemContainer: {
        marginTop:10,
        paddingLeft:16,
        paddingRight:16,
        paddingTop:8,
        paddingBottom:8,
        backgroundColor:'white',
        flexDirection:'column'
    }
});

class DeliveryTransaction extends PureComponent {

    componentDidMount() {
        this.props.loadList();
    }

    renderItem(item) {
        //console.log(item);
        return (
            <View
                style={styles.itemContainer}
            >
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <ZIPText style={{flex:1}}>
                       {item.deliverId}
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
                        <ZIPText style={{color: '#B5AE35', fontSize: 12}}>
                            {item.cargo.cargoStatusText}
                        </ZIPText>
                    </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
                    <ZIPText style={{fontSize:18,width:90}}>
                        {item.from.zipcode}
                    </ZIPText>
                    <View style={{width:screenSize.width - 32 - 180,height:21}}>
                        <Svg
                            width={screenSize.width - 32 - 180}
                            height="21"
                        >
                            <Line
                                x1="0"
                                y1="10"
                                x2={screenSize.width - 32 - 180}
                                y2="10"
                                stroke={Color.tipsColor}
                                strokeWidth='1'
                            />
                            <Line
                                x1={screenSize.width - 32 - 180 - 1}
                                y1="10"
                                x2={screenSize.width - 32 - 180 - 10}
                                y2="0"
                                stroke={Color.tipsColor}
                                strokeWidth="1"
                            />
                            <Line
                                x1={screenSize.width - 32 - 180 - 1}
                                y1="10"
                                x2={screenSize.width - 32 - 180 - 10}
                                y2="21"
                                stroke={Color.tipsColor}
                                strokeWidth="1"
                            />
                        </Svg>
                    </View>
                    <ZIPText style={{fontSize:18,width:90, textAlign:'right'}}>
                        {item.to.zipcode}
                    </ZIPText>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
                    <ZIPText style={{color:Color.titleColor, fontSize:13}}>
                        {item.from.time}
                    </ZIPText>
                    <View style={{flex:1}}>

                    </View>
                    <ZIPText style={{color:Color.titleColor, fontSize:13}}>
                        {item.to.time}
                    </ZIPText>
                </View>
            </View>
        )
    }

    render() {
        const {
            loading,
            loadError,
            error,
            list,
        } = this.props;
        if (loading && list === null) {
            return <LoadingView/>
        }

        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            let text = error === 'time out' ? 'Request time out':'System error';
            return (
                <ErrorView
                    text={text}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.loadList()
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
                return <LoadingView/>
            }
            return (
                <ErrorView onReloadPress={() => {
                    this.props.loadList()
                }} text="Have no data" type="empty"/>
            )
        }

        return (
            <FlatList
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{flexDirection: 'column'}}
                data={list}
                renderItem={(item)=>this.renderItem(item.item)}
                keyExtractor={(item,index)=>index}
                refreshing={loading}
                onRefresh={() => {
                    this.props.loadList()
                }}
            />
        )
    }
}

export default connect(
    (state)=>({
        loading:state.deliverytransaction.loading,
        loadError:state.deliverytransaction.loadError,
        error:state.deliverytransaction.error,
        list:state.deliverytransaction.list,
    }),
    (dispatch)=>({
        loadList:()=>dispatch(deliveryTransactionAction.loadList())
    })
)(DeliveryTransaction)