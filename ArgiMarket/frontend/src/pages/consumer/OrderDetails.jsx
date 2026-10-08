import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrder } from "../../services/order.api";
import { payForOrder } from "../../services/payment.api";

const OrderDetails = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {

        const load = async () => {

            try {

                const response = await getOrder(id);

                if (response.data.success) {
                    setOrder(response.data.order);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        load();

    }, [id]);

    const handlePayment = async () => {
        try {
            setPaying(true);
            await payForOrder(id);
            setOrder((currentOrder) => ({
                ...currentOrder,
                paymentStatus: "paid",
                orderStatus: "confirmed"
            }));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.message ||
                "Payment failed. Please try again."
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                Order not found.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        Order Details
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Order #{order._id}
                    </p>
                </div>

                <span className="w-fit px-4 py-2 rounded-full bg-green-100 text-green-700 capitalize">
                    {order.orderStatus}
                </span>

            </div>

            {/* Products */}

            <div className="bg-white border rounded-2xl p-5 sm:p-7 mt-8">

                <h2 className="text-xl font-semibold">
                    Products
                </h2>

                <div className="divide-y mt-5">

                    {order.items?.map((item, index) => (

                        <div
                            key={index}
                            className="py-4 flex justify-between gap-5"
                        >

                            <div>
                                <h3 className="font-medium">
                                    {item.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p className="font-semibold">
                                ₹{item.price * item.quantity}
                            </p>

                        </div>

                    ))}

                </div>

                <div className="border-t mt-4 pt-5 flex justify-between text-xl font-bold">

                    <span>Total</span>

                    <span>
                        ₹{order.totalAmount}
                    </span>

                </div>

            </div>

            {/* Delivery */}

            <div className="bg-white border rounded-2xl p-5 sm:p-7 mt-6">

                <h2 className="text-xl font-semibold">
                    Delivery Address
                </h2>

                <div className="mt-4 text-gray-600 space-y-1">

                    <p>
                        {order.shippingAddress?.address}
                    </p>

                    <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                    </p>

                    <p>
                        {order.shippingAddress?.pincode}
                    </p>

                    <p>
                        Contact:{" "}
                        {order.shippingAddress?.contact}
                    </p>

                </div>

            </div>

            {/* Payment */}

            <div className="bg-white border rounded-2xl p-5 sm:p-7 mt-6">

                <h2 className="text-xl font-semibold">
                    Payment
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                    <p className="capitalize">
                        Status:{" "}
                        <span className="font-medium">
                            {order.paymentStatus}
                        </span>
                    </p>

                    {order.paymentStatus !== "paid" &&
                        order.orderStatus !== "cancelled" && (
                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={paying}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
                            >
                                {paying ? "Opening..." : "Pay now"}
                            </button>
                        )}
                </div>

            </div>

            <Link
                to="/orders"
                className="inline-block mt-6 px-5 py-3 rounded-xl bg-green-600 text-white"
            >
                Back to Orders
            </Link>

        </div>
    );
};

export default OrderDetails;