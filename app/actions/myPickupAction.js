/**
 * Created by liuyu on 2017/11/4.
 */
import {
    MYPICKUP_LOAD,
    MYPICKUP_LOAD_ERROR,
    MYPICKUP_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_PICK_LIST
} from '../config/API'

export function loadPickList() {
    return (dispatch, getState) => {
        dispatch({
            type:MYPICKUP_LOAD,
        });
        netWork('GET',GET_PICK_LIST,null,true)
            .then(json=>{
                dispatch({
                    type:MYPICKUP_LOAD_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:MYPICKUP_LOAD_ERROR,
                    error:err,
                })
            })
    }
}