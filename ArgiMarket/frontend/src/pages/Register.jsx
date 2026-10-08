
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleRegister } = useAuth();

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        contact: "",
        password: "",
        role: searchParams.get("role") === "farmer" ? "farmer" : "consumer"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            // Backend ke expected format me data bhejo
            const registerData = {
                fullname: form.fullname,
                email: form.email,
                contact: form.contact,
                password: form.password,
                role: form.role
            };

            const result = await handleRegister(registerData);

            if (!result.success) {
                setError(result.message || "Registration failed");
                return;
            }

            // Farmer
            if (result.user.role === "farmer") {
                navigate("/farmer/dashboard");
            }

            // Consumer
            else {
                navigate("/");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-6 sm:p-8">

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Join AgriMarket
                </p>

                {error && (
                    <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >

                    {/* Full Name */}
                    <input
                        name="fullname"
                        placeholder="Full Name"
                        required
                        value={form.fullname}
                        onChange={update}
                        className="sm:col-span-2 w-full px-4 py-3 rounded-xl border"
                    />

                    {/* Email */}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={form.email}
                        onChange={update}
                        className="w-full px-4 py-3 rounded-xl border"
                    />

                    {/* Contact */}
                    <input
                        name="contact"
                        type="tel"
                        placeholder="Contact Number"
                        required
                        value={form.contact}
                        onChange={update}
                        maxLength="10"
                        className="w-full px-4 py-3 rounded-xl border"
                    />

                    {/* Password */}
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={form.password}
                        onChange={update}
                        minLength="6"
                        className="sm:col-span-2 w-full px-4 py-3 rounded-xl border"
                    />

                    {/* Role */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={update}
                        className="sm:col-span-2 w-full px-4 py-3 rounded-xl border"
                    >
                        <option value="consumer">
                            Consumer
                        </option>

                        <option value="farmer">
                            Farmer
                        </option>
                    </select>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="sm:col-span-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Creating..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-green-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Register;
