import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {

    const imageUrl = product.images?.[0];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition">

            {/* IMAGE */}
            <div className="h-48 bg-gray-100">

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling.style.display = "flex";
                        }}
                    />
                ) : null}

                <div
                    className={`w-full h-full items-center justify-center text-gray-400 ${
                        imageUrl ? "hidden" : "flex"
                    }`}
                >
                    No Image
                </div>

            </div>

            {/* CONTENT */}
            <div className="p-4">

                <p className="text-sm text-green-600 font-medium capitalize">
                    {product.farmingMethod || "Farming"}
                </p>

                <h3 className="font-semibold text-lg mt-1 line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                    {product.location || "Local Farm"}
                </p>

                <div className="flex items-center justify-between mt-4">

                    <div>
                        <span className="font-bold text-xl text-gray-900">
                            ₹{product.price}
                        </span>

                        <span className="text-sm text-gray-500">
                            /{product.unit}
                        </span>
                    </div>

                </div>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-4">

                    <Link
                        to={`/products/${product._id}`}
                        className="flex-1 text-center py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50"
                    >
                        View
                    </Link>

                    {onAddToCart && (
                        <button
                            type="button"
                            onClick={() => onAddToCart(product._id)}
                            className="px-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ProductCard;