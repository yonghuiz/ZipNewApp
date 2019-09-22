/**
 * Created by liuyu on 2017/8/21.
 */
import React, {Component} from 'react'
import {
    View,
    TextInput,
    ScrollView,
    Keyboard,
} from 'react-native'
import {
    MODIFY_PROFILE
} from '../../config/API'
import Hud from 'react-native-lyhud'
import { connect } from 'react-redux'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import * as ziplockerProfileActions from '../../actions/ziplockerProfileAction'
import ZIPTextInput from '../ZIPTextInput'

class ModifyProfile extends Component {

    haveChange = false;

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            hudType:'none',
        };
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Save',
                    id: 'save',
                    disabled: true,
                }                
            ],
            animated: true,
        });
        this.props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        });
    }
    showHud(type,msg,after=null){
        if (this.state.hudType !== type) {
            this.setState({
                hudType:type,
            },()=>{this.hud.show(msg,after);})
        } else {
            this.hud.show(msg,after);
        }
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'save') {
                if((this.state.value||'').trim()===''){
                    this.showHud('error','Please input value, value can not be blank.',3000);
                    return;
                }
                Keyboard.dismiss();
                //提交修改信息
                this.showHud('none','Please wait...');
                
                let formData = new FormData();
                formData.append(this.props.type, this.state.value);
                netWork('POST', MODIFY_PROFILE, formData, true)
                    .then(json => {
                        this.showHud('success',json.msg,1500);
                        if (this.props.fromLocker === true) {
                            this.props.loadProfile();
                        } else {
                            this.props.getMember();
                        }
                        this.time = setTimeout(()=>{
                            this.props.navigator.pop();
                        },1500);
                    })
                    .catch(err => {
                        this.setState({
                            hudType:'error',
                        },()=>{
                            this.hud.show(err,1500);
                        });
                    })
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.time);
    }

    componentDidMount() {
        this.time = setTimeout(() => {
            this.refs.textinput.focus();
        }, 500);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, flexDirection: 'column', padding: 16, backgroundColor: Color.bgColor}}>
                    <View style={{
                        paddingLeft: 4,
                        paddingRight: 4,
                        height: 38,
                        backgroundColor: 'white',
                        borderRadius: 4
                    }}>
                        <ZIPTextInput
                            ref="textinput"
                            style={{flex: 1}}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.value}
                            onChange={() => {
                                if (!this.haveChange) {
                                    this.props.navigator.setButtons({
                                        rightButtons: [
                                            {
                                                title: 'Save',
                                                id: 'save',
                                                disabled: false,
                                            }
                                        ],
                                        animated: true,
                                    });
                                    this.haveChange = true;
                                }
                            }}
                            onChangeText={(text) => {
                                this.setState({
                                    value: text,
                                })
                            }}
                            placeholder={this.props.placeholder}
                        />
                    </View>
                </ScrollView>
                <Hud hudType={this.state.hudType} ref={r=>this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state)=>({}),
    (dispatch)=>({
        getMember:()=>dispatch(zipporaHomeActions.getMember()),
        loadProfile:()=>dispatch(ziplockerProfileActions.loadProfile()),
    })
)(ModifyProfile)