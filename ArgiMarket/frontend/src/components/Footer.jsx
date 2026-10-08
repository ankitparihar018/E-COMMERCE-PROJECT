import { Link } from "react-router-dom";
import {
    ArrowRight,
    Leaf,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Sprout
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const categories = [
    "Fresh Vegetables",
    "Fruits",
    "Dairy Products",
    "Organic Products",
    "Grains & Pulses"
];
const currentYear = new Date().getFullYear();

const Footer = () => {
    const { user } = useAuth();

    const farmerLinks = user?.role === "farmer"
        ? [
            { label: "Farmer dashboard", to: "/farmer/dashboard" },
            { label: "Manage products", to: "/farmer/products" },
            { label: "Manage orders", to: "/farmer/orders" },
            { label: "Buyer requests", to: "/farmer/support" }
        ]
        : [
            { label: "Why sell with us?", to: "/for-farmers" },
            { label: "Explore local farms", to: "/farmers" },
            { label: "Create a farmer account", to: "/for-farmers" }
        ];

    const contactLinks = user?.role === "consumer"
        ? [
            { label: "Buyer Help Center", to: "/help" },
            { label: "Message a farmer", to: "/chats" },
            { label: "Browse farmers", to: "/farmers" }
        ]
        : user?.role === "farmer"
            ? [
                { label: "Buyer messages", to: "/chats" },
                { label: "Buyer help requests", to: "/farmer/support" },
                { label: "Browse farmers", to: "/farmers" }
            ]
            : [
                { label: "Browse farmers", to: "/farmers" },
                { label: "Sign in for buyer help", to: "/login" },
                { label: "Contact options", to: "/contact" }
            ];

    return (
        <footer className="mt-16 border-t border-green-900/20 bg-gray-950 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <section>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-2xl font-bold text-white"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                                <Leaf size={22} />
                            </span>
                            Agri<span className="text-green-400">Market</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                            A direct connection between local farms and the people who value fresh, responsibly grown food.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 px-3 py-1.5 text-xs">
                                <ShieldCheck size={14} className="text-green-400" />
                                Verified farms
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 px-3 py-1.5 text-xs">
                                <MapPin size={14} className="text-green-400" />
                                Local produce
                            </span>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
                            >
                                Explore marketplace
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </section>

                    <nav aria-label="Marketplace links">
                        <h2 className="font-semibold text-white">Marketplace</h2>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Find fresh picks by category.
                        </p>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/products?category=${encodeURIComponent(category)}`}
                                        className="transition-colors hover:text-green-400"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-1 font-medium text-green-400 hover:text-green-300"
                                >
                                    View all products
                                    <ArrowRight size={14} />
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <nav aria-label="Farmer links">
                        <h2 className="inline-flex items-center gap-2 font-semibold text-white">
                            <Sprout size={18} className="text-green-400" />
                            {user?.role === "farmer" ? "Farmer tools" : "For Farmers"}
                        </h2>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            {user?.role === "farmer"
                                ? "Manage your farm and connect with buyers."
                                : "Grow your business and connect with buyers."}
                        </p>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {farmerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="transition-colors hover:text-green-400"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {user?.role !== "farmer" && (
                                <li className="pt-1">
                                    <Link
                                        to="/farmers"
                                        className="inline-flex items-center gap-1 font-medium text-green-400 hover:text-green-300"
                                    >
                                        Meet our farmers
                                        <ArrowRight size={14} />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    <nav aria-label="Contact links">
                        <h2 className="inline-flex items-center gap-2 font-semibold text-white">
                            <MessageCircle size={18} className="text-green-400" />
                            Contact
                        </h2>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Get help or start a conversation through the marketplace.
                        </p>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {contactLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="transition-colors hover:text-green-400"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-1 font-medium text-green-400 hover:text-green-300"
                                >
                                    All contact options
                                    <ArrowRight size={14} />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {currentYear} AgriMarket. Supporting local farms and fresh food.</p>
                    <Link to="/contact" className="hover:text-green-400">
                        Need help? Visit Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
