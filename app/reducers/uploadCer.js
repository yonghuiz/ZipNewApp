/**
 * Created by liuyu on 2017/8/11.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    apt:null,
    unit:null,
};

export default function uploadCerReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.UPLOAD_CER_SET_APARTMENTID:
            return {
                ...state,
                apt:action.apt,
            };
        case types.UPLOAD_CER_SET_UNITID:
            return {
                ...state,
                unit:action.unit,
            };
        default:
            return state;
    }
}