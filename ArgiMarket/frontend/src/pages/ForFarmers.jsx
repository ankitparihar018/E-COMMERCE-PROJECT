import { Link } from "react-router-dom";
import {
    ArrowRight,
    ChartNoAxesCombined,
    MessageCircle,
    Package,
    ShoppingBag,
    Sprout
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const benefits = [
    {
        icon: Package,
        title: "Showcase your produce",
        text: "Create product listings with clear pricing, quantities, harvest details, and photos."
    },
    {
        icon: ShoppingBag,
        title: "Manage orders in one place",
        text: "Review incoming orders and keep buyers up to date as you prepare and deliver them."
    },
    {
        icon: MessageCircle,
        title: "Build direct relationships",
        text: "Answer buyer questions and have direct conversations about your farm and products."
    },
    {
        icon: ChartNoAxesCombined,
        title: "Track your business",
        text: "Use your farmer dashboard to review sales and estimated profit from delivered orders."
    }
];

const steps = [
    {
        number: "01",
        title: "Create your farmer account",
        text: "Register with your contact details and select Farmer as your account type."
    },
    {
        number: "02",
        title: "Set up your farm profile",
        text: "Add your farm location and details so buyers can learn about your operation."
    },
    {
        number: "03",
        title: "List products and connect",
        text: "After profile approval, add your produce, manage orders, and answer buyer messages."
    }
];

const ForFarmers = () => {
    const { user } = useAuth();
    const isFarmer = user?.role === "farmer";
    const primaryLink = isFarmer ? "/farmer/dashboard" : "/register?role=farmer";
    const primaryLabel = isFarmer ? "Open farmer dashboard" : "Join as a farmer";

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-600 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
                <div className="absolute -right-8 -top-10 hidden h-64 w-64 rounded-full border-[28px] border-white/10 lg:block" />
                <div className="relative max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-green-50">
                        <Sprout size={17} />
                        Made for local growers
                    </span>
                    <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                        Grow your farm business with AgriMarket
                    </h1>
                    <p className="mt-5 max-w-2xl text-lg leading-7 text-green-50">
                        Bring your products online, manage marketplace orders, and connect directly with people looking for fresh local food.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={primaryLink}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-900 hover:bg-green-50"
                        >
                            {primaryLabel}
                            <ArrowRight size={17} />
                        </Link>
                        <Link
                            to="/farmers"
                            className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
                        >
                            Explore local farms
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-14 sm:py-16">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                        Your farm, your marketplace
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">
                        Tools to help you sell and grow
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Everything you need to manage your presence on the marketplace and stay connected with buyers.
                    </p>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <article
                                key={benefit.title}
                                className="rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                    <Icon size={23} />
                                </div>
                                <h3 className="mt-5 font-semibold">
                                    {benefit.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {benefit.text}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-3xl bg-gray-50 p-6 sm:p-9">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                        Get started
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">
                        Three steps to your farm storefront
                    </h2>
                </div>
                <div className="mt-7 grid gap-5 md:grid-cols-3">
                    {steps.map((step) => (
                        <article
                            key={step.number}
                            className="rounded-2xl border bg-white p-6"
                        >
                            <span className="text-sm font-bold text-green-700">
                                {step.number}
                            </span>
                            <h3 className="mt-3 font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                {step.text}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mt-10 flex flex-col gap-5 rounded-2xl border border-green-100 bg-green-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <h2 className="text-xl font-bold">
                        Ready to bring your farm online?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your farmer account and start setting up your profile.
                    </p>
                </div>
                <Link
                    to={primaryLink}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                >
                    {primaryLabel}
                    <ArrowRight size={17} />
                </Link>
            </section>
        </div>
    );
};

export default ForFarmers;
