/**
 * Created by liuyu on 2017/8/3.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Hud from 'react-native-lyhud'
import {
    Button
} from 'react-native-elements'
import {
    CANCEL_APARTMENT
} from '../../config/API'
import {connect} from 'react-redux'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import ZIPText from '../ZIPText'
import {Navigation} from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    infoContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: Color.graygreen
    },
    priceContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    overdueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    }

});

class ZipproaAPTInfo extends Component {


    _cancelBindApt() {
        this.hud.show('Please wait...');
        netWork(
            'GET',
            CANCEL_APARTMENT,
            'apartmentId=' + this.props.info.apartmentId,
            true)
            .then(json => {
                this.hud.show(json.msg, 1500);
                this.props.loadZipList();
                this.time = setTimeout(() => {
                    clearTimeout(this.time);
                    Navigation.pop(this.props.componentId);
                   // this.props.navigator.pop();
                }, 1500);
            })
            .catch(err => {
                this.hud.show(err, 1500);
            })
    }

    render() {
        const {info} = this.props;
        let disabled = false;

        for (index in info.zipporaList) {
            if (info.zipporaList[index].storeList.length > 0) {
                disabled = true;
                break;
            }
        }

        let timeUnit = 'th';
        if (info.chargeDay == '1' || info.chargeDay == '21') {
            timeUnit = 'st';
        }
        if (info.chargeDay == '2' || info.chargeDay == '22') {
            timeUnit = 'nd';
        }
        if (info.chargeDay == '3' || info.chargeDay == '33') {
            timeUnit = 'rd';
        }

        console.log('info',info);

        return (
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:20}}>
                <View style={styles.infoContainer}>
                    <Image source={require('../../assets/images/apartment.png')}/>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginLeft: 16,
                        }}
                    >
                        <ZIPText style={{fontSize: 17, fontWeight: '500', color: Color.titleColor, padding: 2}}>
                            {`${info.unitName}, ${info.apartmentName}`}
                        </ZIPText>
                        <ZIPText
                            numberOfLines={2}
                            style={{color: Color.tipsColor, fontSize: 13, padding: 2}}
                        >
                            ADDRESS: {info.address}
                        </ZIPText>
                    </View>
                </View>
                {
                    info.zipporaList.length > 0 &&
                    <View style={styles.sectionContainer}>
                        <ZIPText style={{color: Color.titleColor, fontSize: 15}}>
                            Zipporas
                        </ZIPText>
                    </View>
                }
                {
                    info.zipporaList.map((data, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    //跳转到ZipporaLocation
                                    Navigation.push(this.props.componentId, {
                                        component: {
                                            name: 'ZipproaLocation',
                                             passProps: {
                                                zippora:data,
                                                 },
                                            options: {
                                            topBar: {
                                                title: {
                                                text: `Zippora Package Locker ${data.cabinetId}`,
                                                }
                                            }
                                            }
                                        }
                                    });
                                    // this.props.navigator.push({
                                    //     screen:'ZipproaLocation',
                                    //     title:`Zippora Package Locker ${data.cabinetId}`,
                                    //     navigatorStyle:navigatorStyle,
                                    //     backButtonTitle:'Back',
                                    //     animationType:'slide-horizontal',
                                    //     passProps:{
                                    //         zippora:data,
                                    //     }
                                    // })
                                }}
                                key={data.cabinetId}
                                style={[
                                    styles.infoContainer,
                                    {
                                        borderTopColor:Color.bgColor,
                                        borderTopWidth:index > 0 ? 1: 0
                                    }
                                ]}
                            >
                                <View style={{padding: 4, backgroundColor: Color.themeColor}}>
                                    <Image source={require('../../assets/images/cabinet-l.png')}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text numberOfLines={2} style={{color: Color.green}}>
                                      {`  Zippora Package Locker ${data.cabinetId}`}
                                    </Text>
                                </View>
                                <Icon
                                    name="ios-pin"
                                    size={30}
                                    color={Color.themeColor}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
                <View style={styles.sectionContainer}>
                    <ZIPText style={{color: Color.titleColor, fontSize: 15}}>
                        Pricing
                    </ZIPText>
                </View>
                <View style={styles.priceContainer}>
                    <ZIPText style={{color: Color.themeColor, fontSize: 17, fontWeight: 'bold'}}>
                        <ZIPText style={{color: Color.red}}>
                            ${info.price}
                        </ZIPText>
                        {' per month'}
                    </ZIPText>
                    <ZIPText style={{color: Color.themeColor, marginTop: 4}}>
                        Renew on {info.chargeDay}{timeUnit} monthly
                    </ZIPText>
                </View>
                {this.renderOverdue(info.boxPenalty)}
                <Button
                    title="Unsubscribe this apartment"
                    onPress={() => {
                        //取消绑定快递柜
                        Alert.alert(
                            'Confirm',
                            'Are you sure you want to unsubscribe '+info.apartmentName+' ?',
                            [
                                {text:'Cancel'},
                                {text:'OK',onPress:()=>{this._cancelBindApt();}}
                            ]
                        )
                        
                    }}
                    textStyle={{fontFamily:FontFamily}}
                    backgroundColor={Color.orange}
                    //raised
                    containerViewStyle={{
                        borderRadius:3
                    }}
                    buttonStyle={{
                        borderRadius:3
                    }}
                    disabled={disabled}
                />
                <Hud textOnly={true} ref={r => this.hud = r}/>
            </ScrollView>
        )
    }
    renderOverdue(boxPenalty){
        let arr =[]
        for(let k in boxPenalty){
            let p = boxPenalty[k];
            let item = {key:k,info:p,}
            arr.push(item);
            //console.log('renderOverdue-item:',p,item);
        }
        return(
            <View>
                <View style={styles.sectionContainer}>
                    <ZIPText style={{color: Color.titleColor, fontSize: 15}}>
                        Overdue Fee
                    </ZIPText>
                </View>
                <View style={styles.priceContainer}>
                    
                    <FlatList
                        data = {arr}
                        renderItem = {({item})=><ZIPText style={{color:Color.themeColor}}>
                        {item.info.box_model_name+' Locker:   '}
                        <ZIPText style={{color: Color.red}}>${item.info.amount}</ZIPText>
                        {' per day'}
                        
                        </ZIPText>}
                    />
                    <ZIPText style={{color:Color.tipsColor,padding:20}}>
                        {'You will be charged for overdue fee if you do not pick up the package within '}
                        <ZIPText style={{color: Color.red}}>{arr[0].info.grace_day}</ZIPText>
                        {' days of receiving the notification.'}
                    </ZIPText>
                </View>
            </View>
        )
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        loadZipList: () => dispatch(zipporaHomeActions.loadZipList()),
    })
)(ZipproaAPTInfo)