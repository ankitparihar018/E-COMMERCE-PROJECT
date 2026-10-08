import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getMyProducts,
    deleteProduct,
    updateProduct
} from "../../services/product.api";

const MyProducts = () => {

    const [products, setProducts] = useState([]);
    const [costPrices, setCostPrices] = useState({});
    const [savingCostFor, setSavingCostFor] = useState("");

    const load = async () => {

        try {

            const response = await getMyProducts();

            if (response.data.success) {
                setProducts(response.data.products);
                setCostPrices(
                    Object.fromEntries(
                        response.data.products.map((product) => [
                            product._id,
                            product.costPrice ?? ""
                        ])
                    )
                );
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {

        if (!confirm("Delete this product?")) return;

        await deleteProduct(id);

        load();
    };

    const saveCostPrice = async (product) => {
        const costPrice = Number(costPrices[product._id]);

        if (
            costPrices[product._id] === "" ||
            !Number.isFinite(costPrice) ||
            costPrice < 0
        ) {
            alert("Enter a valid non-negative cost per unit.");
            return;
        }

        try {
            setSavingCostFor(product._id);
            const response = await updateProduct(product._id, { costPrice });

            if (response.data.success) {
                setProducts((currentProducts) =>
                    currentProducts.map((currentProduct) =>
                        currentProduct._id === product._id
                            ? response.data.product
                            : currentProduct
                    )
                );
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update product cost."
            );
        } finally {
            setSavingCostFor("");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        My Products
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your listings
                    </p>
                </div>

                <Link
                    to="/farmer/products/add"
                    className="px-5 py-3 rounded-xl bg-green-600 text-white"
                >
                    + Add Product
                </Link>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                {products.map((product) => (

                    <div
                        key={product._id}
                        className="bg-white border rounded-2xl overflow-hidden"
                    >

                        <div className="h-48 bg-gray-100">

                            {product.images?.[0] && (
                                <img
                                    src={product.images[0]}
                                    className="w-full h-full object-cover"
                                />
                            )}

                        </div>

                        <div className="p-5">

                            <h2 className="font-semibold text-lg">
                                {product.name}
                            </h2>

                            <p className="mt-2">
                                ₹{product.price}/{product.unit}
                            </p>

                            <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                <label
                                    htmlFor={`cost-${product._id}`}
                                    className="block text-sm font-medium mb-2"
                                >
                                    Cost per {product.unit} (₹)
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        id={`cost-${product._id}`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={costPrices[product._id] ?? ""}
                                        onChange={(event) =>
                                            setCostPrices((current) => ({
                                                ...current,
                                                [product._id]: event.target.value
                                            }))
                                        }
                                        className="min-w-0 flex-1 px-3 py-2 border rounded-lg"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => saveCostPrice(product)}
                                        disabled={savingCostFor === product._id}
                                        className="px-3 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
                                    >
                                        {savingCostFor === product._id ? "Saving..." : "Save"}
                                    </button>
                                </div>

                                {product.costPrice != null && (
                                    <p className="text-sm mt-2 text-gray-600">
                                        Margin:{" "}
                                        {product.price > 0
                                            ? `${(((product.price - product.costPrice) / product.price) * 100).toFixed(1)}%`
                                            : "N/A"}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-5">

                                <Link
                                    to={`/farmer/products/edit/${product._id}`}
                                    className="flex-1 text-center py-2 border rounded-lg"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => remove(product._id)}
                                    className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MyProducts;