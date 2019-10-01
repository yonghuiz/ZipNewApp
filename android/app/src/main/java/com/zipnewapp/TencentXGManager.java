package com.zipcodexpress;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tencent.android.tpush.XGIOperateCallback;
import com.tencent.android.tpush.XGPushBaseReceiver;
import com.tencent.android.tpush.XGPushConfig;
import com.tencent.android.tpush.XGPushManager;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by linyang on 2017/10/16.
 */

public class TencentXGManager extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private Context context;
    private ReactApplicationContext reactContext;
    private BroadcastReceiver innerReceiver;
    private IntentFilter innerFilter;
    private static final String LogTag = "TPushRNModule";
    private static final String RCTRemoteNotificationEvent = "notification";
    private static final String RCTRegisteredEvent = "register";
    private static final String RCTFailureEvent = "error";

    public TencentXGManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.context = reactContext.getApplicationContext();
        innerReceiver = new InnerMessageReceiver(this);

        innerFilter = new IntentFilter();
        innerFilter.addAction(MessageReceiver.MActionNotification);
        innerFilter.addAction(MessageReceiver.MActionCustomNotification);
        innerFilter.addAction(MessageReceiver.MActionUnregister);
        innerFilter.addAction(MessageReceiver.MActionRegistration);
        innerFilter.addAction(MessageReceiver.MActionTagSetting);
        innerFilter.addAction(MessageReceiver.MActionTagDeleting);
        innerFilter.addAction(MessageReceiver.MActionClickNotification);
        LocalBroadcastManager.getInstance(this.context).registerReceiver(this.innerReceiver,
                this.innerFilter);
        reactContext.addLifecycleEventListener(this);
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("RemoteNotificationEvent",RCTRemoteNotificationEvent);
        constants.put("RegisteredEvent",RCTRegisteredEvent);
        constants.put("FailureEvent",RCTFailureEvent);
        return constants;
    }

    @Override
    public String getName() {
        return "TencentXGManager";
    }

    //注册通知
    @ReactMethod
    public void registerPush() {
        Log.d(LogTag,"注册通知");
        XGPushManager.registerPush(this.context, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object o, int i) {
                Log.d(LogTag,"注册通知成功");
                sendEvent(RCTRegisteredEvent, o);
            }

            @Override
            public void onFail(Object o, int i, String s) {
                Log.d(LogTag,"注册通知失败");
                sendEvent(RCTFailureEvent,s);
            }
        });
    }

    //注册通知并设置帐号
    @ReactMethod
    public void registerPushAndBindAccount(String account) {
        Log.d(LogTag,"设置帐号");
        XGPushManager.registerPush(this.context, account, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object o, int i) {
                Log.d(LogTag,"设置帐号成功");
                sendEvent(RCTRegisteredEvent,o);
            }

            @Override
            public void onFail(Object o, int i, String s) {
                Log.d(LogTag,"设置帐号失败");
                sendEvent(RCTFailureEvent,s);
            }
        });
    }

    @ReactMethod
    public void registerPushWithTicket(String account, String ticket, int ticketType, String qua) {
        XGPushManager.registerPush(this.context, account, ticket, ticketType, qua, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object o, int i) {
                sendEvent(RCTRegisteredEvent, o);
            }

            @Override
            public void onFail(Object o, int i, String s) {
                sendEvent(RCTFailureEvent,s);
            }
        });
    }

    //注销通知
    public void unregisterPush() {
        XGPushManager.unregisterPush(this.context);
    }

    //设置tag
    @ReactMethod
    public void setTag(String tag) {
        XGPushManager.setTag(this.context,tag);
    }

    //删除tag
    @ReactMethod
    public void deleteTag(String tag) {
        XGPushManager.deleteTag(this.context,tag);
    }

    @ReactMethod
    public void enableDebug(Boolean enable) {
        XGPushConfig.enableDebug(this.context,enable);
    }

    @ReactMethod
    public void setCredential(Integer accessId, String accessKey) {
        Log.d(LogTag,"设置accessID, accessKey");
        XGPushConfig.setAccessId(this.context,accessId);
        XGPushConfig.setAccessKey(this.context,accessKey);
    }

    @ReactMethod
    public String getDeviceToken() {
        return XGPushConfig.getToken(this.context);
    }

    private void sendEvent(String eventName, @Nullable Object params) {
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        Log.d(LogTag, "Unregister inner message receiver");
        LocalBroadcastManager.getInstance(this.context).unregisterReceiver(this.innerReceiver);
    }

    public void sendEvent(Intent intent) {
        Bundle payload = intent.getExtras().getBundle("data");
        WritableMap params;
        Log.d(LogTag,intent.getAction());
        switch (intent.getAction()) {
            case MessageReceiver.MActionNotification:
                params = Arguments.createMap();
                params.putString("Content", payload.getString("Content"));
                params.putString("Title", payload.getString("Title"));
                params.putInt("MsgId",(int)payload.getLong("MsgId"));
                params.putInt("NotificationId",(int)payload.getLong("NotificationId"));
                params.putInt("NActionType",(int)payload.getLong("NActionType"));
                params.putString("CustomContent",payload.getString("CustomContent"));
                Log.d(LogTag, "Got notification " + payload.toString());
                sendEvent(RCTRemoteNotificationEvent,params);
                break;
            case MessageReceiver.MActionCustomNotification:
                params = Arguments.createMap();
                params.putString("Content", payload.getString("Content"));
                params.putString("Title", payload.getString("Title"));
                params.putInt("MsgId",(int)payload.getLong("MsgId"));
                params.putInt("NotificationId",(int)payload.getLong("NotificationId"));
                params.putInt("NActionType",(int)payload.getLong("NActionType"));
                params.putString("CustomContent",payload.getString("CustomContent"));
                Log.d(LogTag, "Got custom notification " + payload.toString());
                sendEvent(RCTRemoteNotificationEvent, params);
                break;
            case MessageReceiver.MActionUnregister: {
                int errorCode = payload.getInt("errorCode");
                Log.d(LogTag, "Got unregister result " + payload.toString());
                if (errorCode != XGPushBaseReceiver.SUCCESS) {
                    sendEvent(RCTFailureEvent, "Fail to set unregister caused by " + errorCode);
                    break;
                }
            }
            case MessageReceiver.MActionRegistration:
                Log.d(LogTag, "Got register result " + payload.toString());
                break;
            case MessageReceiver.MActionTagSetting: {
                Log.d(LogTag, "Got tag setting result " + payload.toString());
                int errorCode = payload.getInt("errorCode");
                if (errorCode != XGPushBaseReceiver.SUCCESS) {
                    sendEvent(RCTFailureEvent, "Fail to set tag " + payload.getString("tagName") +
                            " caused by " + errorCode);
                }
                break;
            }
            case MessageReceiver.MActionTagDeleting: {
                Log.d(LogTag, "Got tag deleting result " + payload.toString());
                int errorCode = payload.getInt("errorCode");
                if (errorCode != XGPushBaseReceiver.SUCCESS) {
                    sendEvent(RCTFailureEvent, "Fail to delete tag " + payload.getString("tagName") +
                            " caused by " + errorCode);
                }
                break;
            }
            case MessageReceiver.MActionClickNotification: {
                sendEvent(RCTRemoteNotificationEvent,"Notification Click" + payload.getString("data"));
                Log.d(LogTag, "Got notification clicking result " + payload.toString());
                break;
            }
        }
    }

}
