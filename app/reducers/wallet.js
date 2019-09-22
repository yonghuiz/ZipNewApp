/**
 * Created by liuyu on 2017/8/16.
 */
import * as types from '../actions/actionTypes'
const initialState = {
    card:null,
    loading:false,
    loadError:false,
    defaultIndex:-1,
};

export default function walletReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.WALLET_LOAD_CREDIT_CARD:
            return {
                ...state,
                loading:true,
                loadingError:false,
            };
        case types.WALLET_LOAD_CREDIT_CARD_SUCCESS:
            let defaultIndex = -1;
            action.card.map((data,index)=>{
                if (data.isDefault == 1) {
                    defaultIndex = index;
                }
            });
            return {
                ...state,
                loading:false,
                card:action.card,
                defaultIndex,
            };
        case types.WALLET_LOAD_CREDIT_CARD_ERROR:
            return {
                ...state,
                loading:false,
                loadError:true,
            };
        case types.WALLET_CHANGE_DEFAULT:

            return {
                ...state,
                defaultIndex:action.index,
            };
        case types.WALLET_DELETE_CARD:
            let cardData = state.card;
            cardData.splice(action.index,1);
            return {
                ...state,
                card:cardData,
            };
        default:
            return state;
    }
}