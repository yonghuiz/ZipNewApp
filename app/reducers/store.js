/**
 * Created by liuyu on 2017/7/13.
 */
import * as types from '../actions/actionTypes'
const initialState= {
    list:null,
    loading:false,
    loadError:false,
    loadErrText:'',
};

export default function storeReducer(state=initialState, action={}) {
    switch (action.type) {
        case types.STORE_GET_LIST:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
            break;
        case types.STORE_GET_LIST_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
            break;
        case types.STORE_GET_LIST_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                loadErrText:action.error,
            };
            break;
        default:
            return state;
    }
}