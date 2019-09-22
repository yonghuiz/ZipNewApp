/**
 * Created by liuyu on 2017/5/16.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native'
import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    Button
} from 'react-native-elements'
import {
    GET_CABINET_LIST
} from '../../config/API'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor,
    },
    itemContainer: {
        height: 45,
        backgroundColor: 'white',
        marginTop: 1,
        borderLeftColor: Color.blue,
        borderLeftWidth: 3,
        flexDirection: 'row',
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: 'center',
    },
    itemTitle: {
        color: Color.titleColor, fontWeight: 'bold'
    },
    itemTextInput: {
        flex: 1,
        marginRight: 8,
        marginLeft: 8,
        textAlign: 'right',
        color: Color.tipsColor,
    }
});

class ToItem extends Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>
                    {this.props.title}
                </Text>
                <TextInput
                    style={styles.itemTextInput}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    keyboardType={this.props.number ? 'numeric' : 'default'}
                    onChangeText={this.props.onTextChange}
                />
                <Icon name="ios-arrow-forward" color={Color.blue} size={20}/>
            </View>
        )
    }
}

ToItem.propTypes = {
    title: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    number: PropTypes.bool,
};

ToItem.defaultProps = {
    number: true,
};

export default class DeliverTo extends Component {
    mobileNum = null;
    firstName = null;
    zipCode = null;
    cabinetId = null;

    constructor(props) {
        super(props);
        this.state = {
            mobileNum: '',
            firstName: '',
            zipCode: '',
            cabinetId: '',
            nextLoading: false,
        };
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

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'back') {
                this.props.navigator.dismissModal();
            }
        }
    }

    loadCargoList() {
        this.setState({
            nextLoading: true,
        });
        netWork(
            'GET',
            GET_CABINET_LIST,
            `zipCode=${this.state.zipCode}&cabinetId=${this.state.cabinetId}`,
            true)
            .then(json => {
                if (json.ret === 0) {
                    console.log(json);
                    /*
                     let boxText = '';
                     let keys = Object.keys(item.boxModelCount);
                     keys.map((data, index) => {
                     boxText += `${item.boxModelCount[data].boxModelName}: ${item.boxModelCount[data].count}`;
                     if (index !== keys.length - 1) {
                     boxText += ' ';
                     }
                     });

                     const boxEnough = item.boxModelCount[this.props.boxId]['count'] > 0;
                     * */
                    let list = json.data.cabinetList.map((data, index) => {
                        let boxText = '';
                        let boxEnough = false;
                        console.log(data.boxModelCount);
                        data.boxModelCount.map((model,index)=>{
                            boxText += `${model.boxModelName}: ${model.count}`;
                            if (index !== data.boxModelCount.length - 1) {
                                boxText += ' ';
                            }
                            if (model.boxModelId == this.props.boxId) {
                                boxEnough = model.count > 0;
                            }
                        });
                        return {
                            ...data,
                            boxText,
                            boxEnough,
                        }
                    });
                    //加载完成跳转到DeliverToList
                    this.props.navigator.push({
                        screen: 'DeliverToList',
                        title: 'Deliver to',
                        passProps: {
                            list: list,
                            boxId: this.props.boxId,
                            toPhone: this.state.mobileNum,
                            toName: this.state.firstName,
                        },
                        animationType: 'slide-horizontal',
                        navigatorStyle: navigatorStyle,
                    })
                } else {
                    //提示错误
                    Alert.alert('warm tips', json.data.msg);
                }
                this.setState({
                    nextLoading: false,
                })
            })
            .catch(err => {
                console.log(err);
                //提示错误.
                this.setState({
                    nextLoading: false,
                });
                if (err === 'Need Login') {
                    Alert.alert(
                        'warm tips'
                        , err,
                        [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: 'Go to Login',
                                onPress: () => {
                                    console.log('Go to login')
                                },
                            }
                        ]
                    )
                } else {
                    Alert.alert('warm tips', err)
                }
            });
    }

    render() {
        let disable = true;
        if (this.state.mobileNum.length !== 0 && this.state.firstName.length !== 0) {
            if (this.state.zipCode.length !== 0 || this.state.cabinetId.length !== 0) {
                disable = false;
            }
        }

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 16,
                    }}
                >
                    <ToItem
                        title="Mobile Number"
                        onTextChange={(text) => {
                            this.setState({
                                mobileNum: text,
                            });
                        }}
                    />
                    <ToItem
                        title="First Name"
                        number={false}
                        onTextChange={(text) => {
                            this.setState({
                                firstName: text,
                            })
                        }}
                    />
                    <ToItem
                        title="ZipCode"
                        onTextChange={(text) => {
                            this.setState({
                                zipCode: text,
                            })
                        }}
                    />
                    <ToItem
                        title="Cabinet ID"
                        onTextChange={(text) => {
                            this.setState({
                                cabinetId: text,
                            })
                        }}
                    />
                    <Button
                        title={'Next'}
                        onPress={() => {
                            //加载cargo数据, 加载完跳转到DeliverToList
                            if (this.state.nextLoading) {
                                return;
                            }
                            this.loadCargoList();
                        }}
                        backgroundColor={Color.blue}
                        containerViewStyle={{
                            marginTop: 16,
                            marginRight: 0,
                            marginLeft: 0,
                        }}
                        disabled={disable}
                        loading={this.state.nextLoading}
                    />
                    <Text selectable={true} style={{marginTop: 8, color: Color.orange}}>
                        Mobile Number and First Name are require,
                        ZipCode and Cabinet ID must enter one
                    </Text>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}