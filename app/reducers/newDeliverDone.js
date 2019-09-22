/**
 * Created by liuyu on 2017/11/9.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    deliverId:'',
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.NEW_DELIVER_DONE_SET_ID:
            return {
                deliverId:action.deliverId,
            };
        default:
            return state;
    }
}