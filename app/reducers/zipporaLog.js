/**
 * Created by liuyu on 2017/8/15.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    list:[],
    loadError:false,
    error:'',
};

export default function zipporaLogReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.ZIPPORA_LOG_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.ZIPPORA_LOG_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        case types.ZIPPORA_LOG_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        default:
            return state;
    }
}