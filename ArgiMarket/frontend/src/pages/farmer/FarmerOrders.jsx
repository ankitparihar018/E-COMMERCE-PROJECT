import { useEffect, useState } from "react";
import { getFarmerOrders, updateOrderStatus } from "../../services/order.api";
import Loader from "../../components/Loader";

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const response = await getFarmerOrders();

            if (response.data.success) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                "Failed to load farmer orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const response = await updateOrderStatus(orderId, status);

            if (response.data.success) {
                alert("Order status updated successfully");
                loadOrders();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Farmer Orders
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage orders received for your products.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No orders found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        You don't have any orders yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>
                                    <h2 className="font-bold text-lg">
                                        Order #{order._id.slice(-8)}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <select
                                    value={order.orderStatus}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order._id,
                                            e.target.value
                                        )
                                    }
                                    className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="confirmed">
                                        Confirmed
                                    </option>

                                    <option value="processing">
                                        Processing
                                    </option>

                                    <option value="out_for_delivery">
                                        Out for Delivery
                                    </option>

                                    <option value="delivered">
                                        Delivered
                                    </option>

                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>

                            </div>

                            <div className="border-t mt-5 pt-5">

                                <h3 className="font-semibold mb-3">
                                    Products
                                </h3>

                                <div className="space-y-3">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Quantity: {item.quantity}{" "}
                                                    {item.unit}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="border-t mt-5 pt-5 flex justify-between">

                                <span className="font-semibold">
                                    Total Amount
                                </span>

                                <span className="text-xl font-bold text-green-600">
                                    ₹{order.totalAmount}
                                </span>

                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default FarmerOrders;