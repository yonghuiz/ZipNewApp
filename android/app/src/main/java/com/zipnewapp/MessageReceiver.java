package com.zipcodexpress;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import com.tencent.android.tpush.XGPushBaseReceiver;
import com.tencent.android.tpush.XGPushClickedResult;
import com.tencent.android.tpush.XGPushRegisterResult;
import com.tencent.android.tpush.XGPushShowedResult;
import com.tencent.android.tpush.XGPushTextMessage;

/**
 * Created by linyang on 2017/10/11.
 */

public class MessageReceiver extends XGPushBaseReceiver {

    public static final String MActionNotification = "zp.tencentxg.XG-Notification";
    public static final String MActionCustomNotification = "zp.tencentxg.XG-CustomNotification";
    public static final String MActionUnregister = "zp.tencentxg.XG-Unregister";
    public static final String MActionRegistration = "zp.tencentxg.XG-Registration";
    public static final String MActionTagSetting = "zp.tencentxg.XG-tagSetting";
    public static final String MActionTagDeleting = "zp.tencentxg.XG-tagDeleting";
    public static final String MActionClickNotification = "zp.tencentxg.XG-ClickNotification";


    public static final String LogTag = "TPushReceiver";

    private void show(Context context, String text) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
    }

    //通知展示
    @Override
    public void onNotifactionShowedResult(Context context, XGPushShowedResult xgPushShowedResult) {
        Log.d(LogTag, "Got notification " + xgPushShowedResult.toString());
        Bundle payload = new Bundle();
        payload.putString("Content",xgPushShowedResult.getContent());
        payload.putString("Title",xgPushShowedResult.getTitle());
        payload.putLong("MsgId",xgPushShowedResult.getMsgId());
        payload.putLong("NotificationId",xgPushShowedResult.getNotifactionId());
        payload.putLong("NActionType", xgPushShowedResult.getNotificationActionType());
        payload.putString("CustomContent",xgPushShowedResult.getCustomContent());

        Intent intent = new Intent(MActionNotification);
        intent.setFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
        intent.putExtra("data",payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    //反注册的回调
    @Override
    public void onUnregisterResult(Context context, int errorCode) {
        if (context == null) {
            return;
        }
        Log.d(LogTag, "Got unregister result " + errorCode);

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);

        Intent intent = new Intent(MActionUnregister);
        intent.putExtra("data",payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);

//        String text = "";
//        if (errorCode == XGPushBaseReceiver.SUCCESS) {
//            text = "反注册成功";
//        } else {
//            text = "反注册失败" + errorCode;
//        }
//        Log.d(LogTag,text);
    }

    //通知点击回调 actionType=1为该消息被清除,actionType=0为该消息被点击
    @Override
    public void onNotifactionClickedResult(Context context, XGPushClickedResult message) {
        if (context == null || message == null) return;
        Log.d(LogTag, "Got message click " + message.toString());

        Bundle payload = new Bundle();
        payload.putString("Content", message.getContent());
        payload.putString("Title", message.getTitle());
        payload.putLong("MsgId", message.getMsgId());
        payload.putString("CustomContent", message.getCustomContent());
        payload.putLong("NActionType", message.getNotificationActionType());
        payload.putLong("ActionType", message.getActionType());
        payload.putString("ActivityName", message.getActivityName());

        Intent intent = new Intent(MActionClickNotification);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
//        String text = "";
//        if (message.getActionType() == XGPushClickedResult.NOTIFACTION_CLICKED_TYPE) {
//            // 通知再通知栏被点击
//            //APP自己处理点击的相关动作
//            text = "通知被打开 :" + message;
//        } else {
//            text = "通知被清除 :" + message;
//        }
//        Log.d(LogTag, text);
    }

    //设置tag的回调
    @Override
    public void onSetTagResult(Context context, int errorCode, String tagName) {
        if (context == null) return;
        Log.d(LogTag, "Got setting tag result " + errorCode);

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);
        payload.putString("tagName", tagName);

        Intent intent = new Intent(MActionTagSetting);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
//        if (context == null) {
//            return;
//        }
//        String text = "";
//        if (errorCode == XGPushBaseReceiver.SUCCESS) {
//            text = "\"" + tagName + "\"设置成功";
//        } else {
//            text = "\"" + tagName + "\"设置失败,错误码：" + errorCode;
//        }
//        Log.d(LogTag, text);
    }

    //删除tag的回调
    @Override
    public void onDeleteTagResult(Context context, int errorCode, String tagName) {
        if (context == null) return;
        Log.d(LogTag, "Got deleting tag result " + errorCode);

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);
        payload.putString("tagName", tagName);

        Intent intent = new Intent(MActionTagDeleting);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
//        if (context == null) {
//            return;
//        }
//        String text = "";
//        if (errorCode == XGPushBaseReceiver.SUCCESS) {
//            text = "\"" + tagName + "\"删除成功";
//        } else {
//            text = "\"" + tagName + "\"删除失败,错误码：" + errorCode;
//        }
//        Log.d(LogTag, text);
    }

    //注册回调
    @Override
    public void onRegisterResult(Context context, int errorCode, XGPushRegisterResult message) {
        if (context == null || message == null) {
            return;
        }
        Log.d(LogTag,"Got register result " + message.toString());

        Bundle payload = new Bundle();
        payload.putInt("errorCode",errorCode);
        payload.putLong("AccessId",message.getAccessId());
        payload.putString("Account",message.getAccount());
        payload.putString("DeviceId",message.getDeviceId());
        payload.putString("Ticket",message.getTicket());
        payload.putShort("TicketType",message.getTicketType());
        payload.putString("Token",message.getToken());

        Intent intent = new Intent(MActionRegistration);
        intent.putExtra("data",payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);

//        String text = "";
//        if (errorCode == XGPushBaseReceiver.SUCCESS) {
//            text = message + "注册成功";
//            // 在这里拿token
//            String token = message.getToken();
//        } else {
//            text = message + "注册失败，错误码：" + errorCode;
//        }
//        Log.d(LogTag, text);
    }

    //消息透传的回调
    @Override
    public void onTextMessage(Context context, XGPushTextMessage message) {
        if (context == null || message == null) return;
        Log.d(LogTag, "Got text notification" + message.toString());

        Bundle payload = new Bundle();
        payload.putString("Title", message.getTitle());
        payload.putString("Content", message.getContent());
        payload.putString("CustomContent", message.getCustomContent());

        Intent intent = new Intent(MActionCustomNotification);
        intent.putExtra("data",payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);

        String text = "收到消息:" + message.toString();

        // 获取自定义key-value
//        String customContent = message.getCustomContent();
//        if (customContent != null && customContent.length() != 0) {
//            try {
//                JSONObject obj = new JSONObject(customContent);
//                // key1为前台配置的key
//                if (!obj.isNull("key")) {
//                    String value = obj.getString("key");
//                    Log.d(LogTag, "get custom value:" + value);
//                }
//                // ...
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//        // APP自主处理消息的过程...
//        Log.d(LogTag, text);
    }
}
