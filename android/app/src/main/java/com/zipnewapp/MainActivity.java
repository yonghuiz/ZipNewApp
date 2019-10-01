package com.zipcodexpress;

import android.content.res.AssetManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;

import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.TextView;


import com.reactnativenavigation.NavigationActivity;
import android.content.res.AssetManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


//import com.mapbox.mapboxsdk.Mapbox;
//import com.reactnativenavigation.controllers.SplashActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
import com.facebook.react.modules.core.PermissionListener; // <- add this import
import com.tencent.android.tpush.XGIOperateCallback;
import com.tencent.android.tpush.XGPushConfig;
import com.tencent.android.tpush.XGPushManager;
public class MainActivity extends NavigationActivity  {
    private PermissionListener listener;
 //   public class MainActivity extends SplashActivity implements OnImagePickerPermissionsCallback {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // @Override
    // protected String getMainComponentName() {
    //     return "zipcodeXpress";
    // }

  //  @Override
    // public View createSplashLayout() {

    //     View view = getLayoutInflater().inflate(R.layout.launchlayout,null);
    //     TextView textView3 = (TextView)view.findViewById(R.id.textView1);
    //     TextView textView4 = (TextView)view.findViewById(R.id.textView2);

    //     AssetManager mgr = getAssets();//得到AssetManager
    //     Typeface tf1 =Typeface.createFromAsset(mgr, "fonts/Avenir-Medium.ttf");//根据路径得到Typeface
    //     Typeface tf2 = Typeface.createFromAsset(mgr, "fonts/Avenir-Medium.ttf");

    //     textView3.setTypeface(tf1);
    //     textView4.setTypeface(tf2);


    // //    TextView textView = (TextView) findViewById(R.id.textView1);

    // //    SpannableStringBuilder sb = new SpannableStringBuilder("Package receiving becomes so easy and safe!"); // 包装字体内容
    // //    ForegroundColorSpan fcs = new ForegroundColorSpan(Color.parseColor("#333333")); // 设置字体颜色
    // //    AbsoluteSizeSpan ass = new AbsoluteSizeSpan(18);  // 设置字体大小

    // //    sb.setSpan(fcs, 26, 42, Spannable.SPAN_INCLUSIVE_INCLUSIVE);
    // //    sb.setSpan(ass, 26, 42, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
    // //    textView.setText(sb);

    //     return view;
    // }
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        SplashScreen.show(this);
       // createSplashLayout().show(this);
        super.onCreate(savedInstanceState);
		
      //  Mapbox.getInstance(getApplicationContext(),"pk.eyJ1IjoiZ291bmlib3giLCJhIjoiY2oyanJsMHJkMDAyNTJ3b3kwMDRpbnl6MiJ9.2RinQtHmuFBOHBN9JI4jxA");

        //开启信鸽日志输出

        XGPushConfig.enableDebug(this, true);

//        XGPushManager.registerPush(this, new XGIOperateCallback() {
//            @Override
//            public void onSuccess(Object o, int i) {
//                Log.d("TPush", "注册成功，设备token为：" + o);
//            }
//
//            @Override
//            public void onFail(Object o, int i, String s) {
//                Log.d("TPush", "注册失败，错误码：" + i + ",错误信息：" + s);
//            }
//        });
    }

  //  @Override
    public void setPermissionListener(@NonNull PermissionListener listener) {
        this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        if (listener != null)
        {
            listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

}
