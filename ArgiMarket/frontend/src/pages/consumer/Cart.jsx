import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getCart,
    updateCartItem,
    removeFromCart
} from "../../services/cart.api";

const Cart = () => {

    const [cart, setCart] = useState(null);

    const loadCart = async () => {

        try {

            const response = await getCart();

            if (response.data.success) {
                setCart(response.data.cart);
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const update = async (id, quantity) => {

        if (quantity < 1) return;

        await updateCartItem(id, quantity);

        loadCart();
    };

    const remove = async (id) => {

        await removeFromCart(id);

        loadCart();
    };

    const cartItems = cart?.items?.filter((item) => item.product) || [];

    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Shopping Cart
            </h1>

            {!cartItems.length ? (

                <div className="text-center py-20">

                    <p className="text-gray-500">
                        Your cart is empty.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block mt-5 px-5 py-3 bg-green-600 text-white rounded-xl"
                    >
                        Browse Products
                    </Link>

                </div>

            ) : (

                <>

                    <div className="space-y-4 mt-8">

                        {cartItems.map((item) => (

                            <div
                                key={item.product._id}
                                className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
                            >

                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">

                                    {item.product.images?.[0] && (
                                        <img
                                            src={item.product.images[0]}
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                </div>

                                <div className="flex-1">

                                    <h2 className="font-semibold">
                                        {item.product.name}
                                    </h2>

                                    <p className="text-gray-500">
                                        ₹{item.product.price}
                                    </p>

                                </div>

                                <div className="flex items-center gap-3">

                                    <button
                                        onClick={() =>
                                            update(
                                                item.product._id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="w-8 h-8 rounded-lg border"
                                    >
                                        -
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            update(
                                                item.product._id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="w-8 h-8 rounded-lg border"
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    onClick={() =>
                                        remove(item.product._id)
                                    }
                                    className="text-red-500"
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>

                    <div className="mt-8 bg-white border rounded-2xl p-6">

                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <Link
                            to="/checkout"
                            className="block text-center mt-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                        >
                            Proceed to Checkout
                        </Link>

                    </div>

                </>

            )}

        </div>
    );
};

export default Cart;