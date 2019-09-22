/**
 * Created by liuyu on 2017/7/12.
 */
import {
    PICK_GET_DELIVER_LIST,
    PICK_GET_DELIVER_LIST_ERROR,
    PICK_GET_DELIVER_LIST_SUCCESS,
    PICK_GET_STORE_LIST,
    PICK_GET_STORE_LIST_ERROR,
    PICK_GET_STORE_LIST_SUCCESS,
    PICK_SET_PAGE,
} from './actionTypes'
import {
    GET_PICK_LIST
} from '../config/API'

export function getPickDeliverList() {
    return (dispatch, getState) => {
        dispatch({
            type:PICK_GET_DELIVER_LIST,
        });
        netWork('GET',GET_PICK_LIST,'type=deliver',true)
            .then(json=>{
                dispatch({
                    type:PICK_GET_DELIVER_LIST_SUCCESS,
                    data:json.data.dpList,
                })
            })
            .catch(err=>{
                dispatch({
                    type:PICK_GET_DELIVER_LIST_ERROR,
                    error:err,
                })
            })
    }
}

export function getPickStoreList() {
    return (dispatch, getState) => {
        dispatch({
            type:PICK_GET_STORE_LIST
        });
        netWork('GET',GET_PICK_LIST,'type=store',true)
            .then(json=>{
                dispatch({
                    type:PICK_GET_STORE_LIST_SUCCESS,
                    data:json.data.spList,
                })
            })
            .catch(err=>{
                dispatch({
                    type:PICK_GET_STORE_LIST_ERROR,
                    error:err,
                })
            })
    }
}

export function setPage(page) {
    return {
        type:PICK_SET_PAGE,
        page,
    }
}