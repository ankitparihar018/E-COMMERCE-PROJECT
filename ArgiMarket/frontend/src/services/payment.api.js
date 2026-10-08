import axios from "axios";

const api = axios.create({
    baseURL: "/api/payments",
    withCredentials: true
});

let razorpayScriptPromise;

const loadRazorpayScript = () => {
    if (window.Razorpay) {
        return Promise.resolve();
    }

    if (!razorpayScriptPromise) {
        razorpayScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                if (window.Razorpay) {
                    resolve();
                } else {
                    razorpayScriptPromise = null;
                    reject(new Error("Razorpay Checkout could not be loaded."));
                }
            };
            script.onerror = () => {
                razorpayScriptPromise = null;
                reject(new Error("Unable to load Razorpay Checkout."));
            };
            document.body.appendChild(script);
        });
    }

    return razorpayScriptPromise;
};

export const createPaymentOrder = (orderId) => {
    return api.post("/create-order", { orderId });
};

export const verifyPayment = (data) => {
    return api.post("/verify", data);
};

export const payForOrder = async (orderId) => {
    await loadRazorpayScript();

    const response = await createPaymentOrder(orderId);
    const { key, order } = response.data;

    return new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
            key,
            amount: order.amount,
            currency: order.currency,
            name: "Agri Marketplace",
            description: "Order payment",
            order_id: order.id,
            handler: async (paymentResponse) => {
                try {
                    const verification = await verifyPayment({
                        orderId,
                        razorpayOrderId: paymentResponse.razorpay_order_id,
                        razorpayPaymentId: paymentResponse.razorpay_payment_id,
                        razorpaySignature: paymentResponse.razorpay_signature
                    });

                    resolve(verification.data);
                } catch (error) {
                    reject(error);
                }
            },
            modal: {
                ondismiss: () => reject(new Error("Payment was cancelled."))
            }
        });

        checkout.on("payment.failed", (paymentResponse) => {
            reject(new Error(
                paymentResponse.error?.description || "Payment failed."
            ));
        });

        checkout.open();
    });
};
