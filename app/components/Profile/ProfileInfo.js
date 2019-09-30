/**
 * Created by liuyu on 2017/8/21.
 */
import React, {Component} from 'react'
import {Navigation} from 'react-native-navigation'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar,
    Platform,
    DatePickerAndroid,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import Hud from 'react-native-lyhud'
import Md5 from '../../config/md5'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import * as ziplockerProfileActions from '../../actions/ziplockerProfileAction'
import {
    MODIFY_PROFILE
} from '../../config/API'
import ZIPText from '../ZIPText'
import { openCamera, openPhotos } from '../ImagePicker'
import { repeatPress } from '../RepeatPress'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.bgColor
    },
    itemContainer: {
        flexDirection: 'column',
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: 'white'
    },
    itemInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        paddingTop: 8
    },
    itemTitle: {
        flex: 1,
        fontWeight: 'bold',
        color: Color.titleColor
    },
    itemSubTitle: {
        color: Color.tipsColor,
    },
    itemAvatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
    }
});

class ProfileInfoItem extends Component {
    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.props.onPress}
                style={styles.itemContainer}
            >
                <View
                    style={styles.itemInfoContainer}>
                    <ZIPText style={{
                        flex: 1,
                        fontWeight: 'bold',
                        color: Color.titleColor
                    }}>
                        {this.props.title}
                    </ZIPText>
                    {
                        this.props.isAvatar ?
                            <Image source={this.props.avatar} style={styles.itemAvatar}/> :
                            <ZIPText style={styles.itemSubTitle}>
                                {this.props.subTitle}
                            </ZIPText>
                    }
                    <Icon
                        name="ios-arrow-round-forward"
                        color={Color.bgColor}
                        size={20}
                        style={{marginLeft: 8}}
                    />
                </View>
                {
                    this.props.noBorder ? null :
                        <View style={{height: 1, backgroundColor: Color.bgColor}}/>
                }
            </TouchableOpacity>
        )
    }
}

ProfileInfoItem.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    isAvatar: PropTypes.bool,
    avatar: Image.propTypes.source,
    noBorder: PropTypes.bool,
    onPress: PropTypes.func,
};

ProfileInfoItem.defaultProps = {
    subTitle: '',
    isAvatar: false,
    noBorder: false,
    avatar: null,
    onPress: () => {
    }
};

