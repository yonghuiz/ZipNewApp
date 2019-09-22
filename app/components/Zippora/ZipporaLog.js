/**
 * Created by liuyu on 2017/8/3.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import * as zipporaLogActions from '../../actions/zipporaLogAction';
import ErrorView from '../ErrorView';
import ZIPText from '../ZIPText';

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:Color.bgColor,
        flexDirection:'column'
    },
    headerError: {
        padding:8,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
    },
    itemContainer: {
        paddingLeft:16,
        paddingRight:16,
        paddingTop:8,
        paddingBottom:8,
        backgroundColor:'white',
        flexDirection:'column'
    }
});

class ZipporaLogSep extends PureComponent {
    render() {
        return (
            <View style={{height:10}} />
        )
    }
}

class ZipporaTimeLine extends PureComponent {
    render() {
        return (
            <View
                style={{
                    backgroundColor:'white',
                    height:50,
                    flexDirection:'row',
                    paddingLeft:35,
                }}
            >
                <View style={{flexDirection:'column', alignItems:'center',height:50}}>
                    <View style={{flex:1, width:1, backgroundColor:Color.themeColor}}/>
                    <View style={{width:10, height:10, backgroundColor:Color.themeColor, borderRadius:5}}/>
                    <View style={{flex:1, width:1, backgroundColor:Color.themeColor}}/>
                </View>
                <View style={{flex:1, marginLeft:10, flexDirection:'column',paddingTop:5,paddingBottom:5}}>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <ZIPText>
                            {this.props.title}
                        </ZIPText>
                    </View>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <ZIPText style={{color:Color.tipsColor}}>
                            {this.props.subTitle}
                        </ZIPText>
                    </View>
                </View>
            </View>
        )
    }
}

ZipporaTimeLine.propTypes = {
    // title:React.PropTypes.string.isRequired,
    // subTitle:React.PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    subTitle:PropTypes.string.isRequired,
};

class LogHeader extends PureComponent {
    render() {
        if (this.props.loading) {
            return <View/>
        }
        if (this.props.loadError) {
            let type = this.props.error === 'time out' ? 'timeout' : 'error';
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={()=>{
                        this.props.loadZipporaLog();
                    }}
                    style={styles.headerError}
                >
                    <Text style={{color:Color.red}}>
                        {`${this.props.error}, tap to reload`}
                    </Text>
                </TouchableOpacity>
            )
        }

        if (this.props.list.length === 0) {
            return (
                <ErrorView
                    text="have on log"
                    style={{height:screenSize.height - navBarHeight}}
                    onReloadPress={()=>{this.props.loadZipporaLog()}}
                    type="empty"
                />
            )
        }
        return <View/>
    }
}

const ZipporaLogHeader = connect(
    (state)=>({
        loading:state.zipporaLog.loading,
        loadError:state.zipporaLog.loadError,
        list:state.zipporaLog.list,
        error:state.zipporaLog.error,
    }),
    (dispatch)=>({
        loadZipporaLog:()=>dispatch(zipporaLogActions.loadZipporaLog())
    })
)(LogHeader);



class ZipporaLog extends PureComponent {
    
    componentDidMount() {
        this.props.loadZipporaLog()
    }

    _renderItem(item) {

        return (
            <View style={{flexDirection:'column'}}>
                <View
                    style={{
                        padding:10,
                        backgroundColor:'#47B050',
                        flexDirection:'row'
                    }}
                >
                    <View
                        style={{
                            height:60,
                            width:60,
                            backgroundColor:'white',
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:30,
                        }}
                    >
                        <ZIPText style={{fontWeight:'bold', fontSize:16}}>
                            {item.courierCompanyName}
                        </ZIPText>
                    </View>
                    <View
                        style={{
                            flex:1,
                            marginLeft:10,
                            justifyContent:'space-around',
                            flexDirection:'column'
                        }}
                    >
                        <ZIPText style={{color:'white'}}>
                            Zippora: {item.cabinetId}
                        </ZIPText>
                        <ZIPText style={{color:'white'}}>
                            PickCodes: {item.pickCode}
                        </ZIPText>
                    </View>
                </View>
                <View style={{backgroundColor:'white', flexDirection:'column'}}>
                    {
                        item.pickTime.length !== 0 ?
                            <ZipporaTimeLine title="Pick up" subTitle={item.pickTime}/> :null
                    }
                    <ZipporaTimeLine title="Put in" subTitle={item.storeTime}/>
                </View>
            </View>
        );



        return (
            <View style={styles.itemContainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontWeight:'bold'}}>
                        {item.courierCompanyName}
                    </Text>
                    <Text style={{marginLeft:16, color:Color.titleColor}}>
                        Zippora: {item.cabinetId}
                    </Text>
                    <Text style={{flex:1, textAlign:'right',color:Color.red}}>
                        Pickup Code:
                        <Text style={{fontFamily:'Menlo'}}>
                            {` ${item.pickCode}`}
                        </Text>
                    </Text>
                </View>
                <View style={{marginTop:8, backgroundColor:Color.bgColor, height:1}} />
                {
                    item.pickTime.length !== 0 ?
                        <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
                            <View style={{height:10,width:10, borderRadius:5, backgroundColor:Color.themeColor}}/>
                            <Text style={{marginLeft:16, fontFamily:'Menlo', color:Color.tipsColor}}>
                                {item.pickTime}
                            </Text>
                            <Text style={{flex:1, textAlign:'right', color:Color.tipsColor}}>
                                PICK UP
                            </Text>
                        </View> : null
                }
                <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
                    <View style={{height:10,width:10, borderRadius:5, backgroundColor:Color.themeColor}}/>
                    <Text style={{marginLeft:16, fontFamily:'Menlo', color:Color.tipsColor}}>
                        {item.storeTime}
                    </Text>
                    <Text style={{flex:1, textAlign:'right', color:Color.tipsColor}}>
                        PUT IN
                    </Text>
                </View>
            </View>
        )
    }
    
    render() {

        return (
            <FlatList
                style={styles.container}
                ItemSeparatorComponent={ZipporaLogSep}
                ListHeaderComponent={ZipporaLogHeader}
                data={this.props.list}
                refreshing={this.props.loading}
                onRefresh={()=>this.props.loadZipporaLog()}
                renderItem={(item)=>this._renderItem(item.item)}
                keyExtractor={(item,index)=>index}
            />
        )
    }
}

export default connect(
    (state)=>({
        loading:state.zipporaLog.loading,
        list:state.zipporaLog.list,
    }),
    (dispatch)=>({
        loadZipporaLog:()=>dispatch(zipporaLogActions.loadZipporaLog())
    })
)(ZipporaLog)