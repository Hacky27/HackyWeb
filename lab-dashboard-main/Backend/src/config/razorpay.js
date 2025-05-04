import Razorpay from "razorpay";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js"


const instance = new Razorpay({
    // key_id: process.env.RAZORPAY_KEY_ID,
    // key_secret: process.env.RAZORPAY_KEY_SECRET,
    key_id:"rzp_test_LNzuEyh8Xnf1UI",
    key_secret:"J4o9BCR1h0WjH30wY0j2YJAw",
   

});

export { instance, validateWebhookSignature };
