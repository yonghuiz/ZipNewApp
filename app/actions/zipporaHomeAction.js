/**
 * Created by liuyu on 2017/8/14.
 */
import {
    ZIPPORA_HOME_LOAD,
    ZIPPORA_HOME_LOAD_ERROR,
    ZIPPORA_HOME_LOAD_SUCCESS,
    ZIPPORA_HOME_GET_MEMBER,
    ZIPPORA_HOME_GET_MEMBER_ERROR,
    ZIPPORA_HOME_GET_MEMBER_SUCCESS,
    ZIPPORA_HOME_SET_CAN_SCAN,
} from './actionTypes'
import {
    GET_ZIPPORA_LIST,
    GET_MEMBER
} from '../config/API'

export function loadZipList() {
    return (dispatch, getState) => {
        dispatch({
            type: ZIPPORA_HOME_LOAD,
        });
        netWork('GET', GET_ZIPPORA_LIST, null, true)
            .then(json => {
                dispatch({
                    type: ZIPPORA_HOME_LOAD_SUCCESS,
                    list: [
                        {keyExtractor:(item,index)=>`key${index}`,data: json.data.apartmentList,section:'apartment'},
                        {keyExtractor:(item,index)=>`key${index}`,data: json.data.selfStoreList,section:'selfStore'}
                    ],
                })
            })
            .catch(err => {
                dispatch({
                    type: ZIPPORA_HOME_LOAD_ERROR,
                    error: err,
                })
            });
    }
}

export function getMember() {
    return (dispatch, getState) => {
        dispatch({
            type: ZIPPORA_HOME_GET_MEMBER,
        });
        netWork('GET', GET_MEMBER, null, true)
            .then(json => {
                dispatch({
                    type: ZIPPORA_HOME_GET_MEMBER_SUCCESS,
                    member: json.data,
                })
            })
            .catch(err => {
                dispatch({
                    type: ZIPPORA_HOME_GET_MEMBER_ERROR,
                    error: err,
                })
            })
    }
}

export function setCanScan(canScan) {
    return {
        type:ZIPPORA_HOME_SET_CAN_SCAN,
        canScan,
    }
}