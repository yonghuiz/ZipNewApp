/**
 * Created by liuyu on 2017/8/16.
 */
import {
    WALLET_LOAD_CREDIT_CARD_SUCCESS,
    WALLET_LOAD_CREDIT_CARD,
    WALLET_LOAD_CREDIT_CARD_ERROR,
    WALLET_CHANGE_DEFAULT,
    WALLET_DELETE_CARD,
} from './actionTypes'
import {
    GET_CREDIT_CARD_LIST,
} from '../config/API'

export function loadCreditCard() {
    return (dispatch, getState) => {
        dispatch({
            type:WALLET_LOAD_CREDIT_CARD,
        });
        netWork('GET',GET_CREDIT_CARD_LIST,null,true)
            .then(json=>{
                dispatch({
                    type:WALLET_LOAD_CREDIT_CARD_SUCCESS,
                    card:json.data.cardList,
                });
            })
            .catch(err=>{
                console.log(err);
                dispatch({
                    type:WALLET_LOAD_CREDIT_CARD_ERROR,
                    error:err,
                })
            })
    }
}

export function changeDefault(index) {
    return {
        type: WALLET_CHANGE_DEFAULT,
        index,
    }
}

export function deleteCard(index) {
    return {
        type:WALLET_DELETE_CARD,
        index,
    }
}