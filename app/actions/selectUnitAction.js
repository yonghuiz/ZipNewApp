/**
 * Created by liuyu on 2017/11/20.
 */
import {
    SELECT_UNIT_LOAD,
    SELECT_UNIT_LOAD_ERROR,
    SELECT_UNIT_LOAD_SUCCESS,
} from './actionTypes'
import {
    GET_UNIT_LIST,
} from '../config/API'

export function getUnitList(apartmentId) {
    return (dispatch, getState) => {
        dispatch({
            type:SELECT_UNIT_LOAD,
        });
        netWork(
            'GET',
            GET_UNIT_LIST,
            'apartmentId=' + apartmentId,
            true
        )
            .then(json=>{
                dispatch({
                    type:SELECT_UNIT_LOAD_SUCCESS,
                    list:json.data.unitList,
                })
            })
            .catch(err=>{
                dispatch({
                    type:SELECT_UNIT_LOAD_ERROR,
                    error:err,
                })
            })
    }
}