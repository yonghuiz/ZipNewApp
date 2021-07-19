//
//  PermissionManager.m
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "PermissionManager.h"
#import <CoreLocation/CoreLocation.h>
#import <Photos/Photos.h>
#import <AVFoundation/AVFoundation.h>

@interface PermissionManager () <CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@property (nonatomic) RCTResponseSenderBlock callback;
@end

@implementation PermissionManager
RCT_EXPORT_MODULE(Permission)
RCT_EXPORT_METHOD(checkLocation:(RCTResponseSenderBlock)callback) {
  if (self.locationManager == nil) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
  }
  
  int status = [CLLocationManager authorizationStatus];
  switch (status) {
    case kCLAuthorizationStatusAuthorizedAlways:
    case kCLAuthorizationStatusAuthorizedWhenInUse:
      callback(@[@"authorized"]);
      break;
    case kCLAuthorizationStatusDenied:
      callback(@[@"denied"]);
      break;
    case kCLAuthorizationStatusRestricted:
      callback(@[@"restricted"]);
      break;
    default:
      callback(@[@"undtermined"]);
      break;
  }
}

RCT_EXPORT_METHOD(requestLocation:(RCTResponseSenderBlock)callback) {
  if (self.locationManager == nil) {
    self.locationManager = [[CLLocationManager alloc]init];
  }
  self.locationManager.delegate = self;
  self.callback = callback;
  [self.locationManager requestWhenInUseAuthorization];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
    self.callback(@[[NSNumber numberWithInteger:status]]);
    if (status != kCLAuthorizationStatusNotDetermined) {
      switch (status) {
        case kCLAuthorizationStatusAuthorizedWhenInUse:
          self.callback(@[@"authorized"]);
          break;
        default:
          self.callback(@[@"denied"]);
          break;
      }
    }
  });
}

RCT_EXPORT_METHOD(checkPhoto:(RCTResponseSenderBlock)callback) {
  int status = [PHPhotoLibrary authorizationStatus];
  switch (status) {
    case PHAuthorizationStatusAuthorized:
      callback(@[@"authorized"]);
      break;
    case PHAuthorizationStatusDenied:
      callback(@[@"denied"]);
      break;
    case PHAuthorizationStatusRestricted:
      callback(@[@"restricted"]);
      break;
    default:
      callback(@[@"undtermined"]);
      break;
  }
}

RCT_EXPORT_METHOD(requestPhoto:(RCTResponseSenderBlock)callback) {
  [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
    switch (status) {
      case PHAuthorizationStatusAuthorized:
        callback(@[@"authorized"]);
        break;
      case PHAuthorizationStatusDenied:
        callback(@[@"denied"]);
        break;
      case PHAuthorizationStatusRestricted:
        callback(@[@"restricted"]);
        break;
      default:
        callback(@[@"undtermined"]);
        break;
    }
  }];
}

RCT_EXPORT_METHOD(checkCamera:(RCTResponseSenderBlock)callback) {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  switch (status) {
    case AVAuthorizationStatusNotDetermined:
      callback(@[@"undetermined"]);
      break;
    case AVAuthorizationStatusDenied:
      callback(@[@"denied"]);
      break;
    case AVAuthorizationStatusAuthorized:
      callback(@[@"authorized"]);
      break;
    default:
      callback(@[@"restricted"]);
      break;
  }
}



RCT_EXPORT_METHOD(requestCamera:(RCTResponseSenderBlock)callback) {
  [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
    if (granted) {
      callback(@[@"authorized"]);
    } else {
      callback(@[@"denied"]);
    }
  }];
}


@end
