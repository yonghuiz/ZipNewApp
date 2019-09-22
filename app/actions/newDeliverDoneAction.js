/**
 * Created by liuyu on 2017/11/9.
 */
import {
    NEW_DELIVER_DONE_SET_ID
} from './actionTypes'

export function setDeliverId(deliverId) {
    return {
        type:NEW_DELIVER_DONE_SET_ID,
        deliverId:deliverId,
    }
}