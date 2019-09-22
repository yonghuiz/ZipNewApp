/**
 * Created by liuyu on 2017/7/13.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loading:false,
    loadError:false,
    errText:'',
    boxModels:null,
    holdTimeConfig:null,
    boxIndex:0,
    holdTimeIndex:0,
    cabinet:null,
    mobile:'',
    price:null,
    priceLoading:false,
    loadPriceError:false,
    loadPriceErrText:'',
    disableIndex:[],
};

export default function newStoreReducer(state=initialState,action={}) {
    switch (action.type) {
        case types.NEWSTORE_GET_CONFIG:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
            break;
        case types.NEWSTORE_GET_CONFIG_SUCCESS:
            return {
                ...state,
                loading:false,
                boxModels:action.boxModels,
                holdTimeConfig:action.holdTimeConfig,
            };
            break;
        case types.NEWSTORE_GET_CONFIG_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                errText:action.error,
            };
            break;
        case types.NEWSTORE_SET_MOBILE:
            return {
                ...state,
                mobile:action.mobile,
            };
            break;
        case types.NEWSTORE_SET_CABINET:
            return {
                ...state,
                cabinet:action.cabinet,
            };
            break;
        case types.NEWSTORE_SET_BOX_INDEX:
            return {
                ...state,
                boxIndex:action.index,
            };
            break;
        case types.NEWSTORE_SET_TIME_INDEX:
            return {
                ...state,
                holdTimeIndex:action.index,
            };
            break;
        case types.NEWSTORE_GET_PRICE:
            return {
                ...state,
                priceLoading:true,
                loadPriceError:false,
            };
            break;
        case types.NEWSTORE_GET_PRICE_SUCCESS:
            return {
                ...state,
                priceLoading:false,
                price:action.price,
            };
            break;
        case types.NEWSTORE_GET_PRICE_ERROR:
            return {
                ...state,
                priceLoading:false,
                loadPriceError:true,
                loadPriceErrText:action.error,
            };
            break;
        case types.NEWSTORE_SET_INIT:
            return initialState;
        default:
            return state;
    }
}