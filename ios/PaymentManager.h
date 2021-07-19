//
//  PaymentManager.h
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BraintreePayPal.h>
#import <React/RCTBridgeModule.h>

@interface PaymentManager : NSObject<RCTBridgeModule, BTViewControllerPresentingDelegate>
@property (nonatomic, strong) BTAPIClient *braintreeClient;
@property (nonatomic, strong) BTPayPalDriver *payPalDriver;
@end
