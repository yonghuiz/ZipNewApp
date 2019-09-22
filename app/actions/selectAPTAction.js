/**
 * Created by liuyu on 2017/8/11.
 */
import {
    SELECT_APT_LOAD_ERROR,
    SELECT_APT_LOAD,
    SELECT_APT_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_APT_LIST
} from '../config/API'

export function loadApt(zipCode) {
    return (dispatch, getState) => {
        dispatch({
            type:SELECT_APT_LOAD,
        });
        netWork('GET',GET_APT_LIST,'zipcode=' + zipCode,true)
            .then(json=>{
                console.log(json);
                if (json.ret === 0) {
                    dispatch({
                        type:SELECT_APT_LOAD_SUCCESS,
                        list:json.data.apartmentList,
                    })
                } else {
                    dispatch({
                        type:SELECT_APT_LOAD_ERROR,
                        error:json.msg,
                    })
                }
            })
            .catch(err=>{
                console.log(err);
                dispatch({
                    type:SELECT_APT_LOAD_ERROR,
                    error:err,
                })
            })
    }
}