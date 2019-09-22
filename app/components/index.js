/**
 * Created by liuyu on 2017/7/3.
 */

import '../config';
import { Navigation } from 'react-native-navigation'

import Deliver from './Deliver/Deliver'
import MyPickup from './MyPick/MyPickup'
import NewDeliver from './Deliver/NewDeliver'
import NewDeliverPay from './Deliver/NewDeliverPay'
import ZiplockerLocation from './Deliver/ZiplockerLocation'
import NewDeliverDone from './Deliver/NewDeliverDone'
import NewDeliverUploadImage from './Deliver/NewDeliverUploadImage'
import DeliverInfo from './Deliver/DeliverInfo'
import DeclareDeliver from './Deliver/DeclareDeliver'
import EditDeclareImages from './Deliver/EditDeclareImages'
import DeliverFrom from './Deliver/DeliverFrom'
import DeliverTo from './Deliver/DeliverTo'
import DeliverToList from './Deliver/DeliverToList'
import DeliverSearch from './Deliver/DeliverSearch'

import Login from './Login/Login'
import AddAddress from './Login/AddAddress'
import BindCabinet from './Login/BindCabinet'
import BindCreditCard from './Login/BindCreditCard'
import SelectDeliverAddress from './Login/SelectDeliverAddress'
import ChooseModel from './Login/ChooseModel'
import CountryPick from './CountryPick'
import Register from '../components/Login/Register'
import NewRegister from '../components/Login/NewRegister'
import ResetPassword from '../components/Login/ResetPassword'
import VerifyEmail from '../components/Login/VerifyEmail'

import Map from './Map/Map'
import AroundInfo from './Map/AroundInfo'

import Profile from './Profile/Profile'
import ZiplockerProfile from './Profile/ZiplockerProfile'
import ProfileInfo from './Profile/ProfileInfo'
import ModifyHouseHolder from './Profile/ModifyHouseHolder'
import ModifyPassword from './Profile/ModifyPassword'
import ModifyProfile from './Profile/ModifyProfile'
import Statement from './Profile/Statement'
import AboutUs from './Profile/AboutUs'
import Wallet from './Profile/Wallet'
import Recharge from './Profile/Recharge'
import Transaction from './Profile/Transaction'
import DeliveryTransaction from './Profile/DeliveryTransaction'
import PickUpTransaction from './Profile/PickUpTransaction'


import BarScan from './BarScan'

import ZipLockerHome from './ZipLockerHome'

import MenuComponent from './MenuComponent'
import ActionSheetScreen from './ActionSheetScreen'
import PickerScreen from './PickScreen'
import ImageLightBox from './ImageLightBox'
import SwitchModeLightBox from './SwitchModeLightBox'

import DrawerScreen from './DrawerScreen'

import NewApartment from './Zippora/NewApartment'
import ZipporaSelectAPT from './Zippora/ZipporaSelectAPT'
import ZipporaSelectUnit from './Zippora/ZipporaSelectUnit'
import UploadCertificate from './Zippora/UploadCertificate'
import ZipporaHome from './Zippora/ZipporaHome'
import ZipporaLog from './Zippora/ZipporaLog'
import ZipporaAPTInfo from './Zippora/ZipproaAPTInfo';
import ZipproaLocation from './Zippora/ZipproaLocation'
import BackButton from './BackButton'
import UserAgreement from './Login/UserAgreement'

