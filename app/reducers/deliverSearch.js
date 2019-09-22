/**
 * Created by liuyu on 2017/7/31.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    error:'',
    list:null,
};

export default function deliverSearchReducer(state=initialState,action={}) {
    switch (action.type) {
        case types.DELIVER_SEARCH_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
            break;
        case types.DELIVER_SEARCH_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                list:action.list,
            };
            break;
        case types.DELIVER_SEARCH_LOAD_ERROR:
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