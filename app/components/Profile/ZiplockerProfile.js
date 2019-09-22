/**
 * Created by liuyu on 2017/11/4.
 */
import React, { PureComponent } from 'react'
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ziplockerProfileActions from '../../actions/ziplockerProfileAction'
import ZIPText from '../ZIPText'


class ZiplockerProfile extends PureComponent {

    ziplockerItems = [
        {
            image:require('../../assets/images/lockerwallet.png'),
            title:'Wallet',
        },
        {
            image:require('../../assets/images/transaction.png'),
            title:'Transaction',
        },
        {
            image:require('../../assets/images/lockerstatement.png'),
            title:'Statement',
        },
        {
            image:require('../../assets/images/lockerAbout.png'),
            title:'About us'
        }
    ];

    componentDidMount() {
        this.props.loadProfile();
    }

    render() {
        /*
        loading:state.ziplockerProfile.loading,
        loadError:state.ziplockerProfile.loadError,
        profile:state.ziplockerProfile.profile,
        error:state.ziplockerProfile.error,
        * */
        const {
            loading,
            loadError,
            profile,
            error,
        } = this.props;
        console.log(profile);
        let nickName = '--';
        let phone = '--';
        if (profile !== null) {
            if (profile.profile.nickName !== null && profile.profile.nickName.length !== 0) {
                nickName = profile.profile.nickName;
            }
            phone = profile.member.phone;
        }
        return (
            <ScrollView
                style={{
                    flexDirection:'column',
                    backgroundColor:Color.bgColor,
                    flex:1,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            this.props.loadProfile()
                        }}
                    />
                }
            >
                <TouchableOpacity
                    onPress={()=>{
                        if (profile !== null) {
                            //跳转到个人信息修改页面
                            this.props.navigator.push({
                                screen: "ProfileInfo",
                                navigatorStyle: navigatorStyle,
                                animationType: 'slide-horizontal',
                                title: 'Profile info',
                                passProps:{
                                    fromLocker:true,
                                }
                            })
                        }
                    }}
                    activeOpacity={1}
                    style={{
                        padding:10,
                        flexDirection:'row',
                        backgroundColor:Color.themeColor,
                        alignItems:'center'
                    }}
                >
                    <Image
                        style={{
                            width:40,
                            height:40,
                            backgroundColor:'white',
                            borderRadius:20,
                        }}
                    />
                    {
                        loadError ?
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.loadProfile();
                                }}
                                activeOpacity={1}
                                style={{
                                    flex:1,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginLeft:10,
                                }}
                            >
                                <ZIPText style={{color:Color.red}}>
                                    Press to reload profile
                                </ZIPText>
                            </TouchableOpacity>
                            :
                            <View
                                style={{
                                    flex:1,
                                    flexDirection:'column',
                                    justifyContent:'space-between',
                                    marginLeft:10,
                                }}
                            >
                                <ZIPText style={{color:'white'}}>
                                    {nickName}
                                </ZIPText>
                                <ZIPText style={{color:'white'}}>
                                    {phone}
                                </ZIPText>
                            </View>
                    }
                    <Icon
                        name="ios-arrow-forward"
                        color={'white'}
                        size={20}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                    }}
                >
                    {
                        this.ziplockerItems.map((data,index)=>{
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        width:(screenSize.width - 3) / 4,
                                        height:110,
                                        backgroundColor:'white',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        flexDirection:'column',
                                    }}
                                    onPress={()=>{
                                        if (this.props.profile === null) return;
                                        if (index === 1) {
                                            this.props.navigator.push({
                                                screen:'Transaction',
                                                title:'Transaction',
                                                animationType:'slide-horizontal',
                                                navigatorStyle:navigatorStyle,
                                            })
                                        } else if (index === 0) {
                                            this.props.navigator.push({
                                                screen:'Wallet',
                                                title:'Wallet',
                                                animationType:'slide-horizontal',
                                                navigatorStyle:navigatorStyle,
                                                passProps: {
                                                    fromLocker:true,
                                                }
                                            })
                                        } else if (index === 2) {
                                            this.props.navigator.push({
                                                screen:'Statement',
                                                title:'Statement',
                                                animationType:'slide-horizontal',
                                                navigatorStyle:navigatorStyle,
                                            })
                                        } else if (index === 3) {
                                            this.props.navigator.push({
                                                screen:'AboutUs',
                                                title:'About us',
                                                animationType:'slide-horizontal',
                                                navigatorStyle:navigatorStyle,
                                            })
                                        }
                                    }}
                                >
                                    <Image source={data.image}/>
                                    <ZIPText style={{marginTop:8,}}>
                                        {data.title}
                                    </ZIPText>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        )
    }
}

export default connect(
    (state)=>({
        loading:state.ziplockerProfile.loading,
        loadError:state.ziplockerProfile.loadError,
        profile:state.ziplockerProfile.profile,
        error:state.ziplockerProfile.error,
    }),
    (dispatch)=>({
        loadProfile:()=>dispatch(ziplockerProfileActions.loadProfile())
    }),
)(ZiplockerProfile)