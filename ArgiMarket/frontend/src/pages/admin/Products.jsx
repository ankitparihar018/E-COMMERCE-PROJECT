import { useEffect, useState } from "react";

import {
    getProducts,
    deleteProduct
} from "../../services/admin.api";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {

        try {

            const response = await getProducts();

            if (response.data.success) {
                setProducts(response.data.products);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {

        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {

            await deleteProduct(id);

            load();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );

        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading products...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Manage Products
            </h1>

            <div className="overflow-x-auto bg-white border rounded-2xl mt-8">

                <table className="w-full min-w-[700px]">

                    <thead className="bg-gray-50">

                        <tr>
                            <th className="text-left p-4">
                                Product
                            </th>

                            <th className="text-left p-4">
                                Price
                            </th>

                            <th className="text-left p-4">
                                Quantity
                            </th>

                            <th className="text-left p-4">
                                Farming
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {products.map((product) => (

                            <tr
                                key={product._id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    <div className="flex items-center gap-3">

                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">

                                            {product.images?.[0] && (
                                                <img
                                                    src={product.images[0]}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                        </div>

                                        <span className="font-medium">
                                            {product.name}
                                        </span>

                                    </div>
                                </td>

                                <td className="p-4">
                                    ₹{product.price}
                                </td>

                                <td className="p-4">
                                    {product.quantity}
                                </td>

                                <td className="p-4 capitalize">
                                    {product.farmingMethod}
                                </td>

                                <td className="p-4">

                                    <button
                                        onClick={() =>
                                            remove(product._id)
                                        }
                                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Products;