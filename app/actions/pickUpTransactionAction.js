/**
 * Created by liuyu on 2017/11/6.
 */
import {
    TRANSACTION_PICKUP_LOAD,
    TRANSACTION_PICKUP_LOAD_ERROR,
    TRANSACTION_PICKUP_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_TRANSACTION_LIST
} from '../config/API'

export function loadList() {
    return (dispatch, getState) => {
        dispatch({
            type:TRANSACTION_PICKUP_LOAD,
        });
        netWork('GET',GET_TRANSACTION_LIST,'type=pick',true)
            .then(json=>{
                dispatch({
                    type:TRANSACTION_PICKUP_LOAD_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:TRANSACTION_PICKUP_LOAD_ERROR,
                    error:err,
                })
            })
    }
}