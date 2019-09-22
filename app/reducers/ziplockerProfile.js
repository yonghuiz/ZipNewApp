/**
 * Created by liuyu on 2017/11/4.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    profile:null,
    loading:false,
    loadError:false,
    error:'',
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.ZIPLOCKER_PROFILE_LOAD_SUCCESS:
            return {
                ...state,
                loading:false,
                profile:action.profile,
            };
        case types.ZIPLOCKER_PROFILE_LOAD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
                error:action.error,
            };
        case types.ZIPLOCKER_PROFILE_LOAD:
            return {
                ...state,
                loading:true,
                loadError:false,
            };
        default:
            return state;
    }
}