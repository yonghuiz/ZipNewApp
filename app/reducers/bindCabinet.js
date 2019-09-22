/**
 * Created by liuyu on 2017/7/10.
 */
import * as types from '../actions/actionTypes'

const initialState = {
    loading:false,
    error:false,
    errText:'',
    list:[],
};

export default function bindCabinetReducers(state=initialState,action={}) {
    switch (action.type) {
        case types.BIND_CABINET_GET_LIST:
            return {
                ...state,
                loading:true,
                error:false,
            };
            break;
        case types.BIND_CABINET_GET_LIST_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
            break;
        case types.BIND_CABINET_GET_LIST_ERROR:
            return {
                ...state,
                loading:false,
                error:true,
                errText:action.err,
            };
            break;
        default:
            return state;
    }
}

