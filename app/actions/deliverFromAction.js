/**
 * Created by liuyu on 2017/7/21.
 */
import {
    DELIVER_FROM_GET_LIST,
    DELIVER_FROM_GET_LIST_ERROR,
    DELIVER_FROM_GET_LIST_SUCCESS,
} from './actionTypes'
import {
    GET_CABINET_LIST,
} from '../config/API'
import GetLocation from '../config/GetLocation'

export function getCargoList() {
    return (dispatch,getState)=> {
        dispatch({
            type:DELIVER_FROM_GET_LIST,
        });
        GetLocation((lat,lon)=>{
            netWork('GET',GET_CABINET_LIST,`latitude=${lat}&longitude=${lon}`,true)
                .then(json=>{
                    dispatch({
                        type:DELIVER_FROM_GET_LIST_SUCCESS,
                        list:json.data.cabinetList,
                        defaultCabinet:json.data.defaultCabinet,
                    })
                })
                .catch(err=>{
                    dispatch({
                        type:DELIVER_FROM_GET_LIST_ERROR,
                        error:err,
                    })
                })
        },(err)=>{
            dispatch({
                type:DELIVER_FROM_GET_LIST_ERROR,
                error:err,
            })
        });
    }
}