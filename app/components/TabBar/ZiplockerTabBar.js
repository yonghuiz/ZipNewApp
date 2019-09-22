/**
 * Created by liuyu on 2017/11/3.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    ViewPropTypes,
    TouchableOpacity,
} from 'react-native';
import ZIPText from "../ZIPText";


export default class ZiplockerTabBar extends PureComponent {
    renderTab(name, page, isTabActive, onPressHandler) {
        const {
            activeTextColor,
            inactiveTextColor,
            textStyle,
            activeTabColor,
            inactiveTabColor
        } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const tabColor = isTabActive ? activeTabColor : inactiveTabColor;
        //const fontWeight = isTabActive ? 'bold' : 'normal';

        return <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor:tabColor,
                height:40,
                borderTopLeftRadius:page === 0 ? 3:0,
                borderBottomLeftRadius:page === 0 ? 3:0,
                borderTopRightRadius:page === this.props.tabs.length - 1 ? 3:0,
                borderBottomRightRadius:page === this.props.tabs.length - 1 ? 3:0,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            activeOpacity={1}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <ZIPText style={{fontSize:16,color:textColor}}>
                {name}
            </ZIPText>
        </TouchableOpacity>;
    }

    render() {
        return (
            <View style={[styles.tabs, this.props.style]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    return this.renderTab(name, page, isTabActive, this.props.goToPage);
                })}
            </View>
        );
    }
}
//RZ Replaced
// ZiplockerTabBar.propTypes = {
//     goToPage: React.PropTypes.func,
//     activeTab: React.PropTypes.number,
//     tabs: React.PropTypes.array,
//     backgroundColor:React.PropTypes.string,
//     activeTextColor:React.PropTypes.string,
//     inactiveTextColor:React.PropTypes.string,
//     textStyle:Text.propTypes.style,
//     tabStyle:ViewPropTypes.style,
//     renderTab:React.PropTypes.func,
//     activeTabColor:React.PropTypes.string,
//     inactiveTabColor:React.PropTypes.string,
// };

ZiplockerTabBar.propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor:PropTypes.string,
    activeTextColor:PropTypes.string,
    inactiveTextColor:PropTypes.string,
    textStyle:Text.propTypes.style,
    tabStyle:ViewPropTypes.style,
    renderTab:PropTypes.func,
    activeTabColor:PropTypes.string,
    inactiveTabColor:PropTypes.string,
};

ZiplockerTabBar.defaultProps = {
    activeTextColor:'white',
    inactiveTextColor: Color.assistTextColor,
    backgroundColor:'transparent',
    activeTabColor:Color.themeColor,
    inactiveTabColor:'white',
};


// const UBTabBar = React.createClass({
//     fontMap: {
//         'Deliver': 'deliver_icon',
//         'Pick': 'pick_icon',
//         'Store': 'store_icon',
//         'My': 'profile_icon',
//     },
//
//     propTypes: {
//         goToPage: React.PropTypes.func,
//         activeTab: React.PropTypes.number,
//         tabs: React.PropTypes.array,
//         backgroundColor: React.PropTypes.string,
//         activeTextColor: React.PropTypes.string,
//         inactiveTextColor: React.PropTypes.string,
//         textStyle: Text.propTypes.style,
//         tabStyle: ViewPropTypes.style,
//         renderTab: React.PropTypes.func,
//         underlineStyle: ViewPropTypes.style,
//     },
//
//     getDefaultProps() {
//         return {
//             activeTextColor: 'navy',
//             inactiveTextColor: 'black',
//             backgroundColor: null,
//         };
//     },
//
//     renderTab(name, page, isTabActive, onPressHandler) {
//         const {activeTextColor, inactiveTextColor, textStyle,} = this.props;
//         const textColor = isTabActive ? activeTextColor : inactiveTextColor;
//         //const fontWeight = isTabActive ? 'bold' : 'normal';
//
//         return <TouchableOpacity
//             style={{flex: 1}}
//             activeOpacity={1}
//             key={name}
//             accessible={true}
//             accessibilityLabel={name}
//             accessibilityTraits='button'
//             onPress={() => onPressHandler(page)}
//         >
//             <View style={[styles.tab, this.props.tabStyle,]}>
//                 <Text style={[{fontFamily: 'icomoon'}, {
//                     color: textColor,
//                     backgroundColor: 'transparent',
//                     fontSize: 28
//                 }, textStyle]}>
//                     {fontConf(this.fontMap[name])}
//                 </Text>
//                 <Text style={[{color: textColor, backgroundColor: 'transparent'}, textStyle,]}>
//                     {name}
//                 </Text>
//             </View>
//         </TouchableOpacity>;
//     },
//
//     render() {
//         return (
//             <View style={[styles.tabs, this.props.style]}>
//                 {this.props.tabs.map((name, page) => {
//                     const isTabActive = this.props.activeTab === page;
//                     const renderTab = this.props.renderTab || this.renderTab;
//                     return renderTab(name, page, isTabActive, this.props.goToPage);
//                 })}
//             </View>
//         );
//     },
// });
//
const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        padding:10,
        flexDirection: 'row',
    },
});