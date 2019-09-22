/**
 * Created by liuyu on 2017/12/27.
 */
import React, { Component } from 'react'
import {
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import CommonTextInput from '../CommonTextInput'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/Ionicons'
import Hud from 'react-native-lyhud'
import {
    MODIFY_PROFILE
} from '../../config/API'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import { connect } from 'react-redux'

class ModifyHouseHolder extends Component {

    constructor(props) {
        super();
        const members = props.householderMember === '' ? [] : props.householderMember.split(',');
        this.state = {
            householderMember: members,
            name:'',
            hudType:'none'
        };

        props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Done',
                    id: 'houseDone'
                }
            ]
        });

        props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        })
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'houseDone') {
                const modifiedMember = this.state.householderMember.join(',');
                if (modifiedMember === this.props.householderMember) {
                    this.props.navigator.pop()
                } else {
                    if (this.state.hudType !== 'none') {
                        this.setState({
                            hudType:'none'
                        },()=>{
                            this.hud.show('Please wait')
                        })
                    } else {
                        this.hud.show('Please wait')
                    }

                    let param = new FormData();
                    param.append('householderMember',modifiedMember);

                    netWork('POST',MODIFY_PROFILE,param,true)
                        .then(json=>{
                            this.props.getMember();
                            this.setState({
                                hudType:'success'
                            },()=>{
                                this.hud.show(json.msg,1500)
                            });
                            this.time = setTimeout(()=>{
                                this.props.navigator.pop();
                            },1500)
                        })
                        .catch(err=>{
                            this.setState({
                                hudType:'error'
                            },()=>{
                                this.hud.show(err,1500)
                            })
                        })
                }
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white', padding: 8}}>
                <CommonTextInput
                    leftTitle="Name"
                    rightTitle="Add"
                    onRightClick={() => {
                        let members = this.state.householderMember;
                        members.push(this.state.name);
                        this.setState({
                            householderMember:members,
                            name:'',
                        })
                    }}
                    placeholder={'Enter house holder name'}
                    placeholderTextColor={'lightgray'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    value={this.state.name}
                    onChangeText={(text)=>{
                        this.setState({
                            name:text
                        })
                    }}
                    underlineColorAndroid={'transparent'}
                />
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingTop: 8,
                        paddingBottom: 8
                    }}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {
                        this.state.householderMember.map((data, index) => {
                            return (
                                <View key={index} style={{paddingTop: 8, paddingLeft: 8}}>
                                    <View
                                        style={{
                                            padding: 8,
                                            margin: 8,
                                            backgroundColor: Color.themeColor
                                        }}
                                    >
                                        <ZIPText style={{color: 'white', fontSize: 14}}>
                                            {data}
                                        </ZIPText>
                                    </View>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            let newMember = this.state.householderMember;
                                            newMember.splice(index,1);
                                            this.setState({
                                                householderMember:newMember
                                            })
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 0,
                                        }}
                                    >
                                    <Icon
                                        name="ios-close-circle"
                                        color={Color.red}
                                        size={20}
                                        style={{
                                            backgroundColor:'transparent'
                                        }}
                                    />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <Hud hudType={this.state.hudType} ref={r=>this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state)=>({

    }),
    (dispatch)=>({
        getMember: () => dispatch(zipporaHomeActions.getMember()),
    })
)(ModifyHouseHolder)