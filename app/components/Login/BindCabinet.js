/**
 * Created by liuyu on 2017/5/16.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native'
import {connect} from 'react-redux'
import * as bindCabinetAction from '../../actions/bindCabinetAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import Hud from 'react-native-lyhud'


class SeparatorCabinet extends Component {
    render() {
        return (
            <View style={{height: 8}}>

            </View>
        )
    }
}

class BindCabinet extends Component {


    canSetCabinet = true;
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    componentDidMount() {
        this.props.getCabinetList();
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title:'Skip',
                    id:'skip'
                }
            ],
            animated: true
        });
        this.props.navigator.setOnNavigatorEvent((event)=>{this.onNavigatorEvent(event)})
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'skip') {
                this.props.setCabinet('').then(json=>{}).catch(err=>{});
                this.props.navigator.push({
                    screen: 'BindCreditCard',
                    title: 'Bind Credit Card',
                    backButtonTitle: 'Back',
                    navigatorStyle:navigatorStyle,
                    animationType: 'slide-horizontal',
                });
            }
        }
    }

    _renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (!this.canSetCabinet) {
                        return;
                    }
                    this.canSetCabinet = false;
                    this.hud.show('Please wait...');
                    this.props.setCabinet(item.cabinetId)
                        .then(json=>{
                            console.log(json);
                            this.hud.show(json.msg,1500);
                            this.canSetCabinet = true;
                            if (json.ret === 0) {
                                this.timeout = setTimeout(()=>{
                                    this.props.navigator.push({
                                        screen: 'BindCreditCard',
                                        title: 'Bind Credit Card',
                                        backButtonTitle: 'Back',
                                        navigatorStyle:navigatorStyle,
                                        animationType: 'slide-horizontal',
                                    });
                                    clearTimeout(this.timeout);
                                },1500);
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                            this.hud.show(err,1500);
                            this.canSetCabinet = true;
                        });
                }}
                style={{
                    padding: 16,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Image source={{uri:item.img}} style={{width: 80, height: 80, backgroundColor: 'lightgray'}}>

                </Image>
                <View style={{flex: 1, flexDirection: 'column', marginLeft: 16}}>
                    <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{color: Color.assistTextColor, fontSize: 18, fontWeight: 'bold'}}>
                        ID: {item.cabinetId}
                    </Text>
                    </View>
                    <View style={{flex:1, marginTop:8, marginBottom:8, justifyContent:'center'}}>
                    <Text style={{color: Color.titleColor}}>
                        {item.address}
                    </Text>
                    </View>
                    {
                        item.boxModelCount.length === 0 ? null :
                            <View style={{flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                                {
                                    item.boxModelCount.map((data,index)=>{
                                        return (
                                            <Text key={index} style={{color:Color.red}}>
                                                {`${data.boxModelName}: ${data.count}`}
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        /*
         loading: state.bindCabinet.loading,
         error: state.bindCabinet.error,
         list: state.bindCabinet.list,
         errText
        * */
        const { loading, error, list, errText } = this.props;
        if (loading) {
            return (
                <LoadingView/>
            )
        }

        if (error) {

            let type = errText.indexOf('time out') >= 0 ? 'timeout':'error';
            return (
                <ErrorView
                    text={errText}
                    onReloadPress={()=>{this.props.getCabinetList()}}
                    type={type}/>
            )
        }

        return (
            <View style={{flex: 1, backgroundColor: Color.bgColor}}>
                <FlatList
                    style={{
                        flex: 1
                    }}
                    contentContainerStyle={{flexDirection: 'column'}}
                    ItemSeparatorComponent={SeparatorCabinet}
                    data={list}
                    renderItem={(item) => this._renderItem(item.item)}
                    keyExtractor={(item,index)=>index}
                />
                <Hud textOnly={true} ref={(r)=>this.hud = r}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.bindCabinet.loading,
    error: state.bindCabinet.error,
    list: state.bindCabinet.list,
    errText: state.bindCabinet.errText,
});

const mapDispatchToProps = dispatch => ({
    getCabinetList: () => dispatch(bindCabinetAction.getCabinetList()),
    setCabinet: (cabinetId) => dispatch(bindCabinetAction.setCabinet(cabinetId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BindCabinet)