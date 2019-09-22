/**
 * Created by liuyu on 2017/11/29.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import ZIPText from './ZIPText';
import ZIPTextInput from './ZIPTextInput';

export default class CommonTextInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            focus:false,
        };
    }

    render() {
        return (
            <Animatable.View
                transition="borderBottomColor"
                style={{
                    ...this.props.style,
                    height:50,
                    flexDirection:'row',
                    borderBottomWidth:1,
                    borderBottomColor:this.state.focus ? Color.themeColor : 'lightgray'
                }}
            >
                <View
                    style={{
                        height:50,
                        width:95,
                        justifyContent:'center',
                    }}
                >
                    <ZIPText style={{fontSize:16,paddingLeft:8}}>
                        {this.props.leftTitle}
                    </ZIPText>
                </View>
                <ZIPTextInput
                    style={{flex:1}}
                    {...this.props}
                    onBlur={()=>{
                        this.setState({
                            focus:false,
                        })
                    }}
                    onFocus={()=>{
                        this.setState({
                            focus:true,
                        })
                    }}
                />
                {
                    this.props.rightTitle.length !== 0 ?
                        <TouchableOpacity
                            style={{
                                paddingLeft:4,
                                height:50,
                                alignItems:'center',
                                justifyContent:'flex-end',
                                flexDirection:'row',
                                paddingRight:8
                            }}
                            activeOpacity={1}
                            onPress={this.props.onRightClick}
                        >
                            <ZIPText
                                style={{color:Color.themeColor, fontSize:16}}
                            >
                                {this.props.rightTitle}
                            </ZIPText>
                        </TouchableOpacity>
                        :
                        null
                }
            </Animatable.View>
        )
    }
}

CommonTextInput.propTypes = {
    ...TextInput.propTypes,
    leftTitle:PropTypes.string.isRequired,
    rightTitle:PropTypes.string,
    onRightClick:PropTypes.func,
};

CommonTextInput.defaultProps = {
    rightTitle:'',
};