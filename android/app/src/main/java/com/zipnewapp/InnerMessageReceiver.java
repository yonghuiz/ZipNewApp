package com.zipcodexpress;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Created by linyang on 2017/10/16.
 */

public class InnerMessageReceiver extends BroadcastReceiver{
    public static final String LogTag = "TPushReceiver";

    TencentXGManager rnModule;
    public InnerMessageReceiver(TencentXGManager module) {
        super();
        this.rnModule = module;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        this.rnModule.sendEvent(intent);
    }
}
