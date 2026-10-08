import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    MapPin,
    ShoppingCart,
    Leaf,
    User
} from "lucide-react";

import { getProduct } from "../../services/product.api";
import { addToCart } from "../../services/cart.api";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await getProduct(id);

                if (response.data.success) {
                    setProduct(response.data.product);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            alert("Please login to add products to cart.");
            return;
        }

        if (user.role !== "consumer") {
            alert("Only consumers can add products to cart.");
            return;
        }

        try {
            setAdding(true);

            await addToCart({
                productId: product._id,
                quantity
            });

            alert("Product added to cart successfully.");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to add product to cart."
            );
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Product not found
                    </h1>

                    <Link
                        to="/products"
                        className="inline-block mt-5 px-5 py-3 bg-green-600 text-white rounded-xl"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

                {/* Images */}

                <div>

                    <div className="h-[300px] sm:h-[420px] lg:h-[500px] bg-gray-100 rounded-3xl overflow-hidden">

                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}

                    </div>

                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">

                            {product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="h-20 rounded-xl overflow-hidden bg-gray-100"
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name}-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}

                        </div>
                    )}

                </div>

                {/* Product Information */}

                <div>

                    <div className="flex items-center justify-between gap-3">

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                            {product.farmingMethod}
                        </span>

                        {product.isAvailable ? (
                            <span className="text-sm text-green-600">
                                In Stock
                            </span>
                        ) : (
                            <span className="text-sm text-red-500">
                                Out of Stock
                            </span>
                        )}

                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-5">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 mt-4 leading-7">
                        {product.description}
                    </p>

                    <div className="mt-6">
                        <span className="text-3xl font-bold text-green-700">
                            ₹{product.price}
                        </span>

                        <span className="text-gray-500 ml-2">
                            / {product.unit}
                        </span>
                    </div>

                    <div className="border-t border-b py-5 my-6 space-y-4">

                        <div className="flex gap-3">
                            <MapPin className="text-green-600" size={20} />

                            <div>
                                <p className="font-medium">
                                    Location
                                </p>

                                <p className="text-gray-500 text-sm">
                                    {product.location || "Local Farm"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Leaf className="text-green-600" size={20} />

                            <div>
                                <p className="font-medium">
                                    Farming Method
                                </p>

                                <p className="text-gray-500 text-sm capitalize">
                                    {product.farmingMethod}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Quantity */}

                    <div>

                        <label className="block font-medium mb-2">
                            Quantity
                        </label>

                        <div className="flex items-center gap-4">

                            <button
                                onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                                className="w-10 h-10 border rounded-lg"
                            >
                                -
                            </button>

                            <span className="font-semibold text-lg">
                                {quantity}
                            </span>

                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.min(
                                            product.quantity,
                                            quantity + 1
                                        )
                                    )
                                }
                                className="w-10 h-10 border rounded-lg"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={
                            !product.isAvailable ||
                            adding
                        }
                        className="w-full mt-7 py-4 rounded-xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
                    >
                        <ShoppingCart size={20} />

                        {adding
                            ? "Adding..."
                            : "Add to Cart"}
                    </button>

                    {/* Farmer */}

                    <div className="mt-8 bg-green-50 rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-green-200 flex items-center justify-center text-green-700">
                                <User size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Sold by
                                </p>

                                <p className="font-semibold">
                                    Local Farmer
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;