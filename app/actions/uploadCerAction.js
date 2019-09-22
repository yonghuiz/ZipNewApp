/**
 * Created by liuyu on 2017/8/11.
 */
import {
    UPLOAD_CER_SET_APARTMENTID,
    UPLOAD_CER_SET_UNITID,
} from './actionTypes'

export function setApartment(apt) {
    return {
        type:UPLOAD_CER_SET_APARTMENTID,
        apt,
    }
}

export function setUnit(unit) {
    return {
        type:UPLOAD_CER_SET_UNITID,
        unit,
    }
}