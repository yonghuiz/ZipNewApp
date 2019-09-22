/**
 * Created by liuyu on 2017/7/13.
 */
import {
    NEWSTORE_GET_CONFIG,
    NEWSTORE_GET_CONFIG_ERROR,
    NEWSTORE_GET_CONFIG_SUCCESS,
    NEWSTORE_SET_CABINET,
    NEWSTORE_SET_MOBILE,
    NEWSTORE_SET_BOX_INDEX,
    NEWSTORE_SET_TIME_INDEX,
    NEWSTORE_SET_INIT,
    NEWSTORE_GET_PRICE,
    NEWSTORE_GET_PRICE_ERROR,
    NEWSTORE_GET_PRICE_SUCCESS,
} from './actionTypes'
import {
    GET_CARGO_CONFIG,
    GET_STORE_PRICE,
} from '../config/API'

export function getConfig() {
    return (dispatch, getState) => {
        dispatch({
            type:NEWSTORE_GET_CONFIG,
        });
        netWork('GET',GET_CARGO_CONFIG,null,true)
            .then(json=>{
                dispatch({
                    type:NEWSTORE_GET_CONFIG_SUCCESS,
                    boxModels:json.data.boxModels,
                    holdTimeConfig:json.data.holdTimeConfig,
                });
                dispatch(getStorePrice());
            })
            .catch(err=>{
                dispatch({
                    type:NEWSTORE_GET_CONFIG_ERROR,
                    error:err,
                })
            })
    }
}

export function getStorePrice() {
    return (dispatch,getState)=>{
        dispatch({
            type:NEWSTORE_GET_PRICE,
        });
        /*
         boxModels:null,
         holdTimeConfig:null,
         boxIndex:0,
         holdTimeIndex:0,
        * */
        const { boxModels, holdTimeConfig, boxIndex, holdTimeIndex } = getState().newStore;
        const boxModelId = boxModels[boxIndex].boxModelId;
        const holdTime = holdTimeConfig[holdTimeIndex];
        netWork(
            'GET',
            GET_STORE_PRICE,
            'boxModelId=' + boxModelId
            + '&holdTime=' + holdTime,
            true)
            .then(json=>{
                if (json.ret === 0) {
                    dispatch({
                        type:NEWSTORE_GET_PRICE_SUCCESS,
                        price:json.data.totalPrice,
                    })
                } else {
                    dispatch({
                        type:NEWSTORE_GET_PRICE_ERROR,
                        error:json.msg,
                    })
                }
            })
            .catch(err=>{
                dispatch({
                    type:NEWSTORE_GET_PRICE_ERROR,
                    error:err,
                })
            })
    }
}

export function setCabinet(cabinet) {
    return {
        type:NEWSTORE_SET_CABINET,
        cabinet,
    }
}

export function setMobile(mobile) {
    return {
        type:NEWSTORE_SET_MOBILE,
        mobile,
    }
}

export function setBoxIndex(index) {
    return (dispatch, getState) => {
        dispatch({
            type:NEWSTORE_SET_BOX_INDEX,
            index,
        });
        dispatch(getStorePrice())
    }
}

export function setTimeIndex(index) {
    return (dispatch, getState)=> {
        dispatch({
            type:NEWSTORE_SET_TIME_INDEX,
            index,
        });
        dispatch(getStorePrice())
    };
}

export function setInit() {
    return {
        type:NEWSTORE_SET_INIT,
    }
}