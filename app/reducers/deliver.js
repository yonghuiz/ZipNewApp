/**
 * Created by liuyu on 2017/7/11.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    list:null,
    error:false,
    errText:'',
    aroundInfo:null,
    getAroundError:false,
    aroundErrorText:'',
    canScan:true,
};

export default function deliverReducers(state = initialState, action={}) {
    switch (action.type) {
        case types.DELIVER_GET_LIST:
            return {
                ...state,
                loading:true,
                error:false,
            };
            break;
        case types.DELIVER_GET_LIST_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
            break;
        case types.DELIVER_GET_LIST_ERROR:
            return {
                ...state,
                loading:false,
                error:true,
                errText:action.errText,
            };
            break;
        case types.DELIVER_GET_CABINET_LIST:
            return {
                ...state,
                getAroundError:false,
                aroundInfo:null,
            };
            break;
        case types.DELIVER_GET_CABINET_LIST_ERROR:
            return {
                ...state,
                getAroundError:true,
                aroundErrorText:action.error,
            };
            break;
        case types.DELIVER_GET_CABINET_LIST_SUCCESS:
            return {
                ...state,
                aroundInfo:{
                    cabinetList:action.cabinetList,
                    courierList:action.courierList,
                }
            };
            break;
        case types.DELIVER_SET_CAN_SCAN:
            return {
                ...state,
                canScan:action.canScan,
            };
        default:
            return state;
    }
}