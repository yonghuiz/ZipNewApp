/**
 * Created by liuyu on 2017/11/9.
 */
import React, {PureComponent} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native'
import ZIPTextInput from '../ZIPTextInput'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Hud from 'react-native-lyhud'
import ZIPText from "../ZIPText";
import {COMPLAIN_PICK, UPLOAD_PHOTO} from '../../config/API'
import Md5 from '../../config/md5'
import { openCamera, openPhotos } from '../ImagePicker'
import { connect } from 'react-redux'
import * as myPickActions from '../../actions/myPickupAction'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.bgColor,
    }
});

class DeclareDeliver extends PureComponent {

    content = '';

    constructor(props) {
        super(props);
        this.state = {
            hudType: 'none',
            images: null,
            barStyle:'light-content',
        }
    }

    declareDeliver() {
        if (this.state.image === null) {
            if (this.state.hudType !== 'error') {
                this.setState({
                    hudType: 'error'
                }, () => {
                    this.hud.show('Please update images', 2000);
                });
            } else {
                this.hud.show('Please update images', 2000);
            }
            return;
        }
        if (this.content.length === 0) {
            if (this.state.hudType !== 'error') {
                this.setState({
                    hudType: 'error'
                },()=>{
                    this.hud.show('Please enter content',2000);
                })
            } else {
                this.hud.show('Please enter content',2000);
            }
            return;
        }

        if (this.state.hudType !== 'none') {
            this.setState({
                hudType: 'none'
            }, () => {
                this.hud.show('Upload image');
            })
        } else {
            this.hud.show('Upload image');
        }
        let formData = new FormData();

        this.state.images.map((data,index)=>{
            const uri = data;
            const file = {uri:uri, type:'multipart/form-data',name:Md5.digest_s(uri) + '.jpg'};
            formData.append(Md5.digest_s(uri),file);
        });

        netWork('POST',UPLOAD_PHOTO,formData,true)
            .then(json=>{
                this.hud.show('Please wait');
                netWork(
                    'GET',
                    COMPLAIN_PICK,
                    'deliverId=' + this.props.deliverId +
                    '&photoIds=' + json.data.succ.join(',') +
                    '&content=' + encodeURIComponent(this.content),
                    true
                )
                    .then(json=>{
                        this.setState({
                            hudType:'success',
                        },()=>{
                            this.hud.show(json.msg,1500);
                        });
                        this.props.loadPickList();
                    })
                    .catch(err=>{
                        this.setState({
                            hudType:'error'
                        },()=>{
                            this.hud.show(err,1500);
                        })
                    })
            })
            .catch(err=>{
                this.setState({
                    hudType:'error',
                },()=>{
                    this.hud.show(err,1500);
                })
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={this.state.barStyle} animated={true}/>
                <KeyboardAwareScrollView
                    style={{
                        flex: 1
                    }}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        padding: 16,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            if (this.state.images !== null) {
                                //跳转到添加删除图片页面
                                this.props.navigator.push({
                                    screen: 'EditDeclareImages',
                                    title: 'Edit images',
                                    navigatorStyle: navigatorStyle,
                                    animationType: 'slide-horizontal',
                                    passProps: {
                                        images: this.state.images,
                                        setImages:(images)=>{
                                            this.setState({
                                                images,
                                            })
                                        }
                                    }
                                });
                                return;
                            }
                            //弹出actionSheet
                            this.props.navigator.showModal({
                                screen: 'ActionSheetScreen',
                                navigatorStyle: {
                                    navBarHidden: true,
                                    statusBarColor: Color.themeColor
                                },
                                animationType: 'none',
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
                                                            images: [image],
                                                            barStyle: 'light-content'
                                                        });
                                                    })
                                                    .catch(err=>{
                                                        this.setState({
                                                            barStyle:'light-content',
                                                        })
                                                    })
                                            }, 500);
                                        } else {
                                            this.timeout = setTimeout(() => {
                                                clearTimeout(this.timeout);
                                                this.setState({
                                                    barStyle: 'default',
                                                });
                                                openPhotos(true)
                                                    .then(images=>{
                                                        this.setState({
                                                            barStyle:'light-content',
                                                            images,
                                                        });
                                                    })
                                                    .catch(err=>{
                                                        this.setState({
                                                            barStyle:'light-content'
                                                        })
                                                    });
                                            }, 500);

                                        }
                                    },
                                    actionTitles: ['Take photo from camera', 'Select from photo']
                                }
                            });
                        }}
                        style={{
                            height: 160,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: 'lightgray',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {
                            this.state.images === null ?
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={require('../../assets/images/shangchuan.png')}/>
                                    <ZIPText style={{marginTop: 8}}>
                                        Upload package photo
                                    </ZIPText>
                                </View> :
                                <Image
                                    style={{height:160,width:screenSize.width - 32}}
                                    source={{uri:this.state.images[0]}}
                                />
                        }
                        {
                            this.state.images === null ? null :
                                <View
                                    style={{
                                        position:'absolute',
                                        right:8,
                                        bottom:8,
                                        padding:8,
                                        paddingTop:4,
                                        paddingBottom:4,
                                        backgroundColor:'rgba(0,0,0,0.7)'
                                    }}
                                >
                                    <ZIPText style={{color:'white'}}>
                                        First image
                                    </ZIPText>
                                </View>
                        }
                    </TouchableOpacity>
                    <ZIPTextInput
                        style={{
                            height: 160,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: 'lightgray',
                            backgroundColor: 'white',
                            padding: 8,
                            marginTop: 10,
                        }}
                        multiline={true}
                        placeholder="Add description here (Within 200 letters)"
                        onChangeText={(text) => {
                            this.content = text;
                        }}
                        maxLength={200}
                    />
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.time && clearTimeout(this.time);
                        this.time = setTimeout(() => {
                            this.declareDeliver();
                        }, 500)
                    }}
                    style={{
                        height: 50,
                        backgroundColor: Color.themeColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ZIPText style={{color: 'white', fontSize: 16}}>
                        Submit
                    </ZIPText>
                </TouchableOpacity>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state)=>({

    }),
    (dispatch)=>({
        loadPickList: () => dispatch(myPickActions.loadPickList())
    }),
)(DeclareDeliver)