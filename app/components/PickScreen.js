/**
 * Created by liuyu on 2017/8/22.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    DatePickerIOS,
    Picker,
    ActivityIndicator,
    Platform,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {
    GET_STATE_LIST
} from '../config/API'
import {Navigation} from 'react-native-navigation'

const styles = StyleSheet.create({
    controlView: {
        backgroundColor: 'white',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        borderBottomColor: Color.bgColor,
        borderBottomWidth: 1,
    },
    controlButton: {
        padding: 8,
        fontWeight: '500',
    },
    title: {
        flex: 1,
        textAlign: 'center'
    },
    pickContainer: {
        height:Platform.OS === 'android' ? 60 : 220,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white'
    }
});

export default class DatePickerScreen extends Component {
   
    static options() {
        return {
                layout: {
                    backgroundColor: 'transparent',
                    modalPresentationStyle: 'overCurrentContext',
                }
    }
    }
    // static navigatorStyle = {
    //     screenBackgroundColor: 
    //     modalPresentationStyle: 'overCurrentContext',
    // };

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            loading:false,
            loadError:false,
            data:null,
            selectState:null,
        }
    }

    componentDidMount() {
        if (this.props.type === 'picker') {
            if (this.state.data === null) {
                this.loadStateList();
            }
        }
    }

    loadStateList() {
        this.setState({
            loading:true,
            loadError:false,
        });
        netWork('GET',GET_STATE_LIST,null,true)
            .then(json=>{
                //console.log(json);
                this.setState({
                    loading:false,
                    data:json.data.stateList,
                    selectState:json.data.stateList[0].stateCode,
                })
            })
            .catch(err=>{
                this.setState({
                    loading:false,
                    loadError:true,
                })
            })
    }

    dismiss() {
        let twoPromise = new Promise((resolve, reject) => {
            Promise.all([
                this.refs.bgView.fadeOut(200),
                this.refs.actionView.slideOutDown(200)
            ]).then(values => {
                resolve(true);
            }).catch(error => {
                reject(error)
            })
        });

        twoPromise.then(() => {
            Navigation.dismissModal(this.props.componentId);rr
          //  this.props.navigator.dismissModal({animationType: 'none'})
        }).catch((err) => {

        })
    }

    _renderPicker() {
        if (this.props.type === 'picker') {
            if (this.state.loading) {
                return (
                    <View style={styles.pickContainer}>
                        <ActivityIndicator animating={true} color={Color.themeColor} size={'small'}/>
                    </View>
                )
            } else {
                if (this.state.loadError) {
                    return (
                        <View style={styles.pickContainer}>
                            <Text style={{flex:1, textAlign:'center', color:Color.red}} onPress={()=>{this.loadStateList()}}>
                                load error, tap to reload
                            </Text>
                        </View>
                    )
                } else {
                    if (this.state.data === null) {
                        return (
                            <View style={styles.pickContainer}>

                            </View>
                        )
                    } else {
                        return (
                            <Picker
                                onValueChange={(value,index)=>{
                                    //console.log(value);
                                    this.setState({
                                        selectState:value,
                                    })
                                }}
                                selectedValue={this.state.selectState}
                                //style={{backgroundColor:Color.bgColor}}
                               style={{height:Platform.OS === 'android' ? 60 : 220, backgroundColor:'white',}}
                                itemStyle={{width:screenSize.width, backgroundColor:'white'}}
                            >
                                {
                                    this.state.data.map((data,index)=>{
                                        return (
                                            <Picker.Item
                                                key={index}
                                                label={data.state}
                                                value={data.stateCode}
                                            />
                                        )
                                    })
                                }
                            </Picker>
                        )
                    }
                }
            }
        } else {
            return (
                <DatePickerIOS
                    style={{backgroundColor:Color.bgColor}}
                    date={this.state.date}
                    onDateChange={(date) => {
                        this.setState({
                            date: date,
                        })
                    }}
                    mode={'date'}
                    maximumDate={new Date()}
                    minimumDate={new Date((new Date()).getFullYear() - 90, 0, 1)}
                />
            )
        }
    }

    render() {
        return (
            <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => {
                this.dismiss()
            }}>
                <Animatable.View
                    animation="fadeIn"
                    easing="linear"
                    ref="bgView"
                    duration={200}
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}
                >
                    <Animatable.View
                        animation="slideInUp"
                        easing="linear"
                        ref="actionView"
                        duration={200}
                        style={{backgroundColor: 'rgba(255,255,255,0.8)'}}
                    >
                        <View style={[styles.controlView, {backgroundColor: this.props.controlViewColor}]}>
                            <Text
                                style={[styles.controlButton, {color: this.props.cancelButtonColor}]}
                                onPress={() => {
                                    this.dismiss();
                                }}
                            >
                                Cancel
                            </Text>
                            <Text style={[styles.title, {color: this.props.titleColor}]}>
                                {this.props.title}
                            </Text>
                            <Text
                                style={[styles.controlButton, {color: this.props.sureButtonColor}]}
                                onPress={() => {
                                    if (this.props.type === 'date') {
                                        this.props.onSureClick(this.state.date);
                                        Navigation.dismissModal(this.props.componentId);
                                    } else {
                                        this.props.onSureClick(this.state.selectState);
                                        Navigation.dismissModal(this.props.componentId);
                                    }
                                    this.dismiss()
                                }}
                            >
                                Sure
                            </Text>
                        </View>
                        {this._renderPicker()}
                    </Animatable.View>
                </Animatable.View>
            </TouchableOpacity>
        )
    }
}

DatePickerScreen.propTypes = {
    controlViewColor: PropTypes.string,
    cancelButtonColor: PropTypes.string,
    sureButtonColor: PropTypes.string,
    title: PropTypes.string,
    titleColor: PropTypes.string,
    onSureClick: PropTypes.func,
    type:PropTypes.oneOf([
        'date',
        'picker'
    ]),
    pickerData:PropTypes.array,
};

DatePickerScreen.defaultProps = {
    controlViewColor: 'white',
    cancelButtonColor: 'black',
    sureButtonColor: 'black',
    title: '',
    titleColor: 'black',
    onSureClick: () => {

    },
    type:'date'
};