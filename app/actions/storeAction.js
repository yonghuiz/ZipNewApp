/**
 * Created by liuyu on 2017/7/13.
 */
import {
    STORE_GET_LIST,
    STORE_GET_LIST_ERROR,
    STORE_GET_LIST_SUCCESS,
} from './actionTypes'
import {
    GET_STORE_LIST
} from '../config/API'

export function getStoreList() {
    return (dispatch, getState) => {
        dispatch({
            type:STORE_GET_LIST,
        });

        netWork('GET',GET_STORE_LIST,null,true)
            .then(json=>{
                dispatch({
                    type:STORE_GET_LIST_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:STORE_GET_LIST_ERROR,
                    error:err,
                })
            })
    }
}