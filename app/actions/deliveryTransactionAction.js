/**
 * Created by liuyu on 2017/11/6.
 */
import {
    TRANSACTION_DELIVER_LOAD,
    TRANSACTION_DELIVER_LOAD_ERROR,
    TRANSACTION_DELIVER_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_TRANSACTION_LIST,
} from '../config/API'

export function loadList() {
    return (dispatch,getState) => {
        dispatch({
            type:TRANSACTION_DELIVER_LOAD,
        });
        netWork('GET',GET_TRANSACTION_LIST,'type=deliver',true)
            .then(json=>{
                dispatch({
                    type:TRANSACTION_DELIVER_LOAD_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:TRANSACTION_DELIVER_LOAD_ERROR,
                    error:err,
                })
            })
    }
}