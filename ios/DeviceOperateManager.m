//
//  DeviceOperateManager.m
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DeviceOperateManager.h"
#import <UIKit/UIKit.h>

@implementation DeviceOperateManager
RCT_EXPORT_MODULE(DeviceOperate)
RCT_EXPORT_METHOD(openSetting) {
  NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
  if ([[UIApplication sharedApplication] canOpenURL:url]) {
    [[UIApplication sharedApplication] openURL:url];
  }
}
@end
