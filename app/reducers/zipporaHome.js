/**
 * Created by liuyu on 2017/8/15.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    list:null,
    loadError:false,
    error:'',
    loadingMember:false,
    member:null,
    loadMemberError:false,
    memberError:'',
    canToScan:true,
};

export default function zipporaHomeReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.ZIPPORA_HOME_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.ZIPPORA_HOME_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.ZIPPORA_HOME_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        case types.ZIPPORA_HOME_GET_MEMBER:
            return {
                ...state,
                loadingMember:true,
                loadMemberError:false,
            };
        case types.ZIPPORA_HOME_GET_MEMBER_ERROR:
            return {
                ...state,
                loadingMember:false,
                loadMemberError:true,
                memberError:action.error,
            };
        case types.ZIPPORA_HOME_GET_MEMBER_SUCCESS:
            return {
                ...state,
                loadingMember:false,
                member:action.member,
            };
        case types.ZIPPORA_HOME_SET_CAN_SCAN:
            return {
                ...state,
                canToScan:action.canScan,
            }
        default:
            return state;
    }
}