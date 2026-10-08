import { Link } from "react-router-dom";
import {
    Leaf,
    Truck,
    ShieldCheck,
    Users,
    ShoppingBasket,
    MessageCircle,
    Sprout
} from "lucide-react";

const productCategories = [
    { name: "Fresh Vegetables", description: "Everyday greens and seasonal picks", icon: "🥬" },
    { name: "Fruits", description: "Fresh fruits from local growers", icon: "🍎" },
    { name: "Dairy Products", description: "Farm-sourced dairy essentials", icon: "🥛" },
    { name: "Organic Products", description: "Explore organic farm listings", icon: "🌱" },
    { name: "Grains & Pulses", description: "Staples grown by local farmers", icon: "🌾" }
];

const Home = () => {

    return (
        <div>

            {/* Hero */}

            <section className="bg-green-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div>

                            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                Farm Fresh • Direct From Farmers
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-5">
                                Fresh Food,
                                <span className="text-green-600">
                                    {" "}Straight From The Farm
                                </span>
                            </h1>

                            <p className="text-gray-600 text-lg mt-6 max-w-xl">
                                Buy fresh vegetables, fruits, dairy and
                                organic products directly from local farmers.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-8">

                                <Link
                                    to="/products"
                                    className="text-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
                                >
                                    Explore Products
                                </Link>

                                <Link
                                    to="/for-farmers"
                                    className="text-center px-6 py-3 rounded-xl border border-green-600 text-green-700 font-semibold hover:bg-green-100"
                                >
                                    Become a Farmer
                                </Link>

                            </div>

                        </div>

                        <div className="hidden lg:flex justify-center">

                            <div className="w-full max-w-md aspect-square rounded-[3rem] bg-green-200 flex items-center justify-center">

                                <Leaf
                                    size={180}
                                    strokeWidth={1}
                                    className="text-green-700"
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                Shop your way
                            </p>
                            <h2 className="mt-2 text-3xl font-bold">
                                Explore fresh categories
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Browse a category to find what local farms have available.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-900"
                        >
                            View marketplace
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {productCategories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="group rounded-2xl border bg-white p-5 transition-all hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
                            >
                                <span className="text-3xl" aria-hidden="true">
                                    {category.icon}
                                </span>
                                <h3 className="mt-4 font-semibold group-hover:text-green-700">
                                    {category.name}
                                </h3>
                                <p className="mt-1 text-sm leading-5 text-gray-500">
                                    {category.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}

            <section className="py-16">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center">
                        <h2 className="text-3xl font-bold">
                            Why Choose AgriMarket?
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Better for farmers, better for consumers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                        {[
                            {
                                icon: Users,
                                title: "Direct From Farmers",
                                text: "Connect directly with local farmers."
                            },
                            {
                                icon: Leaf,
                                title: "Fresh Products",
                                text: "Fresh and quality agricultural products."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Trusted Farmers",
                                text: "Verified farmers and transparent listings."
                            },
                            {
                                icon: Truck,
                                title: "Easy Delivery",
                                text: "Convenient delivery and order tracking."
                            }
                        ].map((item) => {

                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border rounded-2xl p-6 text-center"
                                >
                                    <div className="w-14 h-14 mx-auto rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                        <Icon />
                                    </div>

                                    <h3 className="font-semibold text-lg mt-4">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        {item.text}
                                    </p>
                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                            Simple and direct
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">
                            From local farm to your table
                        </h2>
                    </div>

                    <div className="mt-9 grid gap-5 md:grid-cols-3">
                        {[
                            {
                                icon: ShoppingBasket,
                                title: "Explore local produce",
                                text: "Find available products and learn about the farms behind them.",
                                link: "/products",
                                label: "Shop products"
                            },
                            {
                                icon: MessageCircle,
                                title: "Connect with farmers",
                                text: "Visit a farmer profile and start a conversation about their products.",
                                link: "/farmers",
                                label: "Meet farmers"
                            },
                            {
                                icon: Sprout,
                                title: "Grow with AgriMarket",
                                text: "Farmers can list products, manage orders, and connect with buyers.",
                                link: "/for-farmers",
                                label: "Join as a farmer"
                            }
                        ].map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <article
                                    key={step.title}
                                    className="rounded-2xl border bg-white p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-green-700">
                                            0{index + 1}
                                        </span>
                                        <Icon className="text-green-700" size={25} />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                                        {step.text}
                                    </p>
                                    <Link
                                        to={step.link}
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
                                    >
                                        {step.label}
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-5 rounded-3xl bg-green-800 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Have a question or need a hand?
                        </h2>
                        <p className="mt-2 text-green-100">
                            Find contact options for buyers, farmers, and marketplace support.
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-green-800 hover:bg-green-50"
                    >
                        Visit Contact
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;