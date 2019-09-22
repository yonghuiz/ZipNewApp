/**
 * Created by liuyu on 2017/7/24.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import * as newDeliverActions from '../../actions/newDeliverAction'
import {connect} from 'react-redux'
import EntypoIcon from 'react-native-vector-icons/Entypo'

const styles = {
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
};

class DeliverToList extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        if (this.props.list.length !== 0) {
            EntypoIcon.getImageSource('location', 26)
                .then(source => {
                    this.props.navigator.setButtons({
                        rightButtons: [
                            {
                                id: 'location',
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
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'location') {
                //跳转到地图页面
                this.props.navigator.push({
                    screen:'Map',
                    title:'Map',
                    passProps: {
                        fromPage:'deliverto',
                        toPhone:this.props.toPhone,
                        toName:this.props.toName,
                        list:this.props.list,
                    },
                    animationType: 'slide-horizontal',
                    navigatorStyle: navigatorStyle,
                })
            }
        }
    }

    _renderRow(item) {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{marginBottom: 10, backgroundColor: 'white', flexDirection: 'row', padding: 8,}}
                onPress={() => {
                    if (item.boxEnough) {
                        this.props.setToCabinet(item, this.props.toPhone, this.props.toName);
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
                        {item.boxText}
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
                    item.boxEnough ? null :
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
        if (this.props.list.length === 0) {
            return (
                <View style={{flex: 1, backgroundColor: Color.bgColor, padding: 16, flexDirection: 'column'}}>
                    <View style={{padding: 8}}>
                        <Text>
                            Sorry, there is no matched cabinet for you to deliver
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <FlatList
                style={{flex: 1, backgroundColor: Color.bgColor}}
                contentContainerStyle={{
                    flexDirection: 'column'
                }}
                data={this.props.list}
                renderItem={(item) => this._renderRow(item.item)}
                keyExtractor={(item,index)=>(index)}
            />
        )
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        setToCabinet: (cabinet, toPhone, toName) => {
            dispatch(newDeliverActions.setToCabinet(cabinet, toPhone, toName))
        }
    })
)(DeliverToList)