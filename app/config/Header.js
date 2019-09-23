/**
 * Created by liuyu on 2017/5/16.
 */
import Storage from 'react-native-storage'
import {
    
    Dimensions,
    Platform,
    PermissionsAndroid,
    NativeModules,
    StatusBar,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {Navigation} from 'react-native-navigation'

const {DeviceOperate} = NativeModules;
import {RE_LOGIN} from './API'

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

storage = new Storage({
    size: 1000,

    storageBackend: AsyncStorage,

    defaultExpires: null,
});

global.storage = storage;

screenSize = ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
});

global.screenSize = screenSize;

statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 20;
console.log(StatusBar.currentHeight);

global.statusBarHeight = statusBarHeight;

navBarHeight = Platform.OS === 'android' ? (96 * screenSize.width / screenSize.height + statusBarHeight) : 64;

global.navBarHeight = navBarHeight;

userInfo = {
    accessToken: null,
    memberId: null,
    psd: null,
};

global.userInfo = userInfo;

haveAlertLogin = false;

global.haveAlertLogin = haveAlertLogin;

// BASE_URL = "http://zipcodexpress.unibox.com.cn/zpi/";
BASE_URL = "http://api.zipcodexpress.com/zpi/";
global.baseURL = BASE_URL;

myHeaders = new Headers({'X-FROM': 'app'});

netWork = (method, url, param, needLogin, delay = 200000, option = {headers: myHeaders}) => {
    let requestURL = '';
    let timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Request time out')
        }, delay)
    });

    if (method === 'GET') {
        if (needLogin) {
            requestURL = baseURL +
                url +
                `?_accessToken=${userInfo.accessToken}&_memberId=${userInfo.memberId}` + (param === null ? '' : `&${param}`)
        } else {
            requestURL = baseURL + url + (param === null ? '' : `?${param}`)
        }

        console.log(requestURL);
        let getFetch = new Promise((resolve, reject) => {
            fetch(requestURL, option)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log('getFetch success:',requestURL,json);
                    if (json.ret == 0) {
                        resolve(json)
                    } else {
                        if (needLogin) {
                            if (json.ret == 3) {
                                reject('Need bind credit card');
                            } else if (json.ret == 1) {
                                //重新获取accessToken,更新accessToken后重新请求
                                reLogin(method, url, param, needLogin, delay, option,resolve,reject);
                            }
                            else {
                                reject(json.msg)
                            }
                        } else {
                            reject(json.msg)
                        }
                    }
                })
                .catch(err => {
                    reject('System error')
                })
        });

        return Promise.race([timeout, getFetch])

    } else {
        let postFetch = new Promise((resolve, reject) => {
            let newParam = param;
            if (needLogin) {
                newParam.append('_accessToken', userInfo.accessToken);
                newParam.append('_memberId', userInfo.memberId);
            }
            fetch(baseURL + url, {
                ...option,
                method: 'POST',
                body: param,
            })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    if (json.ret == 0) {
                        resolve(json)
                    } else {
                        if (needLogin) {
                            if (json.ret == 3) {
                                resolve('Need bind credit card');
                            } else if (json.ret == 1) {
                                reLogin(method,url,param,needLogin,delay,option,resolve,reject);
                            }
                            else {
                                reject(json.msg)
                            }
                        } else {
                            reject(json.msg)
                        }
                    }
                })
                .catch(err => {
                    reject('System error')
                })
        });
        return Promise.race([timeout, postFetch])
    }
};

global.netWork = netWork;

reLogin = (method, url, param, needLogin, delay, option, resolve, reject) => {
    console.log('重新登录');
    let params = new FormData();
    params.append('memberId', userInfo.memberId);
    params.append('psd', userInfo.psd);
    fetch(
        baseURL + RE_LOGIN,
        {
            ...option,
            method: 'POST',
            body: params,
        }
    )
        .then(response=>response.json())
        .then(json=>{
            if (json.ret == 0) {
                console.log('重新登录成功');
                userInfo.accessToken = json.data.accessToken;
                storage.save({
                    key: 'userInfo',
                    data: {
                        accessToken: userInfo.accessToken,
                        memberId: userInfo.memberId,
                        psd: userInfo.psd,
                    },
                    expires: null,
                });
                netWork(method,url,param,needLogin,delay,option)
                    .then(json=>{
                        if (json.ret == 0) {
                            resolve(json);
                        } else {
                            reject(json.msg);
                        }
                    })
                    .catch(err=>{
                        reject('System error');
                    })
            } else {
                console.log('重新登录失败');
                haveAlertLogin = true;
                logout();
                Alert.alert(
                    'tips',
                    'login expired',
                    [
                        {
                            text: 'go to login',
                            onPress: () => {
                                Navigation.handleDeepLink({
                                    link: 'Login/'
                                })
                            }
                        }
                    ],
                    {cancelable: false}
                )
            }
        })
        .catch(err=>{
            console.log('重新登录失败');
            logout();
            haveAlertLogin = true;
            Alert.alert(
                'tips',
                'login expired',
                [
                    {
                        text: 'go to login',
                        onPress: () => {
                            Navigation.handleDeepLink({
                                link: 'Login/'
                            })
                        }
                    }
                ],
                {cancelable: false}
            )
        })
};

global.reLogin = reLogin;

logout = () => {
    storage.save({
        key: 'isLogin',
        data: false,
    })
};

global.logout = logout;

FontFamily = 'Avenir';

global.FontFamily = FontFamily;