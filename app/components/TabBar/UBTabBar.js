import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    ViewPropTypes,
    TouchableOpacity,
} from 'react-native';
import fontConf from '../../config/fontConf';
import { Icon } from 'react-native-elements';

/*
 "deliver_icon":"59648",
 "pick_icon":"59649",
 "store_icon":"59650",
 "profile_icon":'59651',
 * */


const UBTabBar = React.createClass({
    fontMap: {
        'Deliver': 'deliver_icon',
        'Pick': 'pick_icon',
        'Store': 'store_icon',
        'My': 'profile_icon',
    },
//RZ deleted
    // propTypes: {
    //     goToPage: React.PropTypes.func,
    //     activeTab: React.PropTypes.number,
    //     tabs: React.PropTypes.array,
    //     backgroundColor: React.PropTypes.string,
    //     activeTextColor: React.PropTypes.string,
    //     inactiveTextColor: React.PropTypes.string,
    //     textStyle: Text.propTypes.style,
    //     tabStyle: ViewPropTypes.style,
    //     renderTab: React.PropTypes.func,
    //     underlineStyle: ViewPropTypes.style,
    // },

    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,
    },


    getDefaultProps() {
        return {
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            backgroundColor: null,
        };
    },

    renderTabOption(name, page) {
    },

    renderTab(name, page, isTabActive, onPressHandler) {
        const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        //const fontWeight = isTabActive ? 'bold' : 'normal';

        return <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle,]}>
                <Text style={[{fontFamily: 'icomoon'}, {
                    color: textColor,
                    backgroundColor: 'transparent',
                    fontSize: 28
                }, textStyle]}>
                    {fontConf(this.fontMap[name])}
                </Text>
                <Text style={[{color: textColor, backgroundColor: 'transparent'}, textStyle,]}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>;
    },

    render() {
        return (
            <View style={[styles.tabs, this.props.style]}>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: Color.themeColor
                }}>

                </View>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    if (page === 1) {
                        let tabs = [];
                        tabs.push(
                            renderTab(name, page, isTabActive, this.props.goToPage)
                        );
                        tabs.push(
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.props.onScanPress}
                                key="scan"
                                style={{
                                    width: 56,
                                    height: 56,
                                    backgroundColor: 'white',
                                    borderRadius: 28,
                                    position: 'relative',
                                    top: -10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width:52,
                                        height:52,
                                        borderRadius: 26,
                                        backgroundColor:Color.themeColor,
                                        alignItems:'center',
                                        justifyContent:'center',
                                    }}
                                >
                                    <Icon
                                        type={'material-community'}
                                        name="qrcode"
                                        size={40}
                                        color={'white'}
                                        style={{paddingTop:4}}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                        return tabs;
                    }
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
            </View>
        );
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default UBTabBar;