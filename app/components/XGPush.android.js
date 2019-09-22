/**
 * Created by liuyu on 2017/10/16.
 */
import {
    NativeModules,
    DeviceEventEmitter,
    NativeEventEmitter,
} from 'react-native'

const XG = NativeModules.TencentXGManager;

export function allEvents() {
    console.log(XG);
    return [
        XG.RemoteNotificationEvent,
        XG.RegisteredEvent,
        XG.FailureEvent
    ];
}

export function register(account, ticket, tickerType, qua) {
    if (typeof ticket !== 'string') ticket = null;
    if (ticket) return XG.registerPushWithTicket('' + account,ticket,tickerType,qua);
    if (account) return XG.registerPushAndBindAccount('' + account);
    return XG.registerPush();
}

export function eventHandle(event, listener, dataBack) {
    let data = dataBack;
    if (event === XG.RemoteNotificationEvent) {
        data = {};
        data.alertBody = dataBack.Content;
        data.title = dataBack.Title;
        if (dataBack.CustomContent)
            Object.assign(data, JSON.parse(dataBack.CustomContent));
    }
    listener(data);
}

export function addEventListener(event, listener) {
    if (allEvents().indexOf(event) < 0) return;
    return DeviceEventEmitter.addListener(event,
        eventHandle.bind(null, event, listener));
}

export function setCredential(accessId, accessKey) {
    return XG.setCredential(accessId, accessKey);
}

export function setTag(tag) {
    XG.setTag(tag);
}

export function delTag(tag) {
    XG.delTag(tag);
}

export function unregister() {
    XG.unregisterPush();
}

export function enableDebug(enable) {
    XG.enableDebug(enable === undefined ? true : enable);
}