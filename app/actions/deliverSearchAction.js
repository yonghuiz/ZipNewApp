/**
 * Created by liuyu on 2017/7/31.
 */
import {
    DELIVER_SEARCH_LOAD,
    DELIVER_SEARCH_LOAD_ERROR,
    DELIVER_SEARCH_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_CABINET_LIST,
} from '../config/API'


export function getCabinet(text) {
    return (dispatch, getState) => {
        dispatch({
            type:DELIVER_SEARCH_LOAD,
        });
        netWork('GET',GET_CABINET_LIST,'address=' + text,true)
            .then(json=>{
                console.log(json);
                if (json.ret === 0) {
                    dispatch({
                        type:DELIVER_SEARCH_LOAD_SUCCESS,
                        list:json.data.list,
                    })
                } else {
                    dispatch({
                        type:DELIVER_SEARCH_LOAD_ERROR,
                        error:json.msg,
                    })
                }
            })
            .catch(err=>{
                console.log(err);
                dispatch({
                    type:DELIVER_SEARCH_LOAD_ERROR,
                    error:err,
                })
            });
    }
}