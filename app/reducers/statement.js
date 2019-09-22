/**
 * Created by liuyu on 2017/8/16.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    list:[],
    loadError:false,
    error:''
};

export default function statementReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.STATEMENT_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.STATEMENT_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.STATEMENT_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        default:
            return state;
    }
}