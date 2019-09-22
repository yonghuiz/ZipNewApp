/**
 * Created by liuyu on 2017/5/16.
 */
import React, {Component,PureComponent} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    FlatList,
    Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import {
    Button,
} from 'react-native-elements'
import {connect} from 'react-redux'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import * as deliverFromActions from '../../actions/deliverFromAction'
import * as newDeliverActions from '../../actions/newDeliverAction'
import * as newStoreActions from '../../actions/newStoreAction'

const styles = StyleSheet.create({
    menuShadow: {
        shadowColor: 'black',
        shadowOffset: {x: -1, y: 1},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    menuContainer: {
        opacity: 1,
        position: 'relative',
        top: navBarHeight - 10,
        left: screenSize.width - 150 - 10,
        width: 150,
        height: 80,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    menuItem: {
        flex: 1,
        borderBottomColor: Color.bgColor,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.bgColor
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

class DeliverFrom extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        Icon.getImageSource('ios-menu', 30,)
            .then(source => {
                this.props.navigator.setButtons({
                    rightButtons: [
                        {
                            id: 'menu',
                            icon: source,
                        }
                    ],
                    animated: true
                })
            })
            .catch(err => {

            });
        Icon.getImageSource('ios-arrow-back', 30)
            .then(source => {
                this.props.navigator.setButtons({
                    leftButtons: [
                        {
                            id: 'back',
                            icon: source,
                        }
                    ],
                    animated: true
                })
            })
            .catch(err => {

            });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.props.getCargoList();
        this.time && clearTimeout(this.time);
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'menu') {
                this.props.navigator.showModal({
                    screen: 'MenuComponent',
                    navigatorStyle: {
                        navBarHidden: true,
                        statusBarColor: Color.themeColor
                    },
                    passProps: {
                        renderMenu: () => {
                            return (
                                <Animatable.View
                                    animation={'fadeIn'}
                                    duration={100}
                                    style={styles.menuContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            //通过地址搜索
                                            this._dismissModal();
                                            this.time = setTimeout(() => {
                                                this.props.navigator.push({
                                                    screen: 'DeliverSearch',
                                                    title: 'Search deliver',
                                                    passProps: {
                                                        boxId: this.props.boxId,
                                                    },
                                                    animationType: 'slide-horizontal',
                                                    navigatorStyle: navigatorStyle,
                                                })
                                            }, 500);
                                        }}
                                    >
                                        <Text>
                                            Address Search
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        (this.props.deliverList !== null && this.props.deliverList.length !== 0) ?
                                            <TouchableOpacity
                                                style={[styles.menuItem, {borderBottomColor: 'white'}]}
                                                onPress={() => {
                                                    //通过地图选择
                                                    //跳转到地图.
                                                    this._dismissModal();
                                                    if (this.props.deliverList !== null && this.props.deliverList.length !== 0) {
                                                        const list = this.props.deliverList.map((data, index) => {
                                                            let boxText = '';
                                                            let boxEnough = false;
                                                            data.boxModelCount.map((model,index)=>{
                                                                boxText += `${model.boxModelName}: ${model.count}`;
                                                                if (index !== data.boxModelCount.length - 1) {
                                                                    boxText += ' ';
                                                                }
                                                                if (model.boxModelId == this.props.boxId) {
                                                                    boxEnough = model.count > 0;
                                                                    console.log(boxEnough,'boxEnough');
                                                                }
                                                            });
                                                            return {
                                                                ...data,
                                                                boxText,
                                                                boxEnough,
                                                            }
                                                        });
                                                        this.time = setTimeout(() => {
                                                            this.props.navigator.push({
                                                                screen: 'Map',
                                                                title: 'Map',
                                                                passProps: {
                                                                    fromPage: 'deliverfrom',
                                                                    list: list,
                                                                    popPage: this.props.fromPage,
                                                                },
                                                                animationType: 'slide-horizontal',
                                                                navigatorStyle: navigatorStyle,
                                                            })
                                                        }, 500);
                                                    }
                                                }}
                                            >
                                                <Text>
                                                    Map Search
                                                </Text>
                                            </TouchableOpacity> : null
                                    }
                                </Animatable.View>
                            )
                        }
                    },
                    animationType: 'none',
                })
            } else if (event.id === 'back') {
                this.props.navigator.dismissModal();
            }
        }
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
                        if (this.props.fromPage === 'newstore') {
                            this.props.setStoreCabinet(item)
                        } else {
                            this.props.setFromCargo(item);
                        }
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

    _dismissModal() {
        this.props.navigator.dismissModal({
            animationType: 'none'
        })
    }

    _renderList() {
        /*
         loading:false,
         deliverList:null,
         loadError:false,
         error:'',
         * */

        const {loading, deliverList, loadError, error} = this.props;

        if (loading) {
            return <LoadingView/>
        }

        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            console.log(error);
            return (
                <ErrorView
                    text={error}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.getCargoList()
                    }}
                    type={type}
                />
            )
        }

        if (deliverList === null) {
            return <View style={{flex: 1, backgroundColor: Color.bgColor}}/>
        }

        if (deliverList.length === 0) {
            return <ErrorView onReloadPress={() => {
                this.props.getCargoList()
            }} text="Have no data" type="empty"/>
        }

        return (
            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{
                    flexDirection: 'column'
                }}
                data={deliverList}
                renderItem={(item) => this._renderRow(item.item)}
                keyExtractor={(item,index)=>index}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderList()}
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.deliverFrom.loading,
        deliverList: state.deliverFrom.deliverList,
        loadError: state.deliverFrom.loadError,
        error: state.deliverFrom.error,
    }),
    (dispatch) => ({
        getCargoList: () => {
            dispatch(deliverFromActions.getCargoList())
        },
        setFromCargo: (cabinet) => {
            dispatch(newDeliverActions.setFromCabinet(cabinet))
        },
        setStoreCabinet: (cabinet) => {
            dispatch(newStoreActions.setCabinet(cabinet))
        }
    })
)(DeliverFrom)