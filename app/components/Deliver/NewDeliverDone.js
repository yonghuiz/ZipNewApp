/**
 * Created by liuyu on 2017/11/6.
 */
import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native'
import ZIPText from "../ZIPText";
import ZIPTextInput from '../ZIPTextInput'
import Hud from 'react-native-lyhud'
import {connect} from 'react-redux'
import {
    UPDATE_DELIVER,
} from '../../config/API'
import * as deliverAction from '../../actions/deliverAction'
import * as myPickActions from '../../actions/myPickupAction'
import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view'

const styles = StyleSheet.create({
    infoTitleContainer: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white'
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.titleColor
    },
    itemContainer: {
        padding: 8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 1,
        height: 70,
        backgroundColor: 'white',
    },
    itemTitle: {
        color: Color.titleColor,
        fontSize: 15,
    },
    itemInput: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
        width: screenSize.width,
    },
    doneButton: {
        height: 50,
        backgroundColor: Color.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 18
    }
});

class NewDeliverDone extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            cargoIndex: null,
            weight: '',
            worth: '',
            name: '',
            hudType:'none',
        };
    }

    updateDeliver() {
        let params = 'deliverId=' + this.props.deliverId;
        let needUpdate = false;
        if (this.state.cargoIndex !== null) {
            needUpdate = true;
            params += '&cargoTypeId=' + this.props.cargoTypes[this.state.cargoIndex].cargoTypeId;
        }

        if (this.state.weight.length !== 0) {
            needUpdate = true;
            params += '&cargoWeight=' + this.state.weight;
        }

        if (this.state.worth.length !== 0) {
            needUpdate = true;
            params += '&cargoWorth=' + this.state.worth;
        }

        if (this.state.name.length !== 0) {
            needUpdate = true;
            params += '&toName=' + this.state.name;
        }

        if (needUpdate) {
            if (this.state.hudType !== 'none') {
                this.setState({
                    hudType:'none'
                },()=>{
                    this.hud.show('update deliver');
                });
            } else {
                this.hud.show('update deliver');
            }
            //updateDeliver
            netWork('GET',UPDATE_DELIVER,params,true)
                .then(json=>{
                    this.setState({
                        hudType:'success',
                    },()=>{
                        this.hud.show(json.msg,1500);
                    });
                    this.props.loadPickList();
                    this.props.getDeliverList();
                    this.time = setTimeout(()=>{
                        Navigation.popToRoot(this.props.componentId);
                        //this.props.navigator.popToRoot();
                    },1500);
                })
                .catch(err=>{
                    this.setState({
                        hudType:'error',
                    },()=>{
                        this.hud.show(err,1500);
                    })
                })
        } else {
            Navigation.popToRoot(this.props.componentId);
           // this.props.navigator.popToRoot();
        }
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <KeyboardAwareScrollView
                    extraScrollHeight={70}
                    keyboardShouldPersistTaps="handled"
                    style={{flex: 1}}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        backgroundColor: Color.bgColor
                    }}
                >
                    <View style={styles.infoTitleContainer}>
                        <ZIPText>
                            Additional infomation
                        </ZIPText>
                    </View>
                    <TouchableOpacity
                        style={styles.itemContainer}
                        activeOpacity={1}
                        onPress={() => {
                            Keyboard.dismiss();
                            //弹出type选择
                            this.props.navigator.showModal({
                                screen: 'ActionSheetScreen',
                                navigatorStyle: {
                                    navBarHidden: true,
                                    statusBarColor: Color.themeColor
                                },
                                animationType: 'none',
                                passProps: {
                                    onActionClick: (index) => {
                                        if (this.state.cargoIndex !== index) {
                                            this.setState({
                                                cargoIndex: index,
                                            })
                                        }
                                    },
                                    actionTitles: this.props.cargoTypes.map((data, index) => {
                                        return data.cargoTypeName
                                    })
                                }
                            });
                        }}
                    >
                        <ZIPText style={styles.itemTitle}>
                            Good type
                        </ZIPText>
                        <ZIPText
                            style={[styles.itemInput, {marginTop: 8}]}
                        >
                            {this.state.cargoIndex === null ? "Please select" : this.props.cargoTypes[this.state.cargoIndex].cargoTypeName}
                        </ZIPText>
                    </TouchableOpacity>
                    <View style={styles.itemContainer}>
                        <ZIPText style={styles.itemTitle}>
                            Weight(kg)
                        </ZIPText>
                        <ZIPTextInput
                            style={styles.itemInput}
                            placeholder="Input"
                            keyboardType="number-pad"
                            value={this.state.weight}
                            onChangeText={(text) => {
                                this.setState({
                                    weight: text,
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <ZIPText style={styles.itemTitle}>
                            Worth($)
                        </ZIPText>
                        <ZIPTextInput
                            style={styles.itemInput}
                            placeholder="Input"
                            keyboardType="number-pad"
                            value={this.state.worth}
                            onChangeText={(text) => {
                                this.setState({
                                    worth:text,
                                })
                            }}
                        />
                    </View>
                    <View style={[styles.itemContainer, {marginBottom: 1}]}>
                        <ZIPText style={styles.itemTitle}>
                            Consignee name
                        </ZIPText>
                        <ZIPTextInput
                            style={styles.itemInput}
                            placeholder="Input"
                            value={this.state.name}
                            onChangeText={(text) => {
                                this.setState({
                                    name:text,
                                })
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    style={styles.doneButton}
                    activeOpacity={1}
                    onPress={() => {
                        Keyboard.dismiss();
                        this.updateDeliver();
                    }}
                >
                    <ZIPText style={styles.doneButtonText}>
                        Done
                    </ZIPText>
                </TouchableOpacity>
                <Hud hudType={this.state.hudType} ref={r=>this.hud = r} />
            </View>
        )
    }
}

export default connect(
    (state) => ({
        cargoTypes: state.newDeliver.cargoTypes,
        deliverId:state.newDeliverDone.deliverId,
    }),
    (dispatch) => ({
        getDeliverList: () => dispatch(deliverAction.getDeliverList()),
        loadPickList: () => dispatch(myPickActions.loadPickList())
    })
)(NewDeliverDone)

