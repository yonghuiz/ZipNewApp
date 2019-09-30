/**
 * Created by liuyu on 2017/8/3.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Hud from 'react-native-lyhud';
import Md5 from '../../config/md5';
import * as zipporaHomeActions from '../../actions/zipporaHomeAction';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { UPLOAD_PHOTO, BIND_APARTMENT } from '../../config/API';
import ZIPText from '../ZIPText';
import { openPhotos, openCamera } from '../ImagePicker';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    infoContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sepView: {
        height: 10,
        backgroundColor: Color.bgColor,
    },
    sectionView: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#747732',
        fontWeight: '500',
    },
    cameraButton: {
        height: 72,
        width: 72,
        marginLeft: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#747732',
        borderRadius: 4,
    },
    photoContainer: {
        width: screenSize.width - 32 - 88,
        height: ((screenSize.width - 32 - 100) / 3) * 2,
        borderWidth: 1,
        borderColor: '#747732',
        backgroundColor: Color.bgColor,
        borderRadius: 4,
        overflow: 'hidden',
    },
});

class UploadCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            hudType: 'none',
            payOffline: true,
        };
    }

    selectPhoto() {
        this.props.navigator.showModal({
            screen: 'ActionSheetScreen',
            navigatorStyle: {
                navBarHidden: true,
                statusBarColor: Color.themeColor,
            },
            animationType: 'none',
            passProps: {
                onActionClick: index => {
                    if (index === 0) {
                        this.timeout = setTimeout(() => {
                            clearTimeout(this.timeout);
                            openCamera()
                                .then(image => {
                                    this.setState({
                                        photo: image,
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }, 500);
                    } else {
                        this.timeout = setTimeout(() => {
                            clearTimeout(this.timeout);
                            openPhotos()
                                .then(image => {
                                    console.log(image);
                                    this.setState({
                                        photo: image,
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }, 500);
                    }
                },
                actionTitles: ['Take photo from camera', 'Select from photo'],
            },
        });
    }

    _bindApartment() {
        const { apt, unit } = this.props;
        /*
             1. 上传图片
             2. 提交绑定apartment
             * */
        this.state.hudType !== 'none' && this.setState({ hudType: 'none' });

        this.hud.show('upload image');
        let formData = new FormData();
        const uri = this.state.photo;
        const file = {
            uri: uri,
            type: 'multipart/form-data',
            name: Md5.digest_s(uri) + '.jpg',
        };
        formData.append(Md5.digest_s(uri), file);
        netWork('POST', UPLOAD_PHOTO, formData, true)
            .then(json => {
                this.hud.show('bind apartment');
                netWork(
                    'GET',
                    BIND_APARTMENT,
                    'apartmentId=' +
                    apt.apartmentId +
                    '&unitId=' +
                    unit.unitId +
                    '&photoIds=' +
                    json.data.succ.join(',') +
                    '&payOffline=' +
                    (this.state.payOffline ? '1' : '0'),
                    true,
                )
                    .then(json => {
                        if (json.ret === 0) {
                            this.setState(
                                {
                                    hudType: 'success',
                                },
                                () => {
                                    this.hud.show(json.msg, 1500);
                                    this.props.loadZipList();
                                    this.time = setTimeout(() => {
                                        //刷新首页数据, 跳转到首页
                                        Navigation.popToRoot(this.props.componentId);
                                        //  this.props.navigator.popToRoot();
                                    }, 1500);
                                },
                            );
                        } else {
                            this.setState(
                                {
                                    hudType: 'error',
                                },
                                () => {
                                    this.hud.show(json.msg, 1500);
                                },
                            );
                        }
                    })
                    .catch(err => {
                        this.setState(
                            {
                                hudType: 'error',
                            },
                            () => {
                                this.hud.show(err, 1500);
                            },
                        );
                    });
            })
            .catch(err => {
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
        return (
            <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
                <ScrollView style={styles.container}>
                    <View style={styles.infoContainer}>
                        <Image source={require('../../assets/images/apartment.png')} />
                        <View
                            style={{
                                marginLeft: 16,
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>
                            <ZIPText
                                style={{
                                    color: Color.titleColor,
                                    fontSize: 17,
                                    fontWeight: '500',
                                    padding: 2,
                                }}>
                                {this.props.apt.apartmentName}
                            </ZIPText>
                            <ZIPText
                                numberOfLines={2}
                                style={{ color: Color.tipsColor, fontSize: 13 }}>
                                ADDRESS: {this.props.apt.address}
                            </ZIPText>
                        </View>
                    </View>
                    <View style={styles.sepView} />
                    <View style={styles.sectionView}>
                        <ZIPText style={styles.sectionTitle}>
                            Unit: {this.props.unit.unitName}
                        </ZIPText>
                    </View>
                    <View style={styles.sepView} />
                    <View style={{ padding: 16 }}>
                        <ZIPText style={styles.sectionTitle}>
                            Upload property management certificate
            </ZIPText>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 16,
                            }}>
                            <View removeClippedSubviews={true} style={styles.photoContainer}>
                                {this.state.photo === null ? null : (
                                    <Image
                                        removeClippedSubviews={true}
                                        style={{ flex: 1, overflow: 'hidden' }}
                                        source={{ uri: this.state.photo }}
                                    />
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => {
                                    this.selectPhoto();
                                }}>
                                <Icon name="camera" size={40} color={'#989898'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                payOffline: !this.state.payOffline,
                            });
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 16,
                            paddingRight: 16,
                            marginBottom: 16,
                        }}>
                        <IonIcon
                            name="md-checkbox-outline"
                            color={this.state.payOffline ? Color.themeColor : 'gray'}
                            size={24}
                        />
                        <ZIPText
                            style={{
                                marginLeft: 8,
                                fontSize: 14,
                                color: this.state.payOffline ? 'black' : 'gray',
                            }}>
                            Pay to Apartment Manager Directly
            </ZIPText>
                    </TouchableOpacity>
                    <Button
                        title="DONE"
                        onPress={() => {
                            //上传图片, 并提交绑定
                            this._bindApartment();
                        }}
                        backgroundColor={Color.themeColor}
                        disabled={this.state.photo === null}
                        textStyle={{
                            color: 'white',
                            fontFamily: FontFamily,
                        }}
                        containerViewStyle={{
                            borderRadius: 3,
                        }}
                        buttonStyle={{
                            borderRadius: 3,
                        }}
                    //raised
                    />
                </ScrollView>
                <Hud hudType={this.state.hudType} ref={r => (this.hud = r)} />
            </View>
        );
    }
}

/*
 apt:null,
 building:null,
 room:null,
 * */

export default connect(
    state => ({
        apt: state.uploadCer.apt,
        unit: state.uploadCer.unit,
    }),
    dispatch => ({
        loadZipList: () => dispatch(zipporaHomeActions.loadZipList()),
    }),
)(UploadCertificate);
