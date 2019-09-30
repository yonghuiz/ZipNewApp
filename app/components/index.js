/**
 * Created by liuyu on 2017/7/3.
 */

import '../config';
import React from 'react';
import { Navigation } from 'react-native-navigation'
import App from '../App'
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
import  ZipporaHome from './Zippora/ZipporaHome'
import ZipporaLog from './Zippora/ZipporaLog'
import ZipporaAPTInfo from './Zippora/ZipproaAPTInfo';
import ZipproaLocation from './Zippora/ZipproaLocation'
import BackButton from './BackButton'
import UserAgreement from './Login/UserAgreement'

export function registerScreens(store, Provider) {
    
    Navigation.registerComponent('APP1',()=>App);
    Navigation.registerComponent('MyPickup',() => (props) => (
        <Provider store={store}>
          <MyPickup {...props} />
    </Provider>),()=>MyPickup);
    Navigation.registerComponent('NewDeliver',() => (props) => (<Provider store={store}><NewDeliver {...props} /></Provider>),()=>NewDeliver);
    Navigation.registerComponent('NewDeliverPay',() => (props) => (<Provider store={store}><NewDeliverPay {...props} /></Provider>),()=>NewDeliverPay);
    Navigation.registerComponent('ZiplockerLocation',()=>ZiplockerLocation);
    Navigation.registerComponent('NewDeliverDone',() => (props) => (<Provider store={store}><NewDeliverDone {...props} /></Provider>),()=>NewDeliverDone);
    Navigation.registerComponent('NewDeliverUploadImage',() => (props) => (<Provider store={store}><NewDeliverUploadImage {...props} /></Provider>),()=>NewDeliverUploadImage);
    Navigation.registerComponent('DeliverInfo',() => (props) => (<Provider store={store}><DeliverInfo {...props} /></Provider>),()=>DeliverInfo);
    Navigation.registerComponent('DeclareDeliver',()=>DeclareDeliver);
    Navigation.registerComponent('EditDeclareImages',()=>EditDeclareImages);
    Navigation.registerComponent('DeliverFrom',() => (props) => (<Provider store={store}><DeliverFrom {...props} /></Provider>),()=>DeliverFrom);
    Navigation.registerComponent('DeliverTo',() => (props) => (<Provider store={store}><DeliverTo {...props} /></Provider>),()=>DeliverTo);
    Navigation.registerComponent('Login',()=>Login);
    Navigation.registerComponent('Register',() => (props) => (<Provider store={store}><Register {...props} /></Provider>),()=>Register);
    Navigation.registerComponent('NewRegister',() => (props) => (<Provider store={store}><NewRegister {...props} /></Provider>),()=>NewRegister);
    Navigation.registerComponent('ResetPassword',() => (props) => (<Provider store={store}><ResetPassword {...props} /></Provider>),()=>ResetPassword);
    Navigation.registerComponent('AddAddress',() => (props) => (<Provider store={store}><AddAddress {...props} /></Provider>),()=>AddAddress);
    Navigation.registerComponent('BindCabinet',() => (props) => (<Provider store={store}>< BindCabinet {...props} /></Provider>),()=>BindCabinet);
    Navigation.registerComponent('BindCreditCard',() => (props) => (<Provider store={store}><BindCreditCard {...props} /></Provider>),()=>BindCreditCard);
    Navigation.registerComponent('CountryPick',() => (props) => (<Provider store={store}><CountryPick {...props} /></Provider>),()=>CountryPick);
    Navigation.registerComponent('Map',() => (props) => (<Provider store={store}><Map {...props} /></Provider>),()=>Map);
    Navigation.registerComponent('AroundInfo',()=>AroundInfo);
    Navigation.registerComponent('ZiplockerProfile',() => (props) => (<Provider store={store}><ZiplockerProfile {...props} /></Provider>),()=>ZiplockerProfile);
    Navigation.registerComponent('Profile',() => (props) => (<Provider store={store}><Profile {...props} /></Provider>),()=>Profile);
    Navigation.registerComponent('Transaction',() => (props) => (<Provider store={store}><Transaction {...props} /></Provider>),()=>Transaction);
    Navigation.registerComponent('DeliveryTransaction',() => (props) => (<Provider store={store}><DeliveryTransaction {...props} /></Provider>),()=>DeliveryTransaction);
    Navigation.registerComponent('PickUpTransaction',() => (props) => (<Provider store={store}><PickUpTransaction {...props} /></Provider>),()=>PickUpTransaction);
    Navigation.registerComponent('ProfileInfo',() => (props) => (<Provider store={store}><ProfileInfo {...props} /></Provider>),()=>ProfileInfo);
    Navigation.registerComponent('ModifyHouseHolder',() => (props) => (<Provider store={store}><ModifyHouseHolder {...props} /></Provider>),()=>ModifyHouseHolder);
    Navigation.registerComponent('ModifyPassword',()=>ModifyPassword);
    Navigation.registerComponent('ModifyProfile',() => (props) => (<Provider store={store}><ModifyProfile {...props} /></Provider>),()=>ModifyProfile);
    Navigation.registerComponent('BarScan',() => (props) => (<Provider store={store}><BarScan {...props} /></Provider>),()=>BarScan);
    Navigation.registerComponent('MenuComponent',()=>MenuComponent);
    Navigation.registerComponent('ActionSheetScreen',()=>ActionSheetScreen);
    Navigation.registerComponent('PickerScreen',()=>PickerScreen);
    Navigation.registerComponent('ImageLightBox',()=>ImageLightBox);
    Navigation.registerComponent('SwitchModeLightBox',()=>SwitchModeLightBox);
    Navigation.registerComponent('SelectDeliverAddress',()=>SelectDeliverAddress);
    Navigation.registerComponent('DeliverToList',() => (props) => (<Provider store={store}><DeliverToList {...props} /></Provider>),()=>DeliverToList);
    Navigation.registerComponent('DeliverSearch',() => (props) => (<Provider store={store}><DeliverSearch {...props} /></Provider>),()=>DeliverSearch);
    Navigation.registerComponent('DrawerScreen',()=>DrawerScreen);
    Navigation.registerComponent('ChooseModel',()=>ChooseModel);
    Navigation.registerComponent('NewApartment',()=>NewApartment);
    Navigation.registerComponent('ZipporaSelectAPT',() => (props) => (<Provider store={store}><ZipporaSelectAPT {...props} /></Provider>),()=>ZipporaSelectAPT);
    Navigation.registerComponent('ZipporaSelectUnit',() => (props) => (<Provider store={store}><ZipporaSelectUnit {...props} /></Provider>),()=>ZipporaSelectUnit);
    Navigation.registerComponent('UploadCertificate',() => (props) => (<Provider store={store}><UploadCertificate {...props} /></Provider>),()=>UploadCertificate);
   //Navigation.registerComponent('ZipporaHome',()=>ZipporaHome);
  Navigation.registerComponent('ZipporaHome',() => (props) => (<Provider store={store}><ZipporaHome {...props} /></Provider>),()=>ZipporaHome);
    Navigation.registerComponent('ZipporaLog',() => (props) => (<Provider store={store}><ZipporaLog {...props} /></Provider>),()=>ZipporaLog);
    Navigation.registerComponent('ZipporaAPTInfo',() => (props) => (<Provider store={store}><ZipporaAPTInfo {...props} /></Provider>),()=>ZipporaAPTInfo);
    Navigation.registerComponent('ZipproaLocation',()=>ZipproaLocation);
    Navigation.registerComponent('Statement',() => (props) => (<Provider store={store}><Statement {...props} /></Provider>),()=>Statement);
    Navigation.registerComponent('AboutUs',()=>AboutUs);
    Navigation.registerComponent('Wallet',() => (props) => (<Provider store={store}><Wallet {...props} /></Provider>),()=>Wallet);
    Navigation.registerComponent('Recharge',() => (props) => (<Provider store={store}><Recharge {...props} /></Provider>),()=>Recharge);
    Navigation.registerComponent('ZipLockerHome',() => (props) => (<Provider store={store}><ZipLockerHome {...props} /></Provider>),()=>ZipLockerHome);
    Navigation.registerComponent('VerifyEmail',() => (props) => (<Provider store={store}><VerifyEmail {...props} /></Provider>),()=>VerifyEmail);
    Navigation.registerComponent('BackButton',()=>BackButton);
    Navigation.registerComponent('UserAgreement',()=>UserAgreement);
}