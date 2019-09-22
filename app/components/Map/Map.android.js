/**
 * Created by liuyu on 2017/7/29.
 */
import React, {PureComponent} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import * as newDeliverActions from '../../actions/newDeliverAction'
import * as newStoreActions from '../../actions/newStoreAction'
import MapView from 'react-native-maps'

const styles = StyleSheet.create({
    swiperPage: {
        width: screenSize.width,
        height: 120,
        backgroundColor: 'transparent',
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: 8
    },
    cabinetContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingRight: 30,
        paddingLeft: 30,
        flexDirection: 'row',
    },
    cabinetInfoContainer: {},
    selectButtonContainer: {}
});

class Map extends PureComponent {

    index = 0;
    selectIndex = 0;

    mapReady = false;

    constructor(props) {
        super(props);
    }

    render() {
        /*
         fromPage:'deliverto',
         toPhone:this.props.toPhone,
         toName:this.props.toName,
         list:this.props.list,
         * */

        const {fromPage, toPhone, toName, list} = this.props;
        console.log(fromPage, toPhone, toName, list);

        const anns = list.map((data, index) => {
            //console.log(data.boxEnough);
            return {
                cabinetId: data.cabinetId,
                distance: data.dis + 'miles',
                address: data.address,
                latitude: 37.582 + index,
                longitude: -122.405 + index,
                boxText: data.boxText,
                boxEnough: data.boxEnough,
                index: index,
                id: `${index}`,
            }
        });

        return (
            <View style={{flex: 1, backgroundColor: Color.bgColor}}>
                <MapView
                    style={{width:screenSize.width,height:screenSize.height - 120 - navBarHeight}}
                    initialRegion={{
                        latitude: 37.582,
                        longitude: -122.405,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    ref={r=>this.mapview = r}
                    onMapReady={() => {
                        if (!this.mapReady) {
                            this.mapReady = true;
                            this.mapview.fitToElements(true);
                        }
                    }}
                >
                    {
                        anns.map((data,index)=>{
                            return (
                                <MapView.Marker
                                    key={index}
                                    coordinate={{
                                        latitude: data.latitude,
                                        longitude: data.longitude,
                                    }}
                                    identifier={`${index}`}
                                    onPress={(e)=>{
                                        console.log(e.nativeEvent.id);
                                        this.swiper.scrollBy(parseInt(e.nativeEvent.id) - this.index);
                                    }}
                                >
                                    <View style={{flexDirection: 'column', alignItems: 'center', height: 68}}>
                                        <View style={{
                                            flex: 1,
                                            padding: 8,
                                            backgroundColor: 'white',
                                            borderRadius: 3,
                                            borderWidth: 1,
                                            borderColor: Color.themeColor,
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            alignItems:'center',
                                            justifyContent:'center',
                                        }}>
                                            <Text style={{fontFamily: 'Menlo'}}>
                                                {data.boxEnough ? 'BOX ENOUGH':'BOX NOT ENOUGH'}
                                            </Text>
                                        </View>
                                        <Image style={{marginTop: -1}}
                                               source={require('../../assets/images/anntr.png')}/>
                                        <Image
                                            source={require('../../assets/images/annotation.png')}
                                        />
                                    </View>
                                </MapView.Marker>
                            )
                        })
                    }
                </MapView>
                <Swiper
                    width={screenSize.width}
                    height={120}
                    ref={(r) => this.swiper = r}
                    style={{position: 'absolute', right: 0, left: 0, bottom: -10, backgroundColor:'transparent'}}
                    showsPagination={false}
                    showsButtons={true}
                    nextButton={
                        <View style={{padding: 8}}>
                            <Icon name="ios-arrow-forward" color={Color.themeColor} size={40}/>
                        </View>
                    }
                    prevButton={
                        <View style={{padding: 8}}>
                            <Icon name="ios-arrow-back" color={Color.themeColor} size={40}/>
                        </View>
                    }
                    buttonWrapperStyle={{
                        paddingHorizontal: 10, paddingVertical: 10,
                    }}
                    loop={false}
                    onMomentumScrollEnd={(e, state) => {
                        if (this.index === state.index) {
                            return;
                        }
                        this.index = state.index;
                        // this.refs.map.setCenterCoordinate(anns[state.index].latitude, anns[state.index].longitude, true, () => {
                        //     this.refs.map.selectAnnotation(`${state.index}`);
                        // });
                    }}
                >
                    {
                        list.map((data, index) => {
                            return (
                                <View key={index} style={styles.swiperPage}>
                                    <View style={styles.cabinetContainer}>
                                        <View style={{flex: 0.65, flexDirection: 'column'}}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{fontSize:17, fontWeight:'bold'}}>
                                                    ID: {data.cabinetId}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{color:Color.assistTextColor}} numberOfLines={3}>
                                                    {data.address}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text>
                                                    {data.boxText}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            flex: 0.35,
                                            justifyContent:'center'
                                        }}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={()=>{
                                                    if (data.boxEnough) {
                                                        if (fromPage === 'deliverto') {
                                                            this.props.setToCabinet(data,toPhone,toName)
                                                        } else {
                                                            if (this.props.popPage === 'newstore') {
                                                                this.props.setStoreCabinet(data);
                                                            } else {
                                                                this.props.setFromCabinet(data);
                                                            }
                                                        }
                                                        this.props.navigator.dismissModal();
                                                    }
                                                }}
                                                style={{
                                                alignItems:'center',
                                                justifyContent:'center',
                                                backgroundColor:'green',
                                                height:40,
                                                width:'100%',
                                                borderRadius:4,
                                            }}>
                                            <Text style={{fontSize:10, color:'white'}}>
                                                {data.boxEnough ? 'SELECT':'BOX NOT ENOUGH'}
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </Swiper>
            </View>
        )
    }
}

export default connect(
    (state)=>({

    }),
    (dispatch)=>({
        setFromCabinet:(cabinet)=>{dispatch(newDeliverActions.setFromCabinet(cabinet))},
        setToCabinet: (cabinet, toPhone, toName) => {
            dispatch(newDeliverActions.setToCabinet(cabinet, toPhone, toName))
        },
        setStoreCabinet:(cabinet)=>{dispatch(newStoreActions.setCabinet(cabinet))}
    })
)(Map)