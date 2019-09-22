/**
 * Created by liuyu on 2017/11/6.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    list:null,
    error:''
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.TRANSACTION_DELIVER_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        case types.TRANSACTION_DELIVER_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.TRANSACTION_DELIVER_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
        default:
            return state;
    }
}