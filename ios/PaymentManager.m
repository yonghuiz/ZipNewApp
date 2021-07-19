//
//  PaymentManager.m
//  zipcodeXpress
//
//  Created by Lin Yang on 2017/9/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "PaymentManager.h"
#import "AppDelegate.h"

@implementation PaymentManager
RCT_EXPORT_MODULE(PayPal);
RCT_EXPORT_METHOD(payWithAmount:(NSString *)amount callback:(RCTResponseSenderBlock)callback) {
  self.braintreeClient = [[BTAPIClient alloc] initWithAuthorization:@"production_9qb7f6qw_pjmkcpqhmttyn2py"];
  
  BTPayPalDriver *payPalDriver = [[BTPayPalDriver alloc]initWithAPIClient:self.braintreeClient];
  payPalDriver.viewControllerPresentingDelegate = self;
  
  BTPayPalRequest *request = [[BTPayPalRequest alloc]initWithAmount:amount];
  request.currencyCode = @"USD";
  
  [payPalDriver requestOneTimePayment:request completion:^(BTPayPalAccountNonce * _Nullable tokenizedPayPalAccount, NSError * _Nullable error) {
    if (tokenizedPayPalAccount) {
      callback(@[@true,tokenizedPayPalAccount.nonce]);
    } else if (error) {
      callback(@[@false,@"error"]);
    } else {
      callback(@[@false,@"cancel"]);
    }
  }];
}

- (void)paymentDriver:(id)driver requestsPresentationOfViewController:(UIViewController *)viewController {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [app.window.rootViewController presentViewController:viewController animated:true completion:nil];
  });
}

- (void)paymentDriver:(id)driver requestsDismissalOfViewController:(UIViewController *)viewController {
  dispatch_async(dispatch_get_main_queue(), ^{
    [viewController dismissViewControllerAnimated:true completion:nil];
  });
}

@end
