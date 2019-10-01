package com.zipcodexpress;

import android.app.Application;
import android.util.Log;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import com.horcrux.svg.SvgPackage;
//import org.reactnative.camera.RNCameraPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.airbnb.android.react.maps.MapsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.facebook.react.shell.MainReactPackage;

import com.imagepicker.ImagePickerPackage;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

//public class MainApplication extends Application implements ReactApplication {
  public class MainApplication extends NavigationApplication {

    @Override
        protected ReactGateway createReactGateway() {
            ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
                @Override
                protected String getJSMainModuleName() {
                    return "index.android";
                }
            };
            return new ReactGateway(this, isDebug(), host);
        }
    
        @Override
        public boolean isDebug() {
            return BuildConfig.DEBUG;
        }
    
        protected List<ReactPackage> getPackages() {
            // Add additional packages you require here
            // No need to add RnnPackage and MainReactPackage
            return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
           
            new SplashScreenReactPackage(),
              new SvgPackage(),
              //new RNCameraPackage(),
              new RCTCameraPackage(),
              new RNCWebViewPackage(),
              new MapsPackage(),
              new ImageResizerPackage(),
              new AsyncStoragePackage(),
              new PickerPackage(),
              new VectorIconsPackage(),
             new ZipcodeReactPackage(),
              new ImagePickerPackage()
                // eg. new VectorIconsPackage()
            );
        }
    
        @Override
        public List<ReactPackage> createAdditionalReactPackages() {
            return getPackages();
  }
}
