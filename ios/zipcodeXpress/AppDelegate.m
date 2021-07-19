/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
//#import <RCCManager.h>
#import <Braintree/BraintreeCore.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
// #import "XGPush.h"
// #import "TencentXGManager.h"
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import "RNSplashScreen.h"



// @interface AppDelegate ()

// @end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  // RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
  //                                                  moduleName:@"zipcodeXpress"
  //                                           initialProperties:nil];

  // rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  // self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // UIViewController *rootViewController = [UIViewController new];
  // rootViewController.view = rootView;
  // self.window.rootViewController = rootViewController;
  // [self.window makeKeyAndVisible];
 NSURL *jsCodeLocation;

//   [BTAppSwitch setReturnURLScheme:@"com.unibox.express.payments"];
  

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
//   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//   self.window.backgroundColor = [UIColor whiteColor];
//   //[[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];

//  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
//                                                      moduleName:@"zipcodeXpress"
//                                               initialProperties:nil
//                                                   launchOptions:launchOptions];
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  UIViewController *rootViewController = [UIViewController new];
//  rootViewController.view = rootView;
//  self.window.rootViewController = rootViewController;
//  [self.window makeKeyAndVisible];
[ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
[RNSplashScreen show];
  [BTAppSwitch setReturnURLScheme:@"com.unibox.express.payments"];
  return YES;
}



- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([url.scheme localizedCaseInsensitiveCompare:@"com.unibox.express.payments"] == NSOrderedSame) {
    return [BTAppSwitch handleOpenURL:url options:options];
  }
  return NO;
}


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  if ([url.scheme localizedCaseInsensitiveCompare:@"com.unibox.express.payments"] == NSOrderedSame) {
    return [BTAppSwitch handleOpenURL:url sourceApplication:sourceApplication];
  }
  return NO;
}
// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

@end
