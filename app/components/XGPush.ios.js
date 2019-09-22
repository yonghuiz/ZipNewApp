/**
 * Created by liuyu on 2017/10/13.
 */
import {
    NativeModules,
    NativeEventEmitter,
} from 'react-native'

const XG = NativeModules.TencentXGManager;
const XGModule = new NativeEventEmitter(XG);

export function allEvents() {
    console.log(XG);
    return [
        XG.FailureEvent,
        XG.RegisteredEvent,
        XG.RemoteNotificationEvent,
    ];
}

export function eventHandle(event, listener, dataBack) {
    let data = dataBack;
    if (event === XG.RemoteNotificationEvent) {
        if (dataBack.aps) {
            data = {};
            data.alertBody = dataBack.aps.alert;
            data.badge = dataBack.aps.badge;
            Object.keys(dataBack).filter(k => k !== 'aps')
                .forEach(k => data[k] = dataBack[k]);
        }
    }
    listener(data);
}

export function addEventListener(event, listener) {
    if (allEvents().indexOf(event) < 0) return;
    return XGModule.addListener(
        event, listener
    );
}

export function enableDebug(enable) {
    XG.enableDebug(enable);
}

export function setCredential(accessId, accessKey) {
    XG.setCredential(accessId,accessKey);
}

export function setAccount(account) {
    XG.setAccount(account);
}



