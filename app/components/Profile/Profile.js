/**
 * Created by liuyu on 2017/5/15.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigation } from 'react-native-navigation'
import {

    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    View,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import ZIPText from '../ZIPText'
// rz const appPackage = require('../../../package.json')
const appPackage = require('../../../version.json')
import { repeatPress } from '../RepeatPress'

class ProfileItem extends Component {
    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this.props.onPress}
            >
                <View style={styles.itemContainer}>
                    <Image source={this.props.icon}
                        style={{ width: 20, height: 20 }} resizeMode="stretch" />
                    <ZIPText style={styles.itemText}>
                        {this.props.title}
                    </ZIPText>
                    {
                        this.props.subtitle !== null ?
                            <ZIPText style={styles.itemPrice}>
                                {this.props.subtitle}
                            </ZIPText> :
                            null
                    }
                    <Icon
                        name="ios-arrow-forward"
                        color={'black'}
                        size={20}
                        style={{ marginRight: 8, marginTop: 3 }}
                    />

                </View>
            </TouchableWithoutFeedback>
        )
    }
}

ProfileItem.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: Image.propTypes.source.isRequired,
    onPress: PropTypes.func.isRequired,
};

class Profile extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    componentDidMount() {
        console.log('componentDidMount');
        if (this.props.loadingMember === false && this.props.member === null) {
            this.props.getMember();
        }
    }

    componentWillMount() {
        console.log('willMount');
    }

    items = [{ title: 'Wallet', icon: require('../../assets/images/wallet.png') },
    { title: 'Zippora Log', icon: require('../../assets/images/zipporalog.png') },
    { title: 'Statement', icon: require('../../assets/images/statement.png') },
    { title: 'About Us', icon: require('../../assets/images/aboutus.png') }];

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                    {this._renderContent()}
                </View>
                <View style={{ flex: 0.1, backgroundColor: 'white' }}>
                    <Text style={{ position: 'absolute', width: '100%', textAlign: 'center', bottom: 10 }}>
                        Version:{appPackage.version}
                    </Text>
                </View>
            </View>
        )
    }
    _renderContent() {
        const { loadingMember, member } = this.props;
        const avatar = member === null ? require('../../assets/images/proimage.png') :
            member.profile.avatar === '' ?
                require('../../assets/images/proimage.png') :
                { uri: this.props.member.profile.avatar };
        return (
            <ScrollView
                style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingMember}
                        onRefresh={() => {
                            this.props.getMember()
                        }}
                    />
                }
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        if (repeatPress(this)) return;
                        if (member !== null) {
                            Navigation.push(this.props.componentId, {
                                component: {
                                    name: 'ProfileInfo',

                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'Profile Info'
                                            }
                                        }
                                    }
                                }
                            });


                            // this.props.navigator.push({
                            //     screen: "ProfileInfo",
                            //     navigatorStyle: navigatorStyle,
                            //     animationType: 'slide-horizontal',
                            //     title: 'Profile info',
                            //     backButtonTitle:'Back',
                            //     overrideBackPress:true,
                            //     backButtonHidden: Platform.OS === 'android'?false:true,
                            // })
                        }
                    }}
                    style={styles.chail}
                >
                    <View style={{ width: 16 }} />
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}
                    >
                        <Image source={avatar} style={{ width: 60, height: 60, borderRadius: 30 }} />
                        <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: 60, marginLeft: 8 }}>
                            <ZIPText style={styles.instructions}>
                                {member === null ? '--' : (member.profile.nickName || '--')}
                            </ZIPText>
                            <ZIPText style={styles.instructions}>
                                {member === null ? '--' : member.member.phone}
                            </ZIPText>
                        </View>
                    </View>
                    <View style={{ width: 20 }}>
                        <Icon
                            name="ios-arrow-forward"
                            color={'white'}
                            size={20}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.container}>
                    {this._renderItems()}
                </View>
            </ScrollView>
        );
    }

    _renderItems() {
        return this.items.map((data, index) => {
            if (index === 0) {
                return (
                    <ProfileItem
                        key={index}
                        title={data.title}
                        icon={data.icon}
                        subtitle={this.props.member === null ? '--' : `$${this.props.member.wallet.money}`}
                        onPress={() => {
                            if (repeatPress(this)) return;
                            //跳转到wallet
                            Navigation.push(this.props.componentId, {
                                component: {
                                    name: 'Wallet',

                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'Wallet'
                                            }
                                        }
                                    }
                                }
                            });
                            // this.props.navigator.push({
                            //     screen: 'Wallet',
                            //     navigatorStyle: navigatorStyle,
                            //     title: 'Wallet',
                            //     backButtonTitle: 'Back',
                            //     navBarNoBorder: true,
                            //     animationType: 'slide-horizontal',
                            // });
                        }}
                    />
                )
            }
            return (
                <ProfileItem
                    key={index}
                    title={data.title}
                    icon={data.icon}
                    onPress={() => {
                        if (repeatPress(this)) return;
                        if (this.props.member === null) {
                            return;
                        }
                        switch (index) {
                            case 1:
                                //zipporaLog,
                                Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'ZipporaLog',

                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'Zippora Log',
                                                }
                                            }
                                        }
                                    }
                                });
                                // this.props.navigator.push({
                                //     screen: 'ZipporaLog',
                                //     navigatorStyle: navigatorStyle,
                                //     title: 'Zippora Log',
                                //     backButtonTitle: 'Back',
                                //     animationType: 'slide-horizontal',
                                // });
                                break;
                            case 2:
                                Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'Statement',

                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'Statement',
                                                }
                                            }
                                        }
                                    }
                                });
                                //跳转到statement
                                // this.props.navigator.push({
                                //     screen: 'Statement',
                                //     navigatorStyle: navigatorStyle,
                                //     title: 'Statement',
                                //     backButtonTitle: 'Back',
                                //     animationType: 'slide-horizontal',
                                // });
                                break;
                            case 3:
                                //跳转到about us,
                                Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'AboutUs',

                                        options: {
                                            topBar: {
                                                title: {
                                                    text: 'About Us',
                                                }
                                            }
                                        }
                                    }
                                });
                                // this.props.navigator.push({
                                //     screen: 'AboutUs',
                                //     navigatorStyle: navigatorStyle,
                                //     title: 'About us',
                                //     backButtonTitle: 'Back',
                                //     animationType: 'slide-horizontal',
                                // });
                                break;
                        }
                    }}
                />
            )
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    instructions: {
        color: 'white',
        fontSize: 15,
    },
    chail: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.themeColor,
    },

    itemContainer: {
        height: 50,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 8,
        alignItems: 'center',
        borderColor: '#E0E7EF',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    itemText: {
        marginLeft: 16,
        color: 'black',
        fontSize: 16,
        flex: 1
    },
    itemPrice: {
        marginRight: 5,
        alignItems: 'flex-end',
        color: 'black',
        fontSize: 16,
    }

});

export default connect(
    (state) => ({
        loadingMember: state.zipporaHome.loadingMember,
        member: state.zipporaHome.member,
    }),
    (dispatch) => ({
        getMember: () => dispatch(zipporaHomeActions.getMember()),
    })
)(Profile)