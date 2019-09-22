/**
 * Created by liuyu on 2017/11/8.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    loadingConfig:false,
    loadConfigError:false,
    boxModels:null,
    cargoTypes:null,
    boxIndex:null,
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.NEW_DELIVER_GET_CONFIG_ERROR:
            return {
                ...state,
                loadingConfig:false,
                loadConfigError:true,
            };
        case types.NEW_DELIVER_GET_CONFIG_SUCCESS:
            return {
                ...state,
                loadingConfig:false,
                boxModels:action.boxModels,
                cargoTypes:action.cargoTypes,
                boxIndex:0,
            };
        case types.NEW_DELIVER_GET_CONFIG:
            return {
                ...state,
                loadingConfig:true,
                loadConfigError:false,
                boxIndex:null,
            };
        case types.NEW_DELIVER_SET_BOX_INDEX:
            return {
                ...state,
                boxIndex:action.index,
            }
        default:
            return state;
    }
}