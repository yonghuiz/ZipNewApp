/**
 * Created by liuyu on 2017/8/4.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import * as uploadCerActions from '../../actions/uploadCerAction';
import * as selectAPTActions from '../../actions/selectAPTAction'
import LoadingView from '../LoadingView'
import ErrorView from '../ErrorView'
import Hud from 'react-native-lyhud'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor,
        flexDirection: 'column'
    },
    itemContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

class SelectAPTSepComponent extends Component {
    render() {
        return (
            <View style={{height: 10}}/>
        )
    }
}

class ZipporaSelectAPT extends Component {

    constructor(props) {
        super(props);
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
        this.props.loadApt(this.props.zipCode);
    }

    onNavigatorEvent(event) {      
        if(event.type === 'NavBarButtonPress'&&event.id==='close'){
            this.props.navigator.popToRoot();
        }   
    }

    _renderItem(item) {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (item.hasBinded == 1) {
                        this.hud.show('You have already subscribed to this apartment',2000);
                        return;
                    }
                    this.props.setApt(item);
                    this.props.navigator.push({
                        screen: 'ZipporaSelectUnit',
                        title: 'Select Unit',
                        navigatorStyle: navigatorStyle,
                        backButtonTitle: 'Back',
                        animationType: 'slide-horizontal',
                    })
                }}
                style={styles.itemContainer}
            >
                <Image source={require('../../assets/images/apartment.png')}/>
                <View style={{marginLeft: 16, flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ZIPText style={{color: Color.titleColor, fontSize: 17, fontWeight: '500', padding: 2}}>
                            {item.apartmentName}
                        </ZIPText>
                        {
                            item.hasBinded == 1 ?
                                <View
                                    style={{
                                        height: 25,
                                        backgroundColor: Color.red,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                        marginLeft: 4,
                                        borderRadius: 12.5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ZIPText style={{fontSize: 12, color: 'white'}}>
                                        Subscribed
                                    </ZIPText>
                                </View> :
                                null
                        }
                    </View>
                    <ZIPText numberOfLines={2} style={{color: Color.tipsColor, fontSize: 13}}>
                        {item.address}
                    </ZIPText>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        const {loading, loadError, error, list} = this.props;
        if (loading) {
            return <LoadingView/>
        }
        console.log(this.props);

        if (loadError) {
            let type = error === 'time out' ? 'timeout' : 'error';
            return (
                <ErrorView
                    text={error}
                    onReloadPress={() => {
                        //重新加载数据
                        this.props.loadApt()
                    }}
                    type={type}
                />
            )
        }

        if (list.length === 0) {
            return (
                <ErrorView onReloadPress={() => {
                    this.props.loadApt()
                }} text="Have no data" type="empty"/>
            )
        }

        return (
            <View style={{flex:1, backgroundColor:Color.bgColor}}>
                <FlatList
                    style={styles.container}
                    data={list}
                    renderItem={(item) => this._renderItem(item.item)}
                    ItemSeparatorComponent={SelectAPTSepComponent}
                    //ListFooterComponent={SelectAPTFooterComponent}
                    keyExtractor={(item, index) => (index)}
                />
                <Hud hudType={'none'} textOnly={true} ref={r=>this.hud = r}/>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        loading: state.selectApt.loading,
        loadError: state.selectApt.loadError,
        error: state.selectApt.error,
        list: state.selectApt.list,
    }),
    (dispatch) => ({
        setApt: (apt) => dispatch(uploadCerActions.setApartment(apt)),
        loadApt: (zipCode) => dispatch(selectAPTActions.loadApt(zipCode)),
    })
)(ZipporaSelectAPT)