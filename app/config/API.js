/**
 * Created by liuyu on 2017/6/12.
 */

//CABINET
export const GET_CABINET_LIST = "cabinet/getCabinetList";
export const SET_CBINET = "cabinet/setCabinet";

//CARDCREDIT
export const DEL_CARDCREDIT = "CardCredit/delete";
export const INSERT_CARDCREDIT = "CardCredit/insertCardCredit";
export const SET_DEFAULT_CARD = "CardCredit/setDefault";

//DELIVER
export const GET_DELIVER_LIST = "deliver/getDeliverList";
export const INSERT_DELIVER = "deliver/insertDeliver";
export const PAY_DELIVER = 'deliver/payDeliver';
export const UPDATE_DELIVER = 'deliver/updateDeliver';
export const CANCEL_DELIVER = 'deliver/cancelDeliver';
export const GET_DELIVER_PRICE = 'deliver/getDeliverPrice';
export const GET_DELIVER_INFO = 'deliver/getDeliver';

//PICK
export const GET_PICK_LIST = 'pick/getPickList';
export const COMPLAIN_PICK = 'pick/complainPick';

//STORE
export const GET_STORE_LIST = 'store/getStoreList';
export const INSERT_STORE = 'store/insertStore';
export const GET_STORE_PRICE = 'store/getStorePrice';

//PROFILE
export const UPDATE_PROFILE = "Address/insertAddress";
export const SWITCH_SERVICE_MODE = "member/switchServiceMode";
export const GET_MEMBER = 'member/getMember';
export const GET_STATEMENT_LIST = 'statement/getStatementList';
export const GET_CREDIT_CARD_LIST = 'CardCredit/getCardCreditList';
export const MODIFY_PROFILE = 'Profile/updateProfile';
export const GET_STATE_LIST = 'state/getStateList';
export const GET_TRANSACTION_LIST = 'transaction/getTransactionList';


//VCODE
export const CHECK_VCODE = "VCode/checkVCode";
export const GET_VCODE = "VCode/getVCode";
export const RE_LOGIN = "VCode/login";

//LOGIN
export const LOGIN_REGISTER = "login/register";
export const LOGIN_LOGIN = 'login/login';
export const LOGIN_FORGET_PSD = "login/forgetPsd";
export const LOGIN_RESET_PSD = "login/resetPsd";

export const VERIFY_ACCOUNT = 'login/verifyAccount';
export const RESEND_EMAIL = "login/reSendEmail";
export const CHANGE_PSD = "login/changePsd";
export const VERIFY_EMAIL = "login/verifyEmail";


//PHOTO
export const UPLOAD_PHOTO = 'Photo/uploadPhoto';

//CONFIG
export const GET_CARGO_CONFIG = 'config/getConfig';

//QrCode11 QrCode
export const QRCODELL_QRCODE= 'QrCode/scan';

//Wallet
export const GET_RECHARGE_CONFIG = 'wallet/getRechargeAmountConfig';
export const PAY_WITH_CREDIT_CARD = 'wallet/recharge';
export const PAY_WITH_PAYPAL = 'paypal/checkout';

//Zippora
//getApartmentList
export const GET_APT_LIST = 'zippora/getApartmentList';
//getUnitList
export const GET_UNIT_LIST = 'zippora/getUnitList';
//bindApartment
export const BIND_APARTMENT = 'zippora/bindApartment';
//cancelApartment
export const CANCEL_APARTMENT = 'zippora/cancelBindApartment';
//getZipporaList
export const GET_ZIPPORA_LIST = 'zippora/getZipporaList';
//getZipporaLog
export const GET_ZIPPORA_STORELIST = 'zippora/getStoreList';

//check version
export const GET_APP_VERSION = 'app/version';