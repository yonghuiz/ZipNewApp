/**
 * Created by liuyu on 2017/8/11.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    list:[],
    loadError:false,
    error:'',
};

export default function selectAptReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.SELECT_APT_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.SELECT_APT_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        case types.SELECT_APT_LOAD_ERROR:
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