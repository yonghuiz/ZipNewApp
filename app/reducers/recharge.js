/**
 * Created by liuyu on 2017/9/14.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    error:'',
    config:null,
    selectIndex:0,
    payWay:0,
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECHARGE_GET_CONFIG:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.RECHARGE_GET_CONFIG_SUCCESS:
            return {
                ...state,
                loading:false,
                config:action.config,
            };
        case types.RECHARGE_GET_CONFIG_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.RECHARGE_SELECT_INDEX:
            return {
                ...state,
                selectIndex:action.index,
            };
        case types.RECHARGE_SELECT_PAYWAY:
            return {
                ...state,
                payWay:action.index,
            };
        default:
            return state;
    }
}