import { Link } from "react-router-dom";
import {
    ArrowRight,
    HelpCircle,
    MessagesSquare,
    Sprout
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
    const { user } = useAuth();
    const actions = [];

    if (user?.role === "consumer") {
        actions.push({
            icon: HelpCircle,
            title: "Buyer Help Center",
            description: "Read answers to common questions or send a request to a farmer.",
            link: "/help",
            action: "Open help center"
        });
        actions.push({
            icon: MessagesSquare,
            title: "Your conversations",
            description: "Continue a real-time conversation with a farmer.",
            link: "/chats",
            action: "Open messages"
        });
    } else if (user?.role === "farmer") {
        actions.push({
            icon: MessagesSquare,
            title: "Buyer messages",
            description: "Reply to buyers who have messaged your farm.",
            link: "/chats",
            action: "Open messages"
        });
        actions.push({
            icon: HelpCircle,
            title: "Buyer help requests",
            description: "Review and manage support requests sent to your farm.",
            link: "/farmer/support",
            action: "View requests"
        });
    } else if (user?.role === "admin") {
        actions.push({
            icon: HelpCircle,
            title: "Support requests",
            description: "Review buyer support requests from the admin dashboard.",
            link: "/admin/support",
            action: "Open support inbox"
        });
    } else {
        actions.push({
            icon: HelpCircle,
            title: "Buyer help",
            description: "Sign in as a buyer to get help with orders and contact farmers.",
            link: "/login",
            action: "Sign in"
        });
        actions.push({
            icon: MessagesSquare,
            title: "Talk to a farmer",
            description: "Explore local farms and start a conversation after signing in.",
            link: "/farmers",
            action: "Browse farmers"
        });
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 to-green-600 px-6 py-12 text-white sm:px-10 lg:px-14">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-100">
                    AgriMarket · Contact
                </p>
                <h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">
                    The right conversation starts here.
                </h1>
                <p className="mt-4 max-w-2xl leading-7 text-green-50">
                    Connect with the people behind your produce, get help with a buyer request, or find the right place to manage your messages.
                </p>
                {!user && (
                    <Link
                        to="/register"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-800 hover:bg-green-50"
                    >
                        Join AgriMarket
                        <ArrowRight size={17} />
                    </Link>
                )}
            </section>

            <section className="mt-12">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold">How can we help?</h2>
                    <p className="mt-2 text-gray-600">
                        {user
                            ? `Choose an option for your ${user.role === "consumer" ? "shopping" : user.role === "farmer" ? "farm" : "marketplace"} account.`
                            : "Browse the marketplace, or sign in to access account-specific help and messaging."}
                    </p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <article
                                key={action.title}
                                className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                    <Icon size={23} />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold">
                                    {action.title}
                                </h3>
                                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                                    {action.description}
                                </p>
                                <Link
                                    to={action.link}
                                    className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
                                >
                                    {action.action}
                                    <ArrowRight size={16} />
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mt-10 flex flex-col gap-5 rounded-2xl border border-green-100 bg-green-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-700">
                        <Sprout size={23} />
                    </div>
                    <div>
                        <h2 className="font-semibold">Looking for a local farm?</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Browse approved farmer profiles and explore what they grow.
                        </p>
                    </div>
                </div>
                <Link
                    to="/farmers"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                >
                    Meet our farmers
                    <ArrowRight size={16} />
                </Link>
            </section>

        </div>
    );
};

export default Contact;
