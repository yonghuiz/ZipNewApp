/**
 * Created by liuyu on 2017/7/6.
 */
import React, { Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'



export default BackButton = (props)=> {
        this.onBackPress = props.onBackPress;
        return (
            <TouchableOpacity 
                onPress={()=>{
                    Navigation.handleDeepLink({
                        link:'goBack',
                    });
                }}
            >
            <View  style={{marginLeft:-10,flexDirection: 'row',width:50}}>
                <View>
                    
                    <Icon
                        name="ios-arrow-back"
                        size={35}
                        color='white'
                    />
                </View>
                <View>
                    <Text style={{
                            marginLeft: 5,
                            marginTop:8,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 16,
                        }}>
                        Back
                    </Text>
                </View>
            </View>
            </TouchableOpacity>
        )
    }