export function registerScreens(store, Provider) {
    Navigation.registerComponent('Deliver',()=>Deliver,store,Provider);
    Navigation.registerComponent('MyPickup',()=>MyPickup,store,Provider);
    Navigation.registerComponent('NewDeliver',()=>NewDeliver,store,Provider);
    Navigation.registerComponent('NewDeliverPay',()=>NewDeliverPay,store,Provider);
    Navigation.registerComponent('ZiplockerLocation',()=>ZiplockerLocation);
    Navigation.registerComponent('NewDeliverDone',()=>NewDeliverDone,store,Provider);
    Navigation.registerComponent('NewDeliverUploadImage',()=>NewDeliverUploadImage,store,Provider);
    Navigation.registerComponent('DeliverInfo',()=>DeliverInfo,store,Provider);
    Navigation.registerComponent('DeclareDeliver',()=>DeclareDeliver);
    Navigation.registerComponent('EditDeclareImages',()=>EditDeclareImages);
    Navigation.registerComponent('DeliverFrom',()=>DeliverFrom,store,Provider);
    Navigation.registerComponent('DeliverTo',()=>DeliverTo,store,Provider);
    Navigation.registerComponent('Login',()=>Login);
    Navigation.registerComponent('Register',()=>Register,store,Provider);
    Navigation.registerComponent('NewRegister',()=>NewRegister,store,Provider);
    Navigation.registerComponent('ResetPassword',()=>ResetPassword,store,Provider);
    Navigation.registerComponent('AddAddress',()=>AddAddress);
    Navigation.registerComponent('BindCabinet',()=>BindCabinet,store,Provider);
    Navigation.registerComponent('BindCreditCard',()=>BindCreditCard,store,Provider);
    Navigation.registerComponent('CountryPick',()=>CountryPick,store,Provider);
    Navigation.registerComponent('Map',()=>Map,store,Provider);
    Navigation.registerComponent('AroundInfo',()=>AroundInfo);
    Navigation.registerComponent('ZiplockerProfile',()=>ZiplockerProfile,store,Provider);
    Navigation.registerComponent('Profile',()=>Profile,store,Provider);
    Navigation.registerComponent('Transaction',()=>Transaction,store,Provider);
    Navigation.registerComponent('DeliveryTransaction',()=>DeliveryTransaction,store,Provider);
    Navigation.registerComponent('PickUpTransaction',()=>PickUpTransaction,store,Provider);
    Navigation.registerComponent('ProfileInfo',()=>ProfileInfo,store,Provider);
    Navigation.registerComponent('ModifyHouseHolder',()=>ModifyHouseHolder, store, Provider);
    Navigation.registerComponent('ModifyPassword',()=>ModifyPassword);
    Navigation.registerComponent('ModifyProfile',()=>ModifyProfile,store,Provider);
    Navigation.registerComponent('BarScan',()=>BarScan,store,Provider);
    Navigation.registerComponent('MenuComponent',()=>MenuComponent);
    Navigation.registerComponent('ActionSheetScreen',()=>ActionSheetScreen);
    Navigation.registerComponent('PickerScreen',()=>PickerScreen);
    Navigation.registerComponent('ImageLightBox',()=>ImageLightBox);
    Navigation.registerComponent('SwitchModeLightBox',()=>SwitchModeLightBox);
    Navigation.registerComponent('SelectDeliverAddress',()=>SelectDeliverAddress);
    Navigation.registerComponent('DeliverToList',()=>DeliverToList,store,Provider);
    Navigation.registerComponent('DeliverSearch',()=>DeliverSearch,store,Provider);
    Navigation.registerComponent('DrawerScreen',()=>DrawerScreen);
    Navigation.registerComponent('ChooseModel',()=>ChooseModel);
    Navigation.registerComponent('NewApartment',()=>NewApartment);
    Navigation.registerComponent('ZipporaSelectAPT',()=>ZipporaSelectAPT,store,Provider);
    Navigation.registerComponent('ZipporaSelectUnit',()=>ZipporaSelectUnit,store,Provider);
    Navigation.registerComponent('UploadCertificate',()=>UploadCertificate,store,Provider);
    Navigation.registerComponent('ZipporaHome',()=>ZipporaHome,store,Provider);
    Navigation.registerComponent('ZipporaLog',()=>ZipporaLog,store,Provider);
    Navigation.registerComponent('ZipporaAPTInfo',()=>ZipporaAPTInfo,store,Provider);
    Navigation.registerComponent('ZipproaLocation',()=>ZipproaLocation);
    Navigation.registerComponent('Statement',()=>Statement,store,Provider);
    Navigation.registerComponent('AboutUs',()=>AboutUs);
    Navigation.registerComponent('Wallet',()=>Wallet,store,Provider);
    Navigation.registerComponent('Recharge',()=>Recharge,store,Provider);
    Navigation.registerComponent('ZipLockerHome',()=>ZipLockerHome,store,Provider);
    Navigation.registerComponent('VerifyEmail',()=>VerifyEmail,store,Provider);
    Navigation.registerComponent('BackButton',()=>BackButton);
    Navigation.registerComponent('UserAgreement',()=>UserAgreement);
}