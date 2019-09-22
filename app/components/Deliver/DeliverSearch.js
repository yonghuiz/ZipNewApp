/**
 * Created by liuyu on 2017/7/31.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native'
import {
    Button,
} from 'react-native-elements'
import {connect} from 'react-redux'
import * as deliverSearchActions from '../../actions/deliverSearchAction'
import * as newDeliverActions from '../../actions/newDeliverAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    searchView: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchTextInput: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        paddingLeft: 8,
        paddingRight: 8,
    },
    boxDisableView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxDisableText: {
        backgroundColor: 'transparent',
        color: Color.orange,
        fontSize: 16,
        fontWeight: 'bold'
    }
});

class DeliverSearch extends Component {
    searchText = '';

    _renderList() {
        /*
         loading:false,
         loadError:false,
         error:'',
         list:null,
         * */
        const {loading, loadError, error, list} = this.props;
        if (loading) {
            return <LoadingView/>
        }
        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            return (
                <ErrorView
                    text={error}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.getCabinet()
                    }}
                    type={type}
                />
            )
        }

        if (list === null) {
            return <View style={{flex: 1, backgroundColor: Color.bgColor}}/>
        }

        if (list.length === 0) {
            return <ErrorView onReloadPress={() => {
                this.props.getCabinet()
            }} text="Have no data" type="empty"/>
        }

        return (
            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{
                    flexDirection: 'column'
                }}
                data={list}
                renderItem={(item) => this._renderRow(item.item)}
            />
        )
    }

    _renderRow(item) {
        let boxText = '';
        let boxEnough = false;
        item.boxModelCount.map((data,index)=>{
            boxText += `${data.boxModelName}: ${data.count}`;
            if (index !== item.boxModelCount.length - 1) {
                boxText += ' ';
            }
            if (data.boxModelId == this.props.boxId) {
                boxEnough = data.count > 0;
            }
        });
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{marginBottom: 10, backgroundColor: 'white', flexDirection: 'row', padding: 8,}}
                onPress={() => {
                    if (boxEnough) {
                        this.props.setFromCargo(item);
                        this.props.navigator.dismissModal();
                    }
                }}
            >
                <Image
                    style={{width: 80, height: 80, backgroundColor: Color.bgColor}}
                    source={{uri: item.img}}
                />
                <View style={{flex: 1, paddingLeft: 8, flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Text style={{color: Color.titleColor, fontWeight: 'bold', fontSize: 16}}>
                        ID: {item.cabinetId}
                    </Text>
                    <Text numberOfLines={2} style={{fontSize: 12, color: Color.tipsColor}}>
                        {item.address}
                    </Text>
                    <Text style={{color: Color.themeColor, fontWeight: 'bold'}}>
                        {boxText}
                    </Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', width: 65}}>
                    <Icon
                        name="ios-pin"
                        size={35}
                        color={Color.blue}
                    />
                    <Text style={{fontSize: 12, color: Color.orange}}>
                        {`${item.dis}miles`}
                    </Text>
                </View>
                {
                    boxEnough ? null :
                        <View style={styles.boxDisableView}>
                            <Text style={styles.boxDisableText}>
                                Box not enough
                            </Text>
                        </View>
                }
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Color.bgColor, flexDirection: 'column'}}>
                <View style={styles.searchView}>
                    <TextInput
                        placeholder='Enter zip code or address'
                        style={styles.searchTextInput}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        returnKeyType={'search'}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.searchText = text;
                        }}
                    />
                    <Button
                        title={'search'}
                        onPress={() => {
                            this.props.getCabinet();
                        }}
                        containerViewStyle={{
                            marginRight: 0,
                            borderRadius: 2
                        }}
                        buttonStyle={{
                            height: 40,
                        }}
                        borderRadius={2}
                        raised={true}
                        backgroundColor={Color.blue}
                    />
                </View>
                {this._renderList()}
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.deliverSearch.loading,
        loadError: state.deliverSearch.loadError,
        error: state.deliverSearch.error,
        list: state.deliverSearch.list,
    }),
    (dispatch) => ({
        getCabinet: (text) => {
            dispatch(deliverSearchActions.getCabinet(text))
        },
        setFromCargo: (cabinet) => {
            dispatch(newDeliverActions.setFromCabinet(cabinet))
        }
    })
)(DeliverSearch)