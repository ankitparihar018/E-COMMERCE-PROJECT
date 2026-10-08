import { useEffect, useState } from "react";

import { getOrders } from "../../services/admin.api";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {

            try {

                const response = await getOrders();

                if (response.data.success) {
                    setOrders(response.data.orders);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        load();

    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Manage Orders
            </h1>

            <div className="space-y-4 mt-8">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-white border rounded-2xl p-5"
                    >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <p className="font-semibold">
                                    #{order._id}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    {order.items?.length || 0} items
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="px-3 py-2 rounded-lg bg-green-50 text-green-700 capitalize">
                                    {order.orderStatus}
                                </span>

                                <strong>
                                    ₹{order.totalAmount}
                                </strong>

                            </div>

                        </div>

                        <div className="border-t mt-4 pt-4 text-sm text-gray-600">

                            <p>
                                Delivery:{" "}
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.state}
                            </p>

                            <p className="mt-1">
                                Payment:{" "}
                                {order.paymentStatus}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Orders;