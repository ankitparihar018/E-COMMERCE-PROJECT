import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { handleLogin } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const result = await handleLogin(form);

            if (!result.success) {
                setError(result.message);
                return;
            }

            if (result.user.role === "farmer") {
                navigate("/farmer/dashboard");
            } else if (result.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-6 sm:p-8">

                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Login to AgriMarket
                </p>

                {error && (
                    <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="mt-6 space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value
                            })
                        }
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-green-600 font-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;