/**
 * Created by liuyu on 2017/12/15.
 */
import React, {PureComponent} from 'react';
import {View, StatusBar, TouchableOpacity, Keyboard} from 'react-native';
import Hud from 'react-native-lyhud';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonTextInput from '../CommonTextInput';
import Md5 from '../../config/md5';
import ZIPText from '../ZIPText';
import {VERIFY_ACCOUNT} from '../../config/API';
import {Navigation} from 'react-native-navigation';
import CheckBox from 'react-native-checkbox';
import {repeatPress} from '../RepeatPress';
import LoadingView from '../LoadingView';

export default class NewRegister extends PureComponent {
  signing = false;
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phoneNum: '',
      password: '',
      confirmPassword: '',
      hudType: 'none',
      checkedUserAgreement: true,
      loading: false,
    };
  }
  canSingUP() {
    return (
      this.state.email.length !== 0 &&
      this.state.password.length !== 0 &&
      this.state.confirmPassword.length !== 0 &&
      this.state.checkedUserAgreement
    );
  }
  signUpButtonColor() {
    if (this.canSingUP()) {
      return 'rgba(42,187,103,1)';
    } else {
      return 'rgba(42,187,103,0.5)';
    }
  }

  signUpTextColor() {
    if (this.canSingUP()) {
      return 'white';
    } else {
      return 'rgba(255,255,255,0.3)';
    }
  }

  signUp() {
    this.signing = true;
    if (this.state.hudType === 'none') {
      this.hud.show('please wait');
    } else {
      this.setState(
        {
          hudType: 'none',
        },
        () => {
          this.hud.show('Please wait');
        },
      );
    }

    let param = new FormData();
    param.append('email', this.state.email);
    param.append('psd1', Md5.digest_s(this.state.password));
    param.append('psd2', Md5.digest_s(this.state.confirmPassword));
    if (this.state.phoneNum !== '') {
      param.append('phone', this.state.phoneNum.replace(/\s/g, ''));
    }

    netWork('POST', VERIFY_ACCOUNT, param, false)
      .then(json => {
        this.signing = false;
        this.setState(
          {
            hudType: 'success',
          },
          () => {
            this.hud.show(json.msg, 1500);
          },
        );
        this.timeout = setTimeout(() => {
          userInfo.accessToken = json.data.accessToken;
          userInfo.memberId = json.data.memberId;
          userInfo.psd = json.data.psd;
          if (json.data.statusDetail.hasBindAddress == 0) {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'AddAddress',

                options: {
                  topBar: {
                    title: {
                      text: 'Add a delivery address',
                    },
                  },
                },
              },
            });
            // this.props.navigator.push({
            //   screen: 'AddAddress',
            //   title: 'Add a delivery address',
            //   animationType: 'slide-horizontal',
            //   navigatorStyle: navigatorStyle,
            // });
          } else {
            storage.save({
              key: 'isLogin',
              data: true,
              expires: null,
            });
            storage.save({
              key: 'userInfo',
              data: {
                accessToken: userInfo.accessToken,
                memberId: userInfo.memberId,
                psd: userInfo.psd,
              },
              expires: null,
            });

            Navigation.setRoot({
              root: {
                stack: {
                  id: 'Stack.Home3',
                  children: [
                    {
                      component: {
                        id: 'ZipporarHome',
                        name: 'ZipporaHome',
                      },
                    },
                  ],
                },
              },
            });
            // Navigation.startSingleScreenApp({
            //     screen: {
            //         screen: 'ZipporaHome',
            //         navigatorStyle: navigatorStyle,
            //     },
            //     appStyle: {
            //         orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
            //         hideBackButtonTitle: true
            //     },
            //     // drawer: {
            //     //     left: { // optional, define if you want a drawer from the left
            //     //         screen: 'DrawerScreen',
            //     //     },
            //     //     style: {
            //     //         drawerShadow: false,
            //     //         leftDrawerWidth: 60,
            //     //         contentOverlayColor: 'rgba(0,0,0,0.25)',
            //     //     },
            //     //     disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
            //     // },
            //     animationType: 'fade'
            // })
          }
        }, 1500);
      })
      .catch(err => {
        this.signing = false;
        this.setState(
          {
            hudType: 'error',
          },
          () => {
            this.hud.show(err, 1500);
          },
        );
      });
  }

  render() {
    if (this.state.loading) {
      return <View />;
    }
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="light-content" animated={true} />
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            flexDirection: 'column',
            padding: 8,
          }}
          keyboardShouldPersistTaps={'handled'}>
          <CommonTextInput
            leftTitle="Email"
            placeholder={'Enter E-mail address'}
            placeholderTextColor={'lightgray'}
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({
                email: text,
              });
            }}
          />
          <CommonTextInput
            leftTitle="Phone"
            placeholder={'Enter mobile number(optional)'}
            placeholderTextColor={'lightgray'}
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            value={this.state.phoneNum}
            keyboardType={'numeric'}
            maxLength={12}
            onChangeText={text => {
              let phone = text;
              if (text.length > this.state.phoneNum.length) {
                if (text.length === 3) {
                  phone += ' ';
                } else if (text.length === 7) {
                  phone += ' ';
                }
              } else {
                if (text.length === 9) {
                  phone = phone.substr(0, 8);
                } else if (text.length === 4) {
                  phone = phone.substr(0, 3);
                }
              }
              this.setState({
                phoneNum: phone,
              });
            }}
          />
          <CommonTextInput
            leftTitle="Password"
            placeholder={'Enter Password'}
            placeholderTextColor={'lightgray'}
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={text => {
              this.setState({
                password: text,
              });
            }}
          />
          <CommonTextInput
            leftTitle="Confirm"
            placeholder={'Confirm Password'}
            placeholderTextColor={'lightgray'}
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            secureTextEntry={true}
            value={this.state.confirmPassword}
            onChangeText={text => {
              this.setState({
                confirmPassword: text,
              });
            }}
          />
          <View style={{marginTop: 15, flexDirection: 'row'}}>
            {/* <View style = {{marginTop:5}}>
                        <CheckBox label={''}
                            onChange={(checked)=>{
                                this.setState({checkedUserAgreement:checked});
                            }}
                        />
                        </View> */}
            <View style={{marginLeft: 10}}>
              <ZIPText>
                When you register, you agree to our
                <ZIPText
                  onPress={() => {
                    if (repeatPress(this)) return;
                    Navigation.push(this, {
                      component: {
                        name: 'UserAgreement',

                        options: {
                          topBar: {
                            title: {
                              text: 'User Agreement',
                            },
                          },
                        },
                      },
                    });
                    // this.props.navigator.push({
                    //     screen: 'UserAgreement',
                    //     title: 'User Agreement',
                    //     navigatorStyle: navigatorStyle,
                    //     animationType: 'slide-horizontal',
                    //     backButtonTitle: 'Back',
                    // });
                  }}
                  style={{color: Color.themeColor}}>
                  {' '}
                  User Agreement
                </ZIPText>
              </ZIPText>
            </View>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: this.signUpButtonColor(),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
              marginTop: 16,
            }}
            activeOpacity={1}
            onPress={() => {
              if (!this.canSingUP()) {
                return;
              }
              if (repeatPress(this)) return;
              Keyboard.dismiss();
              if (!this.signing) {
                this.signUp();
              }
            }}>
            <ZIPText
              style={{
                fontSize: 18,
                color: this.signUpTextColor(),
              }}>
              Sign Up
            </ZIPText>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <Hud hudType={this.state.hudType} ref={r => (this.hud = r)} />
      </View>
    );
  }
}
