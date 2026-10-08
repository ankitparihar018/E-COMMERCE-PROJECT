import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart } from "../../services/cart.api";
import { createOrder } from "../../services/order.api";
import { payForOrder } from "../../services/payment.api";
import Loader from "../../components/Loader";

const Checkout = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        contact: "",
        date: "",
        timeSlot: "morning"
    });

    const loadCart = async () => {
        try {
            const response = await getCart();

            if (response.data.success) {
                setCart(response.data.cart);
            }
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                "Failed to load cart"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cartItems = cart?.items?.filter((item) => item.product) || [];

        if (!cartItems.length) {
            alert("Your cart is empty.");
            return;
        }

        let orderId;

        try {
            setSubmitting(true);

            const response = await createOrder({
                shippingAddress: {
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                    contact: form.contact
                },
                deliverySlot: {
                    date: form.date,
                    timeSlot: form.timeSlot
                }
            });

            if (!response.data.success || !response.data.order?._id) {
                throw new Error(response.data.message || "Failed to create order.");
            }

            orderId = response.data.order._id;
            await payForOrder(orderId);
            alert("Payment successful! Your order is confirmed.");
            navigate("/orders");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to place order."
            );

            if (orderId) {
                navigate("/orders");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!cart?.items?.length) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">
                        Your cart is empty
                    </h2>

                    <button
                        onClick={() => navigate("/products")}
                        className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <h1 className="text-3xl sm:text-4xl font-bold">
                Checkout
            </h1>

            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                {/* Address */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-2xl p-6 shadow-sm"
                >
                    <h2 className="text-xl font-bold mb-6">
                        Delivery Address
                    </h2>

                    <div className="space-y-4">

                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Full Address"
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="State"
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <input
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            placeholder="Pincode"
                            maxLength="6"
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <input
                            name="contact"
                            value={form.contact}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            maxLength="10"
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        <select
                            name="timeSlot"
                            value={form.timeSlot}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3"
                        >
                            <option value="morning">
                                Morning
                            </option>

                            <option value="afternoon">
                                Afternoon
                            </option>

                            <option value="evening">
                                Evening
                            </option>
                        </select>

                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                    >
                        {submitting
                            ? "Processing Payment..."
                            : "Place Order & Pay"}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">

                    <h2 className="text-xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-4">

                        {cartItems.map((item) => (
                            <div
                                key={item.product._id}
                                className="flex justify-between gap-4 border-b pb-4"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {item.product.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {item.quantity} × ₹
                                        {item.product.price}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    ₹
                                    {(
                                        item.product.price *
                                        item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))}

                    </div>

                    <div className="flex justify-between mt-6 text-xl font-bold">
                        <span>Total</span>

                        <span className="text-green-600">
                            ₹{total.toFixed(2)}
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Checkout;