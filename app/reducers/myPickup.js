/**
 * Created by liuyu on 2017/11/4.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    list:null,
    error:'',
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.MYPICKUP_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.MYPICKUP_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.MYPICKUP_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list: action.list,
            };
        default:
            return state;

    }
}