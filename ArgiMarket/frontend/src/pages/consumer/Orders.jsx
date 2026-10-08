import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../../services/order.api";
import { payForOrder } from "../../services/payment.api";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [payingOrderId, setPayingOrderId] = useState(null);

    useEffect(() => {

        const load = async () => {

            try {
                const response = await getMyOrders();

                if (!response.data.success) {
                    throw new Error(response.data.message || "Failed to load order history.");
                }

                setOrders(response.data.orders);
            } catch (error) {
                setLoadError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load order history."
                );
            } finally {
                setLoading(false);
            }
        };

        load();

    }, []);

    const handlePayment = async (orderId) => {
        try {
            setPayingOrderId(orderId);
            await payForOrder(orderId);
            setOrders((currentOrders) => currentOrders.map((order) => (
                order._id === orderId
                    ? {
                        ...order,
                        paymentStatus: "paid",
                        orderStatus: "confirmed"
                    }
                    : order
            )));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.message ||
                "Payment failed. Please try again."
            );
        } finally {
            setPayingOrderId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold">
                Order History
            </h1>

            <p className="text-gray-600 mt-2">
                View your purchases, delivery status, and payment details.
            </p>

            {loading ? (
                <p className="mt-8 text-gray-600" role="status">
                    Loading your order history...
                </p>
            ) : loadError ? (
                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700" role="alert">
                    {loadError}
                </div>
            ) : orders.length === 0 ? (
                <div className="mt-8 rounded-2xl border bg-white p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        No orders yet
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Your purchases will appear here after you place an order.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block mt-5 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 mt-8">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-white border rounded-2xl p-5"
                    >

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                            <div>

                                <p className="font-semibold">
                                    Order #{order._id.slice(-8)}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    Placed {new Date(order.createdAt).toLocaleDateString()}
                                    {" · "}
                                    {order.items?.length ?? 0} items
                                </p>

                            </div>

                            <span className={`px-3 py-1 h-fit rounded-full text-sm capitalize ${
                                order.orderStatus === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : order.orderStatus === "delivered"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                            }`}>
                                {order.orderStatus.replaceAll("_", " ")}
                            </span>

                        </div>

                        <div className="mt-4 space-y-2 border-t pt-4">
                            {order.items?.map((item, index) => (
                                <div
                                    key={item.product?._id || `${order._id}-${index}`}
                                    className="flex justify-between gap-4 text-sm"
                                >
                                    <span className="text-gray-700">
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span className="shrink-0 text-gray-600">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-5">

                            <div>
                                <strong>
                                    ₹{order.totalAmount}
                                </strong>
                                <p className="text-sm text-gray-500 capitalize">
                                    Payment: {order.paymentStatus}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {order.paymentStatus !== "paid" &&
                                    order.orderStatus !== "cancelled" && (
                                        <button
                                            type="button"
                                            onClick={() => handlePayment(order._id)}
                                            disabled={payingOrderId !== null}
                                            className="text-green-600 font-medium disabled:opacity-50"
                                        >
                                            {payingOrderId === order._id
                                                ? "Opening..."
                                                : "Pay now"}
                                        </button>
                                    )}

                                <Link
                                    to={`/orders/${order._id}`}
                                    className="text-green-600 font-medium"
                                >
                                    View Details
                                </Link>
                            </div>

                        </div>

                    </div>

                ))}

                </div>
            )}

        </div>
    );
};

export default Orders;