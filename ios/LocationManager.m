//
//  LocationManager.m
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LocationManager.h"
#import <CoreLocation/CoreLocation.h>
#import "AppDelegate.h"

@implementation LocationManager
RCT_EXPORT_MODULE(MyLocationManager)

RCT_EXPORT_METHOD(checkLocationAuthor:(RCTResponseSenderBlock)callback) {
  CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
  if (kCLAuthorizationStatusDenied == status || kCLAuthorizationStatusRestricted == status) {
    callback(@[@false]);
  } else {
    callback(@[@true]);
  }
}

RCT_EXPORT_METHOD(reverseGeocodeLocation:(float)lat lon:(float)lon callback:(RCTResponseSenderBlock)callback) {
  CLLocationCoordinate2D coor = CLLocationCoordinate2DMake(lat, lon);
  CLLocation *location = [[CLLocation alloc]initWithLatitude:coor.latitude longitude:coor.longitude];
  //反地理编码
  CLGeocoder *geocoder = [[CLGeocoder alloc]init];
  [geocoder reverseGeocodeLocation:location completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
    if (error || placemarks.count == 0) {
      NSLog(@"%@",error);
      callback(@[@false]);
    } else {
      CLPlacemark *firstPlacemark = [placemarks firstObject];
      CLPlacemark *secondPlacemark = nil;
      if (placemarks.count > 1) {
        secondPlacemark = placemarks[1];
        callback(@[[NSString stringWithFormat:@"%@ %@",firstPlacemark.name,secondPlacemark.name]]);
      } else {
        callback(@[firstPlacemark.name]);
      }
    }
  }];
}
@end
