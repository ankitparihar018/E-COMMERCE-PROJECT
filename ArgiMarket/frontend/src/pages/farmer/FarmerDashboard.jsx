import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    ShoppingBag,
    UserCircle,
    PlusCircle,
    TrendingUp,
    MessageSquareText
} from "lucide-react";
import { getFarmerProfitSummary } from "../../services/order.api";

const FarmerDashboard = () => {
    const [profitSummary, setProfitSummary] = useState(null);
    const [summaryError, setSummaryError] = useState("");

    const cards = [
        {
            title: "Add Product",
            text: "List your fresh agricultural products.",
            icon: PlusCircle,
            link: "/farmer/products/add"
        },
        {
            title: "My Products",
            text: "Manage your product listings.",
            icon: Package,
            link: "/farmer/products"
        },
        {
            title: "Orders",
            text: "View and manage customer orders.",
            icon: ShoppingBag,
            link: "/farmer/orders"
        },
        {
            title: "Farmer Profile",
            text: "Manage your farm information.",
            icon: UserCircle,
            link: "/farmer/profile"
        },
        {
            title: "Buyer Requests",
            text: "View and respond to buyer help requests.",
            icon: MessageSquareText,
            link: "/farmer/support"
        }
    ];

    useEffect(() => {
        let active = true;

        getFarmerProfitSummary()
            .then((response) => {
                if (active && response.data.success) {
                    setProfitSummary(response.data.summary);
                }
            })
            .catch((error) => {
                if (active) {
                    setSummaryError(
                        error.response?.data?.message ||
                        "Unable to load profit summary."
                    );
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <h1 className="text-3xl font-bold">
                Farmer Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
                Manage your farm and marketplace activity.
            </p>

            <section className="mt-8 rounded-2xl border bg-white p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <TrendingUp />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold">
                            Profit &amp; Margin
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Based on delivered orders. Margin and profit use sales with cost recorded at checkout.
                        </p>

                        {summaryError ? (
                            <p role="alert" className="mt-4 text-sm text-red-600">
                                {summaryError}
                            </p>
                        ) : !profitSummary ? (
                            <p className="mt-4 text-sm text-gray-500">
                                Loading profit summary...
                            </p>
                        ) : (
                            <>
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">Delivered revenue</p>
                                        <p className="mt-1 text-2xl font-bold">
                                            ₹{profitSummary.deliveredRevenue.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-green-50 p-4">
                                        <p className="text-sm text-gray-500">Estimated profit</p>
                                        <p className="mt-1 text-2xl font-bold text-green-700">
                                            ₹{profitSummary.estimatedProfit.toFixed(2)}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            On ₹{profitSummary.trackedRevenue.toFixed(2)} with cost recorded
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">Profit margin</p>
                                        <p className="mt-1 text-2xl font-bold">
                                            {profitSummary.profitMargin == null
                                                ? "N/A"
                                                : `${profitSummary.profitMargin.toFixed(1)}%`}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Of cost-tracked delivered revenue
                                        </p>
                                    </div>
                                </div>
                                {profitSummary.missingCostLineItems > 0 && (
                                    <p className="mt-3 text-xs text-amber-700">
                                        {profitSummary.missingCostLineItems} delivered line item(s) have no saved cost and are excluded from profit and margin.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1"
                        >

                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                <Icon />
                            </div>

                            <h2 className="font-semibold text-lg mt-5">
                                {card.title}
                            </h2>

                            <p className="text-gray-500 text-sm mt-2">
                                {card.text}
                            </p>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
};

export default FarmerDashboard;