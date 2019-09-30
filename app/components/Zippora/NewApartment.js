/**
 * Created by liuyu on 2017/8/3.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
} from 'react-native'
import {
    Button
} from 'react-native-elements'
import ZIPText from '../ZIPText'
import ZIPTextInput from '../ZIPTextInput'
import {Navigation} from 'react-native-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor,
        flexDirection: 'column',
        paddingLeft: 16,
        paddingRight: 16,
    },
    textInputContainer: {
        marginTop: 8,
        height: 40,
        borderWidth: 1,
        borderColor: '#cdd3de',
        backgroundColor: 'white',
        paddingLeft:4,
        paddingRight:4,
    }
});

export default class NewApartment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zipCode:'',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ZIPText style={{marginTop: 20, color: Color.themeColor, fontWeight: 'bold'}}>
                    Apartment zip code
                </ZIPText>
                    <ZIPTextInput
                        style={{
                            marginTop: 8,
                            height: 40,
                            backgroundColor: 'white',
                            paddingLeft:4,
                            paddingRight:4,
                            borderRadius:3,
                        }}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        value={this.state.zipCode}
                        onChangeText={(text)=>{
                            this.setState({
                                zipCode:text,
                            })
                        }}
                    />
                <Button
                    title={'NEXT'}
                    onPress={() => {
                        Keyboard.dismiss();
                        Navigation.push(this.props.componentId, {
                    component: {
                        name: 'ZipporaSelectAPT',
                        passProps: {
                            zipCode:this.state.zipCode,
                            },
                        options: {
                          topBar: {
                            title: {
                              text: 'Select Apartment'
                            }
                          }
                        }
                      }
                  });
                        // this.props.navigator.push({
                        //     screen: 'ZipporaSelectAPT',
                        //     title: 'Select Apartment',
                        //     backButtonTitle: 'Back',
                        //     animationType: 'slide-horizontal',
                        //     navigatorStyle:navigatorStyle,
                        //     passProps:{
                        //         zipCode:this.state.zipCode,
                        //     }
                        // })
                    }}
                    backgroundColor={Color.themeColor}
                    //raised
                    textStyle={{
                        color: 'white',
                        fontFamily:FontFamily,
                    }}
                    disabled={this.state.zipCode.length === 0}
                    buttonStyle={{
                        borderRadius:3,
                    }}
                    containerViewStyle={{
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 16,
                        borderRadius:3,
                    }}
                />
            </View>
        )
    }
}