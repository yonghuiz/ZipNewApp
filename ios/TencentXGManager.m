//
//  TencentXGManager.m
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/10/12.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "TencentXGManager.h"
#import "XGPush.h"
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>

NSString *const RCTRemoteNotificationReceived = @"RemoteNotificationReceived";
NSString *const RCTRemoteNotificationsRegistered = @"RemoteNotificationsRegistered";
NSString *const RCTFailToRegisterRemoteNotification = @"FailToRegisterRemoteNotification";

NSString *const RCTRemoteNotificationEvent = @"notification";
NSString *const RCTRegisteredEvent = @"register";
NSString *const RCTFailureEvent = @"error";

@interface TencentXGManager()<XGPushDelegate, XGPushTokenManagerDelegate>
@end

@implementation TencentXGManager
RCT_EXPORT_MODULE();
//@synthesize bridge = _bridge;


- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleRemoteNotificationReceived:)
                                               name:RCTRemoteNotificationReceived
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleRemoteNotificationsRegistered:)
                                               name:RCTRemoteNotificationsRegistered
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleFailToRegisterRemoteNotifications:)
                                               name:RCTFailToRegisterRemoteNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
           RCTRemoteNotificationEvent,
           RCTRegisteredEvent,
           RCTFailureEvent,
           ];
}

//- (void)setBridge:(RCTBridge *)bridge {
//  _bridge = bridge;
//
//}

- (void)handleRemoteNotificationReceived:(NSNotification *)notification
{
  [self sendEventWithName:RCTRemoteNotificationEvent body:notification.userInfo];
}

- (void)handleRemoteNotificationsRegistered:(NSNotification *)notification {
  [self sendEventWithName:RCTRegisteredEvent body:notification.userInfo];
}

- (void)handleFailToRegisterRemoteNotifications:(NSNotification *)notification {
  [self sendEventWithName:RCTFailureEvent body:notification.userInfo];
}

- (NSDictionary *)constantsToExport
{
  return @{
           @"RemoteNotificationEvent": RCTRemoteNotificationEvent,
           @"RegisteredEvent": RCTRegisteredEvent,
           @"FailureEvent": RCTFailureEvent
           };
}

RCT_EXPORT_METHOD(enableDebug:(BOOL)enable) {
  [[XGPush defaultManager] setEnableDebug:enable];
}

RCT_EXPORT_METHOD(setCredential:(int)appId appKey:(NSString *)appKey) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[XGPush defaultManager] startXGWithAppID:appId appKey:appKey delegate:self];
    [XGPushTokenManager defaultTokenManager].delegatge = self;
  });
}

RCT_EXPORT_METHOD(setAccount:(NSString *)account) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"绑定帐号");
    [[XGPushTokenManager defaultTokenManager] bindWithIdentifier:account type:XGPushTokenBindTypeAccount];
  });
}

+ (void)didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([UIApplication instancesRespondToSelector:@selector(registerForRemoteNotifications)]) {
      [[UIApplication sharedApplication] registerForRemoteNotifications];
    }
  });
}

+ (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSString *)deviceToken {
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationsRegistered
                                                      object:self
                                                    userInfo:@{@"deviceToken" : deviceToken}];
}

+ (void)didReceiveRemoteNotification:(NSDictionary *)notification {
  NSLog(@"收到通知");
  [[XGPush defaultManager] reportXGNotificationInfo:notification];
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTRemoteNotificationReceived
                                                      object:self
                                                    userInfo:notification];
}

+ (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTFailToRegisterRemoteNotification
                                                      object:self
                                                    userInfo:@{@"error":@"fail to register"}];
}


#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
// App 用户点击通知的回调
// 无论本地推送还是远程推送都会走这个回调
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"[XGDemo] click notification");
  if ([response.actionIdentifier isEqualToString:@"xgaction001"]) {
    NSLog(@"click from Action1");
  } else if ([response.actionIdentifier isEqualToString:@"xgaction002"]) {
    NSLog(@"click from Action2");
  } else if ([response.actionIdentifier isEqualToString:@"xgaction003"]) {
    NSLog(@"click from Action3");
  }
  NSLog(@"点击通知");
  [self sendEventWithName:RCTRemoteNotificationEvent body:response.notification.request.content.userInfo];
  [[XGPush defaultManager] reportXGNotificationInfo:response.notification.request.content.userInfo];
  
  completionHandler();
}

// App 在前台弹通知需要调用这个接口
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSLog(@"前台弹出通知");
  [TencentXGManager didReceiveRemoteNotification:notification.request.content.userInfo];
  [[XGPush defaultManager] reportXGNotificationInfo:notification.request.content.userInfo];
  //completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
  completionHandler(UNNotificationPresentationOptionSound);
}
#endif

- (void)xgPushDidBindWithIdentifier:(NSString *)identifier type:(XGPushTokenBindType)type error:(NSError *)error {
  NSLog(@"绑定帐号%@",identifier);
  NSLog(@"%@",error);
}

@end
