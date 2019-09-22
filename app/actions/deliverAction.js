/**
 * Created by liuyu on 2017/7/10.
 */
import {
    DELIVER_GET_LIST,
    DELIVER_GET_LIST_ERROR,
    DELIVER_GET_LIST_SUCCESS,
    DELIVER_GET_CABINET_LIST,
    DELIVER_GET_CABINET_LIST_SUCCESS,
    DELIVER_GET_CABINET_LIST_ERROR,
    DELIVER_SET_CAN_SCAN,
} from './actionTypes'
import {
    GET_DELIVER_LIST,
    GET_CABINET_LIST,
} from '../config/API'
import GetLocation from '../config/GetLocation'

export function getDeliverList() {
    return (dispatch, getState) => {
        dispatch({
            type:DELIVER_GET_LIST,
        });
        netWork('GET',GET_DELIVER_LIST,'page=1',true)
            .then(json=>{
                dispatch({
                    type:DELIVER_GET_LIST_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:DELIVER_GET_LIST_ERROR,
                    errText:err,
                })
            })
    }
}

export function getCabinetList() {
    return (dispatch, getState) => {
        dispatch({
            type:DELIVER_GET_CABINET_LIST,
        });
        GetLocation((lat,lon)=>{
            netWork('GET',GET_CABINET_LIST,`latitude=${lat}&longitude=${lon}`,true)
                .then(json=>{
                    dispatch({
                        type:DELIVER_GET_CABINET_LIST_SUCCESS,
                        cabinetList:json.data.cabinetList,
                        courierList:json.data.courierList,
                    })
                })
                .catch(err=>{
                    dispatch({
                        type:DELIVER_GET_CABINET_LIST_ERROR,
                        error:err,
                    })
                })
        },(err)=>{
            dispatch({
                type:DELIVER_GET_CABINET_LIST_ERROR,
                error:err,
            })
        });
    }
}

export function setCanScan(canScan) {
    return {
        type:DELIVER_SET_CAN_SCAN,
        canScan,
    }
}