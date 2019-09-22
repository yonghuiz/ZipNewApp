/**
 * Created by liuyu on 2017/7/12.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    deliverList:null,
    loadingDeliver:false,
    loadDeliverError:false,
    loadDeliverErrText:'',
    storeList:null,
    loadingStore:false,
    loadStoreError:false,
    loadStoreErrText:'',
    page:0,
};

export default function pickReducers(state=initialState,action={}) {
    switch (action.type) {
        case types.PICK_GET_DELIVER_LIST:
            return {
                ...state,
                loadingDeliver:true,
                loadDeliverError:false,
            };
            break;
        case types.PICK_GET_DELIVER_LIST_SUCCESS:
            return {
                ...state,
                loadingDeliver:false,
                deliverList:action.data,
            };
            break;
        case types.PICK_GET_DELIVER_LIST_ERROR:
            return {
                ...state,
                loadingDeliver:false,
                loadDeliverError:true,
                loadDeliverErrText:action.error,
            };
            break;
        case types.PICK_GET_STORE_LIST:
            return {
                ...state,
                loadingStore:true,
                loadStoreError:false,
            };
            break;
        case types.PICK_GET_STORE_LIST_SUCCESS:
            return {
                ...state,
                loadingStore:false,
                storeList:action.data,
            };
            break;
        case types.PICK_GET_STORE_LIST_ERROR:
            return {
                ...state,
                loadingStore:false,
                loadStoreError:true,
                loadStoreErrText:action.error,
            };
            break;
        case types.PICK_SET_PAGE:
            return {
                ...state,
                page:action.page,
            };
            break;
        default:
            return state;
    }
}