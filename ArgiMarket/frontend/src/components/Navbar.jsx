import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    ShoppingCart,
    User,
    LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const [open, setOpen] = useState(false);

    const {
        user,
        handleLogout
    } = useAuth();

    const navigate = useNavigate();

    const logout = async () => {
        await handleLogout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="h-16 flex items-center justify-between">

                    {/* Logo */}

                    <Link
                        to="/"
                        className="text-xl sm:text-2xl font-bold text-green-700"
                    >
                        Agri<span className="text-green-500">Market</span>
                    </Link>

                    {/* Desktop Navigation */}

                    <nav className="hidden lg:flex items-center gap-4">

                        <Link
                            to="/"
                            className="text-gray-700 hover:text-green-600"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-green-600"
                        >
                            Marketplace
                        </Link>

                        <Link
                            to="/farmers"
                            className="text-gray-700 hover:text-green-600"
                        >
                            Farmers
                        </Link>

                        {user?.role !== "farmer" && (
                            <Link
                                to="/for-farmers"
                                className="text-gray-700 hover:text-green-600"
                            >
                                For Farmers
                            </Link>
                        )}

                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-green-600"
                        >
                            Contact
                        </Link>

                        {user?.role === "consumer" && (
                            <Link
                                to="/cart"
                                className="flex items-center gap-1 text-gray-700 hover:text-green-600"
                            >
                                <ShoppingCart size={19} />
                                Cart
                            </Link>
                        )}

                        {user?.role === "consumer" && (
                            <Link
                                to="/orders"
                                className="text-gray-700 hover:text-green-600"
                            >
                                My Orders
                            </Link>
                        )}

                        {user?.role === "consumer" && (
                            <Link
                                to="/help"
                                className="text-gray-700 hover:text-green-600"
                            >
                                Help Center
                            </Link>
                        )}

                        {(user?.role === "consumer" || user?.role === "farmer") && (
                            <Link
                                to="/chats"
                                className="text-gray-700 hover:text-green-600"
                            >
                                Messages
                            </Link>
                        )}

                        {user?.role === "farmer" && (
                            <Link
                                to="/farmer/dashboard"
                                className="text-gray-700 hover:text-green-600"
                            >
                                Farmer Dashboard
                            </Link>
                        )}

                        {user?.role === "farmer" && (
                            <Link
                                to="/farmer/support"
                                className="text-gray-700 hover:text-green-600"
                            >
                                Buyer Requests
                            </Link>
                        )}

                        {user?.role === "admin" && (
                            <Link
                                to="/admin/dashboard"
                                className="text-gray-700 hover:text-green-600"
                            >
                                Admin
                            </Link>
                        )}

                    </nav>

                    {/* Desktop Auth */}

                    <div className="hidden lg:flex items-center gap-3">

                        {user ? (

                            <>
                                <span className="text-sm text-gray-600">
                                    Hi, {user.fullname}
                                </span>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </>

                        ) : (

                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-green-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >
                                    Register
                                </Link>
                            </>

                        )}

                    </div>

                    {/* Mobile Menu Button */}

                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {open ? <X /> : <Menu />}
                    </button>

                </div>

                {/* Mobile Navigation */}

                {open && (

                    <div className="lg:hidden pb-5 border-t">

                        <nav className="flex flex-col gap-3 pt-4">

                            <Link
                                onClick={() => setOpen(false)}
                                to="/"
                                className="px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                Home
                            </Link>

                            <Link
                                onClick={() => setOpen(false)}
                                to="/products"
                                className="px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                Marketplace
                            </Link>

                            {user?.role !== "farmer" && (
                                <Link
                                    onClick={() => setOpen(false)}
                                    to="/for-farmers"
                                    className="px-3 py-2 rounded-lg hover:bg-green-50"
                                >
                                    For Farmers
                                </Link>
                            )}

                            <Link
                                onClick={() => setOpen(false)}
                                to="/contact"
                                className="px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                Contact
                            </Link>

                            <Link
                                onClick={() => setOpen(false)}
                                to="/farmers"
                                className="px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                Farmers
                            </Link>

                            {user?.role === "consumer" && (
                                <>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/cart"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Cart
                                    </Link>

                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/orders"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        My Orders
                                    </Link>

                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/help"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Help Center
                                    </Link>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/chats"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Messages
                                    </Link>
                                </>
                            )}

                            {user?.role === "farmer" && (
                                <>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/farmer/dashboard"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Farmer Dashboard
                                    </Link>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/farmer/support"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Buyer Requests
                                    </Link>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="/chats"
                                        className="px-3 py-2 rounded-lg hover:bg-green-50"
                                    >
                                        Messages
                                    </Link>
                                </>
                            )}

                            {user?.role === "admin" && (
                                <Link
                                    onClick={() => setOpen(false)}
                                    to="/admin/dashboard"
                                    className="px-3 py-2 rounded-lg hover:bg-green-50"
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            {user ? (

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-left text-red-600"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                            ) : (

                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-2"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </>

                            )}

                        </nav>

                    </div>

                )}

            </div>

        </header>
    );
};

export default Navbar;