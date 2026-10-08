import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";

import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import Loader from "../../components/Loader";

import {
    getProductCategories,
    getProducts
} from "../../services/product.api";
import { addToCart } from "../../services/cart.api";

import { useAuth } from "../../context/AuthContext";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [farmingMethod, setFarmingMethod] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const { user } = useAuth();
    const category = searchParams.get("category") || "";

    useEffect(() => {
        let active = true;

        getProductCategories()
            .then((response) => {
                if (active && response.data.success) {
                    setCategories(response.data.categories || []);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setCategoryError(
                        requestError.response?.data?.message ||
                        "Product categories are temporarily unavailable."
                    );
                }
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        const timer = window.setTimeout(async () => {
            setLoading(true);

            try {
                const response = await getProducts({
                    search,
                    category,
                    farmingMethod
                });

                if (active && response.data.success) {
                    setProducts(response.data.products || []);
                    setError("");
                }
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                        "Unable to load marketplace products."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [search, category, farmingMethod]);

    const sortedProducts = useMemo(() => {
        const result = [...products];

        if (sortOrder === "price-low") {
            result.sort((first, second) => first.price - second.price);
        } else if (sortOrder === "price-high") {
            result.sort((first, second) => second.price - first.price);
        }

        return result;
    }, [products, sortOrder]);

    const setCategory = (value) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) {
            nextParams.set("category", value);
        } else {
            nextParams.delete("category");
        }
        setSearchParams(nextParams);
    };

    const clearFilters = () => {
        setSearch("");
        setFarmingMethod("");
        setSortOrder("newest");
        setSearchParams({});
    };

    const handleAdd = async (productId) => {
        if (!user) {
            alert("Please login as a consumer.");
            return;
        }

        if (user.role !== "consumer") {
            alert("Only consumers can add products to cart.");
            return;
        }

        try {
            await addToCart({
                productId,
                quantity: 1
            });

            alert("Product added to cart successfully.");
        } catch (requestError) {
            alert(
                requestError.response?.data?.message ||
                "Unable to add product to cart."
            );
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="rounded-3xl bg-gradient-to-br from-green-50 via-white to-lime-50 p-6 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                    Farm fresh · Direct from local growers
                </p>
                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Explore the Marketplace
                </h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                    Discover fresh produce, compare farming methods, and shop directly from trusted local farmers.
                </p>
                <div className="mt-6 max-w-2xl">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search produce by name..."
                    />
                </div>
            </header>

            <section
                aria-label="Marketplace filters"
                className="mt-6 rounded-2xl border bg-white p-4 sm:p-5"
            >
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 font-semibold">
                        <SlidersHorizontal size={18} className="text-green-700" />
                        Refine products
                    </span>

                    <label className="sr-only" htmlFor="category-filter">
                        Category
                    </label>
                    <select
                        id="category-filter"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="min-w-44 rounded-lg border px-3 py-2.5"
                    >
                        <option value="">All categories</option>
                        {categories.map((item) => (
                            <option key={item._id} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <label className="sr-only" htmlFor="farming-method-filter">
                        Farming method
                    </label>
                    <select
                        id="farming-method-filter"
                        value={farmingMethod}
                        onChange={(event) => setFarmingMethod(event.target.value)}
                        className="min-w-44 rounded-lg border px-3 py-2.5"
                    >
                        <option value="">All farming methods</option>
                        <option value="organic">Organic</option>
                        <option value="conventional">Conventional</option>
                    </select>

                    <label className="sr-only" htmlFor="product-sort">
                        Sort products
                    </label>
                    <select
                        id="product-sort"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className="min-w-44 rounded-lg border px-3 py-2.5"
                    >
                        <option value="newest">Newest first</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="price-high">Price: high to low</option>
                    </select>

                    {(category || search || farmingMethod) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-900"
                        >
                            <Filter size={16} />
                            Clear filters
                        </button>
                    )}
                </div>
                {categoryError && (
                    <p role="status" className="mt-3 text-sm text-amber-700">
                        {categoryError}
                    </p>
                )}
            </section>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                    {category || "All fresh products"}
                </h2>
                {!loading && (
                    <p className="text-sm text-gray-500">
                        {sortedProducts.length}{" "}
                        {sortedProducts.length === 1 ? "product" : "products"} found
                    </p>
                )}
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
                >
                    {error}
                </div>
            ) : sortedProducts.length === 0 ? (
                <div className="mt-6 rounded-2xl border bg-white px-6 py-16 text-center">
                    <p className="text-lg font-semibold">No products match these filters.</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Try a different search or clear filters to explore all products.
                    </p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
                    >
                        Show all products
                    </button>
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sortedProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={handleAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
