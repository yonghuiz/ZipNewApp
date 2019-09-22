/**
 * Created by liuyu on 2017/11/4.
 */
import {
    ZIPLOCKER_PROFILE_LOAD,
    ZIPLOCKER_PROFILE_LOAD_ERROR,
    ZIPLOCKER_PROFILE_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_MEMBER
} from '../config/API'

export function loadProfile() {
    return (dispatch, getState) => {
        dispatch({
            type:ZIPLOCKER_PROFILE_LOAD,
        });
        netWork('GET',GET_MEMBER,null,true)
            .then(json=>{
                dispatch({
                    type:ZIPLOCKER_PROFILE_LOAD_SUCCESS,
                    profile:json.data,
                })
            })
            .catch(err=>{
                dispatch({
                    type:ZIPLOCKER_PROFILE_LOAD_ERROR,
                    error:err,
                })
            })
    }
}