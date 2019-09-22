/**
 * Created by liuyu on 2017/11/8.
 */
import {
    NEW_DELIVER_GET_CONFIG,
    NEW_DELIVER_GET_CONFIG_ERROR,
    NEW_DELIVER_GET_CONFIG_SUCCESS,
    NEW_DELIVER_SET_BOX_INDEX,
} from './actionTypes'
import {
    GET_CARGO_CONFIG,
} from '../config/API'

export function getConfig() {
    return (dispatch, getState) => {
        dispatch({
            type:NEW_DELIVER_GET_CONFIG,
        });

        netWork('GET',GET_CARGO_CONFIG,null,true)
            .then(json=>{
                dispatch({
                    type:NEW_DELIVER_GET_CONFIG_SUCCESS,
                    boxModels:json.data.boxModels,
                    cargoTypes:json.data.cargoTypes,
                })
            })
            .catch(err=>{
                dispatch({
                    type:NEW_DELIVER_GET_CONFIG_ERROR,
                })
            })
    }
}

export function setBoxIndex(index) {
    return {
        type:NEW_DELIVER_SET_BOX_INDEX,
        index,
    }
}