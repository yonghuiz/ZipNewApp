/**
 * Created by liuyu on 2017/7/24.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    deliverList:null,
    loadError:false,
    error:'',
    defaultCabinet:null,
};

export default function deliverFromReducers(state = initialState, action = {}) {
    switch (action.type) {
        case types.DELIVER_FROM_GET_LIST:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
            break;
        case types.DELIVER_FROM_GET_LIST_SUCCESS:
            return {
                ...state,
                loading:false,
                deliverList:action.list,
                defaultCabinet:action.defaultCabinet,
            };
            break;
        case types.DELIVER_FROM_GET_LIST_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
            break;
        default:
            return state;
    }
}