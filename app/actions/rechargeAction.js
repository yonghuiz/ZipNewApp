/**
 * Created by liuyu on 2017/9/14.
 */
import {
    RECHARGE_GET_CONFIG,
    RECHARGE_GET_CONFIG_ERROR,
    RECHARGE_GET_CONFIG_SUCCESS,
    RECHARGE_SELECT_INDEX,
    RECHARGE_SELECT_PAYWAY,
} from './actionTypes'
import {
    GET_RECHARGE_CONFIG
} from '../config/API'

export function getRechargeConfig() {
    return (dispatch, getState) => {
        dispatch({
            type:RECHARGE_GET_CONFIG,
        });
        netWork('GET',GET_RECHARGE_CONFIG,null,true)
            .then(json=>{
                dispatch({
                    type:RECHARGE_GET_CONFIG_SUCCESS,
                    config:json.data
                })
            })
            .catch(err=>{
                console.log(err);
                dispatch({
                    type:RECHARGE_GET_CONFIG_ERROR,
                    error:err,
                })
            })
    }
}

export function selectIndex(index) {
    return {
        type:RECHARGE_SELECT_INDEX,
        index,
    };
}

export function selectPayWay(index) {
    return {
        type:RECHARGE_SELECT_PAYWAY,
        index,
    }
}