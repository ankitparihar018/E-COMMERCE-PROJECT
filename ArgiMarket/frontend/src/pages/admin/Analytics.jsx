import { useEffect, useState } from "react";
import {
    Users,
    Package,
    ShoppingBag,
    IndianRupee
} from "lucide-react";

import { getAnalytics } from "../../services/admin.api";

const Analytics = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {

            try {

                const response = await getAnalytics();

                if (response.data.success) {
                    setData(response.data.analytics);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        };

        load();

    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading analytics...
            </div>
        );
    }

    const cards = [
        {
            title: "Users",
            value: data?.users || 0,
            icon: Users
        },
        {
            title: "Farmers",
            value: data?.farmers || 0,
            icon: Users
        },
        {
            title: "Products",
            value: data?.products || 0,
            icon: Package
        },
        {
            title: "Orders",
            value: data?.orders || 0,
            icon: ShoppingBag
        },
        {
            title: "Revenue",
            value: `₹${data?.revenue || 0}`,
            icon: IndianRupee
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Analytics
            </h1>

            <p className="text-gray-500 mt-2">
                Marketplace performance overview.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="bg-white border rounded-2xl p-6"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {card.title}
                                    </p>

                                    <p className="text-2xl font-bold mt-2">
                                        {card.value}
                                    </p>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                    <Icon size={22} />
                                </div>

                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );
};

export default Analytics;