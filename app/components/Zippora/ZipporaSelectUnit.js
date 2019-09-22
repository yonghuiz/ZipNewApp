/**
 * Created by liuyu on 2017/11/20.
 */
import React, {PureComponent} from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import ZIPText from '../ZIPText'
import * as selectUnitAction from '../../actions/selectUnitAction'
import * as uploadCerAction from '../../actions/uploadCerAction'
import LoadingView from '../LoadingView'
import Icon from 'react-native-vector-icons/Ionicons'
import * as zipporaHomeActions from '../../actions/zipporaHomeAction'
import Hud from 'react-native-lyhud'
import {
    BIND_APARTMENT
} from '../../config/API'

const styles = StyleSheet.create({
    infoContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor:'white',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
    },
});

class ZipporaSelectUnit extends PureComponent {

    binding = false;

    constructor(props) {
        super(props);
        this.state = {
            hudType: 'none',
            selectIndex: 0,
            payOffline: true,
        }

        Icon.getImageSource('md-close', 30)
            .then(source => {
                this.props.navigator.setButtons({
                    rightButtons: [
                        {
                            id: 'close',
                            icon: source,
                        },
                    ],
                    animated: true
                })
            })
            .catch(err => {

            });

        this.props.navigator.setOnNavigatorEvent((event) => {
            this.onNavigatorEvent(event)
        });
    }

    componentDidMount() {
        this.props.loadUnitList(this.props.apt.apartmentId);
    }

    onNavigatorEvent(event) {      
        if(event.type === 'NavBarButtonPress'&&event.id==='close'){
            this.props.navigator.popToRoot();
        }   
    }

    renderUnits() {
        const {
            loading,
            loadError,
            error,
            list,
        } = this.props;

        if (loading) {
            return (
                <LoadingView/>
            )
        }

        if (loadError) {
            return (
                <TouchableOpacity
                    style={{padding: 8, alignItems: 'center', justifyContent: 'center'}}
                    activeOpacity={1}
                    onPress={() => {
                        this.props.loadUnitList(this.props.apt.apartmentId)
                    }}
                >
                    <ZIPText style={{color: 'red'}}>
                        System error, tap to reload
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        if (list.length === 0) {
            return (
                <TouchableOpacity
                    style={{padding: 8, alignItems: 'center', justifyContent: 'center'}}
                    activeOpacity={1}
                    onPress={() => {
                        this.props.navigator.pop()
                    }}
                >
                    <ZIPText style={{color: Color.red}}>
                        have no units, please select other apartment
                    </ZIPText>
                </TouchableOpacity>
            )
        }

        return (
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingLeft: 16,
                    paddingRight: 16,
                }}
            >
                {
                    list.map((data, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                onPress={() => {
                                    this.state.selectIndex !== index && this.setState({selectIndex: index,});
                                }}
                                style={{
                                    width: (screenSize.width - 32 - 60) / 3,
                                    height: (screenSize.width - 32 - 60) / 6,
                                    backgroundColor: this.state.selectIndex === index ? Color.themeColor : Color.graygreen,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: index % 3 === 0 ? 0 : 30,
                                    marginTop: parseInt(index / 3) > 0 ? 16 : 0,
                                }}
                            >
                                <ZIPText
                                    style={{
                                        color: this.state.selectIndex === index ? 'white' : '#707731',
                                        fontSize: 17
                                    }}
                                >
                                    {data.unitName}
                                </ZIPText>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        )
    }

    bindApartment(unitId) {
        this.binding = true;
        this.state.hudType !== 'none' && this.setState({hudType: 'none'});
        this.hud.show('bind apartment');
        netWork(
            'GET',
            BIND_APARTMENT,
            'apartmentId=' +
            this.props.apt.apartmentId +
            '&unitId=' +
            unitId +
            '&payOffline=' +
            (this.state.payOffline ? '1' : '0'),
            true
        )
            .then(json => {
                this.binding = false;
                this.setState({
                    hudType: 'success'
                }, () => {
                    this.hud.show(json.msg, 1500);
                    this.props.loadZipList();
                    this.time = setTimeout(() => {
                        //刷新首页数据, 跳转到首页
                        this.props.navigator.popToRoot();
                    }, 1500);
                })
            })
            .catch(err => {
                this.binding = false;
                this.setState({
                    hudType: 'error',
                }, () => {
                    this.hud.show(err, 1500);
                });
            })
    }

    render() {
        const {
            list,
            apt,
        } = this.props;
        return (
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
                <View style={styles.infoContainer}>
                    <Image source={require('../../assets/images/apartment.png')}/>
                    <View style={{marginLeft: 16, flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                        <ZIPText style={{color: Color.titleColor, fontSize: 17, fontWeight: '500', padding: 2}}>
                            {apt.apartmentName}
                        </ZIPText>
                        <ZIPText numberOfLines={2} style={{color: Color.tipsColor, fontSize: 13}}>
                            {apt.address}
                        </ZIPText>
                    </View>
                </View>
                <ZIPText style={{fontSize: 16, padding: 16}}>
                    Unit
                </ZIPText>
                {this.renderUnits()}
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                payOffline: !this.state.payOffline,
                            })
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 16,
                            paddingRight: 16,
                        }}
                    >
                        <Icon
                            name="md-checkbox-outline"
                            color={this.state.payOffline ? Color.themeColor : 'gray'}
                            size={24}
                        />
                        <ZIPText
                            style={{
                                marginLeft: 8,
                                fontSize: 14,
                                color: this.state.payOffline ? 'black' : 'gray'
                            }}
                        >
                            Pay to Apartment Manager Directly
                        </ZIPText>
                    </TouchableOpacity>
                </View>
                <View style={{height: 60, padding: 10}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.time && clearTimeout(this.time);
                            this.time = setTimeout(() => {
                                //this.props.setUnit(list[this.state.selectIndex]);
                                // this.props.navigator.push({
                                //     screen:'UploadCertificate',
                                //     title:'Upload certificate',
                                    backButtonTitle:'',
                                //     animationType:'slide-horizontal',
                                // })
                                console.log('apt', this.props.apt.apartmentId);
                                if (!this.binding) {
                                    this.bindApartment(list[this.state.selectIndex].unitId)
                                }
                            }, 500);
                        }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: (list === null || list.length === 0) ? Color.tipsColor : Color.themeColor,
                            borderRadius: 3,
                        }}
                    >
                        <ZIPText style={{color: 'white',}}>
                            Done
                        </ZIPText>
                    </TouchableOpacity>
                </View>
                <Hud hudType={this.state.hudType} ref={r => this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.selectUnit.loading,
        loadError: state.selectUnit.loadError,
        error: state.selectUnit.error,
        list: state.selectUnit.list,
        apt: state.uploadCer.apt,
    }),
    (dispatch) => ({
        setUnit: (unit) => dispatch(uploadCerAction.setUnit(unit)),
        loadUnitList: (apartmentId) => dispatch(selectUnitAction.getUnitList(apartmentId)),
        loadZipList: () => dispatch(zipporaHomeActions.loadZipList()),
    })
)(ZipporaSelectUnit)