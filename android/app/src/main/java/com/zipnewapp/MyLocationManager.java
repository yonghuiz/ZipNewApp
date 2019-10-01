package com.zipcodexpress;

import android.app.PendingIntent;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
//rz import com.mapbox.mapboxsdk.Mapbox;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

/**
 * Created by linyang on 2017/9/27.
 */

public class MyLocationManager extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    MyLocationManager(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "MyLocationManager";
    }

    @ReactMethod
    public void initMapBox() {
//		if(mListener!=null){
//			mListener.callBack();
//		}
        //Mapbox.getInstance(context.getApplicationContext(),"pk.eyJ1IjoiZ291bmlib3giLCJhIjoiY2oyanJsMHJkMDAyNTJ3b3kwMDRpbnl6MiJ9.2RinQtHmuFBOHBN9JI4jxA");
    }

    @ReactMethod
    public void reverseGeocodeLocation(double lat, double lon, Callback callback) {
        Geocoder geoCoder = new Geocoder(context, Locale.getDefault());
        try {
            List<Address> addresses = geoCoder.getFromLocation(
                    lat,
                    lon, 1);

            if (addresses.size() > 0) {
                String add = "";
                    add += addresses.get(0).getAddressLine(0) + " ";
                callback.invoke(add);
            } else {
                callback.invoke(false);
            }
        } catch (IOException e) {
            callback.invoke(false);
        }
    }

    @ReactMethod
    public void getCurrentLocation(final Callback callback) {
        Intent GPSIntent = new Intent();
        GPSIntent.setClassName("com.android.settings",
                "com.android.settings.widget.SettingsAppWidgetProvider");
        GPSIntent.addCategory("android.intent.category.ALTERNATIVE");
        GPSIntent.setData(Uri.parse("custom:3"));
        try {
            PendingIntent.getBroadcast(context, 0, GPSIntent, 0).send();
        } catch (PendingIntent.CanceledException e) {
            e.printStackTrace();
        }
        final LocationManager locationManager = (LocationManager) getCurrentActivity().getSystemService(context.LOCATION_SERVICE);
        final LocationListener locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                callback.invoke(true, location.getLatitude(), location.getLongitude());
            }

            @Override
            public void onStatusChanged(String s, int i, Bundle bundle) {
            }

            @Override
            public void onProviderEnabled(String s) {
            }

            @Override
            public void onProviderDisabled(String s) {
                callback.invoke(false);
            }
        };
        locationManager.requestLocationUpdates(locationManager.NETWORK_PROVIDER, 10000, 200, locationListener);
        //}
    }
	
	
	
	interface ActMethodCallBack{
		void callBack();
	}
}
