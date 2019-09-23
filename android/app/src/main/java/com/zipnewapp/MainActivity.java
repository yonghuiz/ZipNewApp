package com.zipnewapp;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
//import com.reactnativenavigation.controllers.SplashActivity;
import com.facebook.react.modules.core.PermissionListener; // <- add this import

public class MainActivity extends NavigationActivity  {

 //   public class MainActivity extends SplashActivity implements OnImagePickerPermissionsCallback {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // @Override
    // protected String getMainComponentName() {
    //     return "ZipNewApp";
    // }

    // @Override
    // public View createSplashLayout() {

    //     View view = getLayoutInflater().inflate(R.layout.launchlayout,null);
    //     TextView textView3 = (TextView)view.findViewById(R.id.textView1);
    //     TextView textView4 = (TextView)view.findViewById(R.id.textView2);

    //     AssetManager mgr = getAssets();//得到AssetManager
    //     Typeface tf1 =Typeface.createFromAsset(mgr, "fonts/Avenir-Medium.ttf");//根据路径得到Typeface
    //     Typeface tf2 = Typeface.createFromAsset(mgr, "fonts/Avenir-Medium.ttf");

    //     textView3.setTypeface(tf1);
    //     textView4.setTypeface(tf2);


//        TextView textView = (TextView) findViewById(R.id.textView1);
//
//        SpannableStringBuilder sb = new SpannableStringBuilder("Package receiving becomes so easy and safe!"); // 包装字体内容
//        ForegroundColorSpan fcs = new ForegroundColorSpan(Color.parseColor("#333333")); // 设置字体颜色
//        AbsoluteSizeSpan ass = new AbsoluteSizeSpan(18);  // 设置字体大小
//
//        sb.setSpan(fcs, 26, 42, Spannable.SPAN_INCLUSIVE_INCLUSIVE);
//        sb.setSpan(ass, 26, 42, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
//        textView.setText(sb);

    //     return view;
    // }

}
