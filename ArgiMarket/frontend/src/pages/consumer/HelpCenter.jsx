import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, CircleHelp, MessageSquareText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createSupportRequest } from "../../services/support.api";
import { getFarmers } from "../../services/farmer.api";

const faqs = [
    {
        question: "How do I place an order?",
        answer: "Add available products to your cart, continue to checkout, enter your delivery details, and complete payment."
    },
    {
        question: "Where can I check my order status?",
        answer: "Open My Orders from the navigation bar. Select an order to view its details and current status.",
        link: "/orders",
        linkText: "Go to My Orders"
    },
    {
        question: "A product in my cart is no longer available. What should I do?",
        answer: "Remove unavailable products from your cart and browse the marketplace for currently available items.",
        link: "/products",
        linkText: "Browse products"
    },
    {
        question: "What if my payment or order did not go through?",
        answer: "Check My Orders first to confirm whether the order was created. If you still need help, send us a request using the form below."
    },
    {
        question: "How do I get help with a specific issue?",
        answer: "Choose the farmer related to your question, select a category, and describe what happened. The farmer will receive your request."
    }
];

const HelpCenter = () => {
    const { user } = useAuth();
    const [farmers, setFarmers] = useState([]);
    const [farmersLoading, setFarmersLoading] = useState(true);
    const [farmersError, setFarmersError] = useState("");
    const [form, setForm] = useState({
        farmer: "",
        category: "order",
        subject: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [ticketId, setTicketId] = useState("");

    useEffect(() => {
        let active = true;

        getFarmers()
            .then((response) => {
                if (active && response.data.success) {
                    const approvedFarmers = response.data.farmers || [];
                    setFarmers(approvedFarmers);
                    setForm((current) => ({
                        ...current,
                        farmer: current.farmer || approvedFarmers[0]?.user?._id || ""
                    }));
                }
            })
            .catch((requestError) => {
                if (active) {
                    setFarmersError(
                        requestError.response?.data?.message ||
                        "Unable to load farmers. Please try again later."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setFarmersLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const handleChange = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value
        }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setTicketId("");
        setSubmitting(true);

        try {
            const response = await createSupportRequest(form);

            if (!response.data.success || !response.data.request?.id) {
                throw new Error(
                    response.data.message || "Unable to send your request."
                );
            }

            setTicketId(response.data.request.id);
            setForm({
                farmer: form.farmer,
                category: "order",
                subject: "",
                message: ""
            });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to send your request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="rounded-3xl bg-green-50 px-6 py-10 sm:px-10">
                <div className="flex items-center gap-3 text-green-700">
                    <CircleHelp size={30} />
                    <span className="font-semibold">AgriMarket Support</span>
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
                    Buyer Help Center
                </h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                    Find answers to common questions or send a request directly to a farmer.
                </p>
            </header>

            <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 mt-8">
                <section aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="text-2xl font-bold mb-4">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.question}
                                className="group rounded-xl border bg-white p-5"
                            >
                                <summary className="cursor-pointer font-semibold marker:text-green-600">
                                    {faq.question}
                                </summary>
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    {faq.answer}
                                </p>
                                {faq.link && (
                                    <Link
                                        to={faq.link}
                                        className="inline-block mt-3 text-sm font-medium text-green-700 underline"
                                    >
                                        {faq.linkText}
                                    </Link>
                                )}
                            </details>
                        ))}
                    </div>
                </section>

                <section
                    aria-labelledby="contact-heading"
                    className="self-start rounded-2xl border bg-white p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3">
                        <MessageSquareText className="text-green-700" />
                        <h2 id="contact-heading" className="text-2xl font-bold">
                            Contact a farmer
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Signed in as {user?.fullname || "buyer"}{user?.email ? ` (${user.email})` : ""}. Your request will go to the selected farmer.
                    </p>

                    {ticketId && (
                        <div
                            role="status"
                            className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                <CheckCircle size={18} />
                                Your request was sent successfully.
                            </div>
                            <p className="mt-1">
                                Reference: #{ticketId.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {farmersError && (
                        <p role="alert" className="mt-4 text-sm text-red-600">
                            {farmersError}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <div>
                            <label
                                htmlFor="support-farmer"
                                className="block text-sm font-medium mb-1"
                            >
                                Farmer
                            </label>
                            <select
                                id="support-farmer"
                                name="farmer"
                                value={form.farmer}
                                onChange={handleChange}
                                required
                                disabled={farmersLoading || farmers.length === 0}
                                className="w-full rounded-lg border px-3 py-3 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {farmersLoading ? "Loading farmers..." : "Select a farmer"}
                                </option>
                                {farmers.map((farmer) => (
                                    <option
                                        key={farmer.user?._id}
                                        value={farmer.user?._id || ""}
                                    >
                                        {farmer.farmName} — {farmer.user?.fullname}
                                    </option>
                                ))}
                            </select>
                            {!farmersLoading && farmers.length === 0 && !farmersError && (
                                <p className="mt-1 text-sm text-gray-500">
                                    No approved farmers are available right now.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="support-category"
                                className="block text-sm font-medium mb-1"
                            >
                                What do you need help with?
                            </label>
                            <select
                                id="support-category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border px-3 py-3"
                            >
                                <option value="order">Orders</option>
                                <option value="payment">Payments</option>
                                <option value="delivery">Delivery</option>
                                <option value="account">Account</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="support-subject"
                                className="block text-sm font-medium mb-1"
                            >
                                Subject
                            </label>
                            <input
                                id="support-subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                maxLength={120}
                                required
                                placeholder="Briefly describe your issue"
                                className="w-full rounded-lg border px-3 py-3"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="support-message"
                                className="block text-sm font-medium mb-1"
                            >
                                Message
                            </label>
                            <textarea
                                id="support-message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                maxLength={2000}
                                rows={5}
                                required
                                placeholder="Share details that will help us resolve your issue."
                                className="w-full rounded-lg border px-3 py-3"
                            />
                            <p className="mt-1 text-right text-xs text-gray-500">
                                {form.message.length}/2000
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || farmersLoading || farmers.length === 0}
                            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            {submitting ? "Sending..." : "Send support request"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default HelpCenter;
