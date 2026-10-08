
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createProduct,
    getProductCategories
} from "../../services/product.api";
import { getMyFarmerProfile } from "../../services/farmer.api";

const AddProduct = () => {
    const navigate = useNavigate();

    const [farmerProfile, setFarmerProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState("");

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        costPrice: "",
        unit: "kg",
        quantity: "",
        farmingMethod: "conventional",
        location: "",
        harvestDate: ""
    });

    // Image files
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);

    // --------------------------------
    // GET FARMER PROFILE
    // --------------------------------
    useEffect(() => {
        let active = true;

        const loadPageData = async () => {
            const [profileResult, categoriesResult] = await Promise.allSettled([
                getMyFarmerProfile(),
                getProductCategories()
            ]);

            if (!active) {
                return;
            }

            if (profileResult.status === "fulfilled") {
                setFarmerProfile(profileResult.value.data.profile);
            } else {
                setProfileError(
                    profileResult.reason.response?.data?.message ||
                    "Unable to load farmer profile."
                );
            }

            if (categoriesResult.status === "fulfilled") {
                const { success, categories: loadedCategories } =
                    categoriesResult.value.data;

                if (success && Array.isArray(loadedCategories)) {
                    setCategories(loadedCategories);
                } else {
                    setCategoriesError(
                        categoriesResult.value.data.message ||
                        "Unable to load product categories."
                    );
                }
            } else {
                setCategoriesError(
                    categoriesResult.reason.response?.data?.message ||
                    "Unable to load product categories."
                );
            }

            setProfileLoading(false);
        };

        loadPageData().catch((error) => {
            if (active) {
                setProfileError(
                    error.message || "Unable to load product form."
                );
                setProfileLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, []);

    // --------------------------------
    // FORM INPUT CHANGE
    // --------------------------------
    const update = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // --------------------------------
    // IMAGE SELECT
    // --------------------------------
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Maximum 5 images
        if (selectedFiles.length > 5) {
            alert("You can upload maximum 5 images.");
            return;
        }

        // Maximum 15MB per image
        const invalidFile = selectedFiles.find(
            (file) => file.size > 15 * 1024 * 1024
        );

        if (invalidFile) {
            alert(
                `${invalidFile.name} is larger than 10MB.`
            );
            return;
        }

        // Only images
        const invalidType = selectedFiles.find(
            (file) => !file.type.startsWith("image/")
        );

        if (invalidType) {
            alert("Only image files are allowed.");
            return;
        }

        setImages(selectedFiles);
    };

    // --------------------------------
    // SUBMIT PRODUCT
    // --------------------------------
    const submit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Create FormData
            const data = new FormData();

            data.append("name", form.name);
            data.append("category", form.category);
            data.append("description", form.description);
            data.append("price", Number(form.price));
            data.append("costPrice", Number(form.costPrice));
            data.append("unit", form.unit);
            data.append("quantity", Number(form.quantity));
            data.append(
                "farmingMethod",
                form.farmingMethod
            );
            data.append("location", form.location);

            if (form.harvestDate) {
                data.append(
                    "harvestDate",
                    form.harvestDate
                );
            }

            // Add images
            images.forEach((image) => {
                data.append("images", image);
            });

            const response = await createProduct(data);

            if (response.data.success) {
                alert("Product created successfully.");

                navigate("/farmer/products");
            }

        } catch (error) {
            console.error(
                "Create product error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create product."
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // PROFILE LOADING
    // --------------------------------
    if (profileLoading) {
        return (
            <div className="p-10 text-center">
                Checking farmer profile...
            </div>
        );
    }

    // --------------------------------
    // PROFILE ERROR
    // --------------------------------
    if (profileError || !farmerProfile) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                <p
                    role="alert"
                    className="mb-4 text-red-700"
                >
                    {profileError ||
                        "Create your farmer profile before listing products."}
                </p>

                <Link
                    to="/farmer/profile"
                    className="text-green-700 underline"
                >
                    Open farmer profile
                </Link>

            </div>
        );
    }

    // --------------------------------
    // FARMER APPROVAL CHECK
    // --------------------------------
    if (
        farmerProfile.verificationStatus !==
        "approved"
    ) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                <h1 className="text-2xl font-bold">
                    Product listings unavailable
                </h1>

                <p className="mt-3 text-gray-600">
                    Your farmer profile is{" "}
                    {farmerProfile.verificationStatus}.
                    Product listings are available after
                    admin approval.
                </p>

                {farmerProfile.rejectionReason && (
                    <p className="mt-2 text-red-700">
                        {farmerProfile.rejectionReason}
                    </p>
                )}

                <Link
                    to="/farmer/profile"
                    className="inline-block mt-4 text-green-700 underline"
                >
                    View farmer profile
                </Link>

            </div>
        );
    }

    // --------------------------------
    // MAIN FORM
    // --------------------------------
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Add Product
                </h1>

                <p className="text-gray-500 mt-2">
                    List your agricultural product.
                </p>

            </div>

            <form
                onSubmit={submit}
                className="bg-white border rounded-2xl p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >

                {/* PRODUCT NAME */}
                <div className="sm:col-span-2">

                    <label className="block font-medium mb-2">
                        Product Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={update}
                        required
                        placeholder="Fresh Tomato"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                </div>

                {/* CATEGORY */}
                <div>

                    <label className="block font-medium mb-2">
                        Category
                    </label>

                    <select
                        name="category"
                        value={form.category}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {categoriesError ? (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                            {categoriesError}
                        </p>
                    ) : categories.length === 0 ? (
                        <p className="mt-1 text-sm text-gray-500">
                            No categories are available yet. Please contact an administrator.
                        </p>
                    ) : null}

                </div>

                {/* PRICE */}
                <div>

                    <label className="block font-medium mb-2">
                        Price
                    </label>

                    <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={update}
                        required
                        placeholder="50"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                </div>

                {/* COST PER UNIT */}
                <div>

                    <label className="block font-medium mb-2">
                        Cost per Unit
                    </label>

                    <input
                        name="costPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.costPrice}
                        onChange={update}
                        required
                        placeholder="30"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                        Your production cost for the selected unit.
                    </p>

                </div>

                {/* UNIT */}
                <div>

                    <label className="block font-medium mb-2">
                        Unit
                    </label>

                    <select
                        name="unit"
                        value={form.unit}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                    >
                        <option value="kg">
                            Kg
                        </option>

                        <option value="gram">
                            Gram
                        </option>

                        <option value="litre">
                            Litre
                        </option>

                        <option value="ml">
                            ML
                        </option>

                        <option value="piece">
                            Piece
                        </option>

                        <option value="dozen">
                            Dozen
                        </option>

                        <option value="quintal">
                            Quintal
                        </option>
                    </select>

                </div>

                {/* QUANTITY */}
                <div>

                    <label className="block font-medium mb-2">
                        Available Quantity
                    </label>

                    <input
                        name="quantity"
                        type="number"
                        min="0"
                        value={form.quantity}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                </div>

                {/* FARMING METHOD */}
                <div>

                    <label className="block font-medium mb-2">
                        Farming Method
                    </label>

                    <select
                        name="farmingMethod"
                        value={form.farmingMethod}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                    >

                        <option value="organic">
                            Organic
                        </option>

                        <option value="conventional">
                            Conventional
                        </option>

                        <option value="mixed">
                            Mixed
                        </option>

                    </select>

                </div>

                {/* HARVEST DATE */}
                <div>

                    <label className="block font-medium mb-2">
                        Harvest Date
                    </label>

                    <input
                        name="harvestDate"
                        type="date"
                        value={form.harvestDate}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                </div>

                {/* LOCATION */}
                <div className="sm:col-span-2">

                    <label className="block font-medium mb-2">
                        Product Location
                    </label>

                    <input
                        name="location"
                        value={form.location}
                        onChange={update}
                        placeholder="Indore, Madhya Pradesh"
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                </div>

                {/* IMAGE UPLOAD */}
                <div className="sm:col-span-2">

                    <label className="block font-medium mb-2">
                        Product Images
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                        Upload maximum 5 images. Maximum 5MB
                        per image.
                    </p>

                    {/* SELECTED FILES */}
                    {images.length > 0 && (
                        <div className="mt-3 space-y-2">

                            {images.map(
                                (image, index) => (
                                    <div
                                        key={`${image.name}-${index}`}
                                        className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2"
                                    >

                                        <span className="text-sm text-gray-700 truncate">
                                            {index + 1}.{" "}
                                            {image.name}
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            {(
                                                image.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </span>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* DESCRIPTION */}
                <div className="sm:col-span-2">

                    <label className="block font-medium mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={update}
                        rows="5"
                        required
                        placeholder="Describe your product..."
                        className="w-full px-4 py-3 border rounded-xl resize-none"
                    />

                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="sm:col-span-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                >

                    {loading
                        ? "Uploading & Creating Product..."
                        : "Create Product"}

                </button>

            </form>

        </div>
    );
};

export default AddProduct;
