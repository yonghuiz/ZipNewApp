/**
 * Created by liuyu on 2017/7/10.
 */
import {
    BIND_CABINET_GET_LIST,
    BIND_CABINET_GET_LIST_SUCCESS,
    BIND_CABINET_GET_LIST_ERROR,
} from './actionTypes'
import GetLocation from '../config/GetLocation'
import {
    GET_CABINET_LIST,
    SET_CBINET,
} from '../config/API'

export function getCabinetList() {
    return (dispatch,getState)=> {
        dispatch({
            type:BIND_CABINET_GET_LIST,
        });
        GetLocation((lat,long)=>{
            netWork('GET',GET_CABINET_LIST,'latitude=' + lat + '&longitude=' + long,true)
                .then(json=>{
                    dispatch({
                        type:BIND_CABINET_GET_LIST_SUCCESS,
                        list:json.data.cabinetList,
                    })
                })
                .catch(err=>{
                    console.log(err);
                    dispatch({
                        type:BIND_CABINET_GET_LIST_ERROR,
                        err:err,
                    })
                })
        },(err)=>{
            console.log(err);
            dispatch({
                type:BIND_CABINET_GET_LIST_ERROR,
                err:err,
            })
        })
    }
}

export function setCabinet(cabinetId) {
    return (dispatch, getState) => {
        return netWork('GET',SET_CBINET,'cabinetId=' + cabinetId, true)
    }
}