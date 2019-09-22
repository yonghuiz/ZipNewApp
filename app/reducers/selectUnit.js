/**
 * Created by liuyu on 2017/11/20.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    list:[],
    error:'',
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.SELECT_UNIT_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.SELECT_UNIT_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        case types.SELECT_UNIT_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        default:
            return state;
    }
}