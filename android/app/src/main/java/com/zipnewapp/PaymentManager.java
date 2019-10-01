package com.zipcodexpress;

import com.braintreepayments.api.BraintreeFragment;
import com.braintreepayments.api.PayPal;
import com.braintreepayments.api.exceptions.InvalidArgumentException;
import com.braintreepayments.api.interfaces.BraintreeCancelListener;
import com.braintreepayments.api.interfaces.BraintreeErrorListener;
import com.braintreepayments.api.interfaces.PaymentMethodNonceCreatedListener;
import com.braintreepayments.api.models.PayPalRequest;
import com.braintreepayments.api.models.PaymentMethodNonce;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by linyang on 2017/9/27.
 */

public class PaymentManager extends ReactContextBaseJavaModule implements
        BraintreeCancelListener,
        BraintreeErrorListener,
        PaymentMethodNonceCreatedListener {
    private BraintreeFragment mBraintreeFragment = null;
    private Callback payCallback;
    PaymentManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PayPal";
    }

    @ReactMethod
    public void payWithAmount(String amount,final Callback callback) {
        payCallback = callback;
        try {
            mBraintreeFragment = BraintreeFragment.newInstance(getCurrentActivity(),"sandbox_hd6s9zyw_vy4r2mkgkvry9nns");
            mBraintreeFragment.addListener(this);
        } catch (InvalidArgumentException e) {
            onError(e);
        }
        PayPalRequest request = new PayPalRequest(amount).currencyCode("USD");
        PayPal.requestOneTimePayment(mBraintreeFragment,request);
    }

    @Override
    public void onCancel(int requestCode) {
        payCallback.invoke(false,"cancel");
    }

    @Override
    public void onError(Exception error) {
        payCallback.invoke(false,"error");
    }

    @Override
    public void onPaymentMethodNonceCreated(PaymentMethodNonce paymentMethodNonce) {
        payCallback.invoke(true,paymentMethodNonce.getNonce());
    }
}
