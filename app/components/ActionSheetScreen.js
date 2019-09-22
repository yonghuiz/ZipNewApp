/**
 * Created by liuyu on 2017/7/6.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import * as Animatable from 'react-native-animatable'

export default class ActionSheetScreen extends Component {
    static navigatorStyle = {
        screenBackgroundColor: 'transparent',
        modalPresentationStyle: 'overCurrentContext',
    };

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
            this.props.navigator.dismissModal({animationType: 'none'})
        }).catch((err) => {

        })
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
                        {
                            this.props.actionTitles.map((data, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            if (this.props.disableIndex.indexOf(index) >= 0) {
                                                return;
                                            }
                                            this.props.onActionClick(index);
                                            this.dismiss();
                                        }}
                                        key={index}
                                        style={{
                                            height: 40,
                                            backgroundColor: 'white',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: index > 0 ? 1 : 0,
                                        }}
                                    >
                                        <Text
                                            style={{color: this.props.disableIndex.indexOf(index) >= 0 ? Color.bgColor : 'black'}}>
                                            {data}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.dismiss();
                            }}
                            style={{
                                height: 40,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>

                </Animatable.View>
            </TouchableOpacity>
        )
    }
}

ActionSheetScreen.propTypes = {
    onActionClick: PropTypes.func.isRequired,
    actionTitles: PropTypes.array.isRequired,
    disableIndex: PropTypes.array,
};

ActionSheetScreen.defaultProps = {
    disableIndex: [],
};