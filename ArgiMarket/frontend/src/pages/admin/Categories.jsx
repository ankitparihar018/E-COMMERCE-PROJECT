import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    deleteCategory
} from "../../services/admin.api";

const Categories = () => {

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {

        try {

            const response = await getCategories();

            if (response.data.success) {
                setCategories(response.data.categories);
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const submit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createCategory(form);

            setForm({
                name: "",
                description: ""
            });

            loadCategories();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create category."
            );

        } finally {

            setLoading(false);

        }
    };

    const remove = async (id) => {

        if (!window.confirm("Delete category?")) {
            return;
        }

        try {

            await deleteCategory(id);

            loadCategories();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete category."
            );

        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Categories
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                <form
                    onSubmit={submit}
                    className="bg-white border rounded-2xl p-6 h-fit"
                >

                    <h2 className="text-xl font-semibold">
                        Add Category
                    </h2>

                    <input
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        placeholder="Category name"
                        required
                        className="w-full mt-5 px-4 py-3 border rounded-xl"
                    />

                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value
                            })
                        }
                        placeholder="Description"
                        rows="4"
                        className="w-full mt-4 px-4 py-3 border rounded-xl resize-none"
                    />

                    <button
                        disabled={loading}
                        className="w-full mt-4 py-3 rounded-xl bg-green-600 text-white font-semibold"
                    >
                        {loading
                            ? "Adding..."
                            : "Add Category"}
                    </button>

                </form>

                <div className="lg:col-span-2">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {categories.map((category) => (

                            <div
                                key={category._id}
                                className="bg-white border rounded-2xl p-5"
                            >

                                <div className="flex justify-between gap-3">

                                    <h3 className="font-semibold text-lg">
                                        {category.name}
                                    </h3>

                                    <button
                                        onClick={() =>
                                            remove(category._id)
                                        }
                                        className="text-red-500 text-sm"
                                    >
                                        Delete
                                    </button>

                                </div>

                                <p className="text-gray-500 text-sm mt-3">
                                    {category.description}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Categories;