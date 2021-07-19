package com.zipcodexpress1;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by linyang on 2017/9/27.
 */

public class ZipcodeReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MyLocationManager(reactContext));
        modules.add(new DeviceOperateManager(reactContext));
        modules.add(new PaymentManager(reactContext));
        // modules.add(new TencentXGManager(reactContext));
        modules.add(new DeviceInfoManager(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
        // return Arrays.<ViewManager>asList();
    }
}
