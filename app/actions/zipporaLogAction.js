/**
 * Created by liuyu on 2017/8/15.
 */
import {
    ZIPPORA_LOG_LOAD,
    ZIPPORA_LOG_LOAD_ERROR,
    ZIPPORA_LOG_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_ZIPPORA_STORELIST
} from '../config/API'

export function loadZipporaLog() {
    return (dispatch, getState) => {
        dispatch({
            type:ZIPPORA_LOG_LOAD,
        });
        netWork('GET',GET_ZIPPORA_STORELIST,null,true)
            .then(json=>{
                dispatch({
                    type:ZIPPORA_LOG_LOAD_SUCCESS,
                    list:json.data.storeList,
                })
            })
            .catch(err=>{
                dispatch({
                    type:ZIPPORA_LOG_LOAD_ERROR,
                    error:err,
                })
            })
    }
}