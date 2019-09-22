/**
 * Created by liuyu on 2017/8/16.
 */
import {
    STATEMENT_LOAD,
    STATEMENT_LOAD_ERROR,
    STATEMENT_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_STATEMENT_LIST,
} from '../config/API'


export function loadStatement() {
    return (dispatch, getState) => {
        dispatch({
            type:STATEMENT_LOAD,
        });
        netWork('GET',GET_STATEMENT_LIST,null,true)
            .then(json=>{
                dispatch({
                    type:STATEMENT_LOAD_SUCCESS,
                    list:json.data.list,
                })
            })
            .catch(err=>{
                dispatch({
                    type:STATEMENT_LOAD_ERROR,
                    error:err,
                })
            })
    }
}