class ProfileInfo extends Component {
    static options() {
        return {
          topBar: {
           
            
            backButton: 
                {
                    visible: true,
                    color: 'black',
                    id: 'back',
                    //title: 'Back'
                },
                
            rightButtons: {
              id: 'back2',
              text: 'Back',
              testID: "XXXX"
            }
          }
        };
      }
    constructor(props) {
        super(props);
        this.state = {
            barStyle: 'light-content',
            avatar: props.fromLocker === true ? props.profile.profile.avatar : props.member.profile.avatar,
            hudType: 'none',
            date: new Date(),
        };
        Navigation.events().bindComponent(this);
        if (Platform.OS === 'android') {
         //   console.log ("11111");
            Navigation.mergeOptions(this.props.componentId, {
                popGesture: false,
                topBar: {
                  
                    backButton: [
                    {
                        id: 'back',
                        //title: 'Back'
                        
                    }
                    ]
                }
            
                });
            // this.props.navigator.setButtons({
            //     leftButtons: [
            //         {
            //             id: 'back',
            //             component:'BackButton',
            //         },
            //     ],
            //     animated: true
            // })
        }
        
        //end chechk platform
        // this.props.navigator.setOnNavigatorEvent((event) => {
        //     this.onNavigatorEvent(event)
        // });
       // Navigation.events().bindComponent(this);
        // this.props.navigator.setStyle({
        //     disabledBackGesture:true,
        // })

    }
   
    
      navigationButtonPressed({ buttonId }) {
     
        
        //    alert(`navigationButtonPressed: ${buttonId}`); // eslint-disable-line no-alert
          
        if(buttonId ==='back2'){

                        this.onBackPress();
                    }
                    // if(event.type === 'DeepLink'&&event.link==='goBack'){
                    //     this.onBackPress();
                    // }


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
    onBackPress(){
        const profileInfo = this.props.fromLocker === true ? this.props.profile:this.props.member;
        const {member, profile} = profileInfo;
        if((profile.firstName||'').trim()===''){
            this.showHud("error","Please input first name.",2000);
            return;
        }
        if((profile.lastName||'').trim()===''){
            this.showHud("error","Please input last name.",2000);
            return;
        }
        Navigation.pop(this.props.componentId);
       // this.props.navigator.pop();
    }
  

    // onNavigatorEvent(event) {
        
    //         if(event.id ==='backPress'){
    //             this.onBackPress();
    //         }
    //         if(event.type === 'DeepLink'&&event.link==='goBack'){
    //             this.onBackPress();
    //         }
        
    // }

    _updateProfile(type,value) {
        let formData = new FormData();
        formData.append(type, value);
        netWork('POST', MODIFY_PROFILE, formData, true)
            .then(json => {
               if (this.props.fromLocker===true) {
                   this.props.loadProfile();
                } else {
                    this.props.getMember();
                }
            })
            .catch(err => {
console.log(err);
            })
    }

    setAvatar(image) {
        this.setState({
            hudType: 'none'
        }, () => {
            this.hud.show('upload avatar');
        });
        const uri = Platform.OS === 'android' ? image : 'file://' + image;
        let formData = new FormData();
        let file = {uri: uri, type: 'multipart/form-data', name: Md5.digest_s(uri) + '.jpg'};
        formData.append('avatar', file);
        netWork('POST', MODIFY_PROFILE, formData, true)
            .then(json => {
                if (this.props.fromLocker === true) {
                    this.props.loadProfile();
                } else {
                    this.props.getMember();
                }
                this.setState({
                    avatar: image,
                    hudType: 'success',
                }, () => {
                    this.hud.show('upload success', 1000);
                })
            })
            .catch(err => {
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show('upload fail', 1000);
                })
            })
    }

    _pushToModify(passProps) {
        if(repeatPress(this)) return;

        Navigation.push(this.props.componentId, {
            component: {
                name: 'ModifyProfile',
                passProps: {
                    ...passProps,
                      fromLocker:this.props.fromLocker,
                    },
                options: {
                  topBar: {
                    title: {
                      text: passProps.placeholder
                    }
                  }
                }
              }
          });
        // this.props.navigator.push({
        //     screen: 'ModifyProfile',
        //     title: passProps.placeholder,
        //     passProps: {
        //         ...passProps,
        //         fromLocker:this.props.fromLocker,
        //     },
        //     animationType: 'slide-horizontal',
        //     navigatorStyle:navigatorStyle,
        //     backButtonTitle:'Back',
        // })
    }

    _openDatePicker() {
        if (Platform.OS === 'android') {
            DatePickerAndroid.open({
                date: this.state.date,
                minDate: new Date(this.state.date.getFullYear() - 90, 0, 1),
                maxDate: new Date(),
            })
                .then(data=>{
                    //data.action data.year, data.month + 1, data.day
                    let date = new Date(data.year,data.month,data.day);
                    this._updateProfile('birth',date.Format('yyyyMMdd'));
                })
                .catch(err=>{
                    //err.code, err.message
                    alert('open datePicker fail');
                })
        } else {
            Navigation.showModal({
               
                    component: {
                      name: 'PickerScreen',
                      passProps: {
                      //  title: 'Choose a date',
                    onSureClick: (data) => {
                        this._updateProfile('birth',data.Format('yyyyMMdd'));
                      }},
                      options: {
                        topBar: {
                          title: {
                            text: 'Choose a date'
                          }
                        }
                      }
                    }
                 
              });

            // this.props.navigator.showModal({
            //     screen: 'PickerScreen',
            //     navigatorStyle: {
            //         navBarHidden: true,
            //         statusBarColor: Color.themeColor
            //     },
            //     animationType: 'none',
            //     passProps: {
            //         title: 'Choose a date',
            //         onSureClick: (data) => {
            //             this._updateProfile('birth',data.Format('yyyyMMdd'));
            //         }
            //     }
            // });
        }
    }

    _openStatePicker() {

        Navigation.showModal({
            
                component: {
                  name: 'PickerScreen',
                  passProps: {
                  //  title: 'Choose a date',
              
                    type:'picker',
                    onSureClick: (data) => {
                                this._updateProfile('state',data);
                                
                  }},
                  options: {
                    topBar: {
                      title: {
                        text: 'Choose a State'
                      }
                    }
                  }
                }
           
          });

         
        // this.props.navigator.showModal({
        //     screen:'PickerScreen',
        //     navigatorStyle: {
        //         navBarHidden: true,
        //         statusBarColor: Color.themeColor
        //     },
        //     animationType: 'none',
        //     passProps: {
        //         title: 'Choose a state',
        //         type:'picker',
        //         onSureClick: (data) => {
        //             this._updateProfile('state',data);
        //         }
        //     }
        // })
    }
    showModalavatar= () =>   
        Navigation.showModal({
            component: {
             //   name: Screens.Modal,
                name: 'ActionSheetScreen',
 
          
        // this.props.navigator.showModal({
        //     screen: 'ActionSheetScreen',
        //     navigatorStyle: {
        //         navBarHidden: true,
        //         statusBarColor: Color.themeColor
        //     },
        //     animationType: 'none',
            passProps: {
                onActionClick: (index) => {
                    if (index === 0) {
                        this.timeout = setTimeout(() => {
                            clearTimeout(this.timeout);
                            this.setState({
                                barStyle: 'default',
                            });
                            openCamera()
                                .then(image=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    });
                                    this.setAvatar(image);
                                })
                                .catch(err=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    });
                                });
                        }, 500);
                    } else {
                        this.timeout = setTimeout(() => {
                            clearTimeout(this.timeout);
                            this.setState({
                                barStyle: 'default',
                            });
                            openPhotos()
                                .then(image=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    });
                                    this.setAvatar(image)
                                })
                                .catch(err=>{
                                    this.setState({
                                        barStyle:'light-content',
                                    })
                                })
                        }, 500);

                    }
                },
                actionTitles: ['Take photo from camera', 'Select from photo']
            }
        }
        });
    

    render() {

        const profileInfo = this.props.fromLocker === true ? this.props.profile:this.props.member;

        const {member, profile} = profileInfo;
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    style={styles.container}
                >
                    <StatusBar barStyle={this.state.barStyle} animated={true}/>
                    <ProfileInfoItem
                        title="AVATAR"
                        isAvatar={true}
                        avatar={this.state.avatar === '' ? null : {uri: this.state.avatar}}
                        onPress={this.showModalavatar}
                    />
                    <ProfileInfoItem
                        title="NICKNAME"
                        subTitle={profile.nickName || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'nickName',
                                placeholder: 'Nick name',
                                value: profile.nickName || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="EMAIL"
                        subTitle={member.email || ''}
                        // onPress={() => {
                        //     this._pushToModify({type: 'email', placeholder: 'Email', value: member.email || ''});
                        // }}
                    />
                    <ProfileInfoItem
                        title="FIRSTNAME"
                        subTitle={profile.firstName || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'firstName',
                                placeholder: 'First name',
                                value: profile.firstName || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="LASTNAME"
                        subTitle={profile.lastName || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'lastName',
                                placeholder: 'Last name',
                                value: profile.lastName || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="ADDRESS LINE1"
                        subTitle={profile.addressline1 || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'addressline1',
                                placeholder: 'Address line1',
                                value: profile.addressline1 || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="ADDRESS LINE2"
                        subTitle={profile.addressline2 || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'addressline2',
                                placeholder: 'Address line2',
                                value: profile.addressline2 || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="CITY"
                        subTitle={profile.city || ''}
                        onPress={() => {
                            this._pushToModify({type: 'city', placeholder: 'City', value: profile.city || ''});
                        }}
                    />
                    <ProfileInfoItem
                        title="STATE"
                        subTitle={profile.state || ''}
                        onPress={() => {
                            if(repeatPress(this)) return;
                            //弹出州选择
                            this._openStatePicker();
                        }}
                    />
                    <ProfileInfoItem
                        title="ZIPCODE"
                        subTitle={profile.zipcode || ''}
                        onPress={() => {
                            this._pushToModify({
                                type: 'zipcode',
                                placeholder: 'Zip code',
                                value: profile.zipcode || ''
                            });
                        }}
                    />
                    <ProfileInfoItem
                        title="DATE OF BIRTH"
                        subTitle={profile.birth || ''}
                        onPress={() => {
                            if(repeatPress(this)) return;
                            //弹出日期选择
                            this._openDatePicker()

                        }}
                    />
                    <ProfileInfoItem
                        title="PHONE"
                        subTitle={member.phone || ''}
                        noBorder={true}
                        onPress={() => {
                            this._pushToModify({type: 'phone', placeholder: 'Phone', value: member.phone || ''});
                        }}
                    />
                    <View style={{height:20}} />
                    <ProfileInfoItem
                        title="HOUSE HOLDER"
                        subTitle={''}
                        noBorder={false}
                        onPress={() => {
                            if(repeatPress(this)) return;

                            Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'ModifyHouseHolder',
                                        passProps:{
                                    householderMember:profile.householderMember
                                },
                                        options: {
                                        topBar: {
                                            title: {
                                            text: 'Modify Householder'
                            }
                          }
                        }
                      }
                  });
                            // this.props.navigator.push({
                            //     screen:'ModifyHouseHolder',
                            //     title:'Modify Householder',
                            //     passProps:{
                            //         householderMember:profile.householderMember
                            //     },
                            //     navigatorStyle:navigatorStyle,
                            //     animationType:'slide-horizontal',
                            // })
                        }}
                    />
                    <ProfileInfoItem
                        title="MODIFY PASSWORD"
                        subTitle={''}
                        noBorder={true}
                        onPress={() => {
                            if(repeatPress(this)) return;
                            Navigation.push(this.props.componentId, {
                                    component: {
                                        name: 'ModifyPassword',
                                    
                                        options: {
                                        topBar: {
                                            title: {
                                            text: 'Change Password'
                            }
                          }
                        }
                      }
                  });
                            // this.props.navigator.push({
                            //     screen:'ModifyPassword',
                            //     title:'Change password',
                            //     navigatorStyle:navigatorStyle,
                            //     animationType:'slide-horizontal',
                            // })
                        }}
                    />
                    <View style={{height: 20}}/>
                    <ProfileInfoItem
                        title="LOG OUT"
                        subTitle={''}
                        noBorder={true}
                        onPress={() => {
                            if(repeatPress(this)) return;
                            //退出登录
                            logout();
                            Navigation.setStackRoot(this.props.componentId, [
                                        {
                                        component: {
                                            name: 'Login',
                                           
                                            options: {
                                                animations: {
                                                setStackRoot: {
                                                    enabled: true
                                                }
                                                }
                                            }
                                            }
                                    }
                                    ]);
                            // this.props.navigator.resetTo({
                            //     screen: 'Login',
                            //     navigatorStyle: {
                            //         ...navigatorStyle,
                            //         navBarHidden: true,
                            //     },
                            //     animationType: 'fade',
                            //     animated: true,
                            // });
                        }}
                    />
                </ScrollView>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        member: state.zipporaHome.member,
        profile:state.ziplockerProfile.profile,
    }),
    (dispatch) => ({
        getMember: () => dispatch(zipporaHomeActions.getMember()),
        loadProfile: () => dispatch(ziplockerProfileActions.loadProfile())
    })
)(ProfileInfo)