import { Link } from "react-router-dom";
import {
    Users,
    Package,
    ShoppingBag,
    BarChart3,
    MessageSquareText
} from "lucide-react";

const AdminDashboard = () => {

    const cards = [
        {
            title: "Farmers",
            icon: Users,
            link: "/admin/farmers"
        },
        {
            title: "Products",
            icon: Package,
            link: "/admin/products"
        },
        {
            title: "Orders",
            icon: ShoppingBag,
            link: "/admin/orders"
        },
        {
            title: "Analytics",
            icon: BarChart3,
            link: "/admin/analytics"
        },
        {
            title: "Support Requests",
            icon: MessageSquareText,
            link: "/admin/support"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold">
                Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
                Manage the entire marketplace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white border rounded-2xl p-6 hover:shadow-lg"
                        >

                            <Icon
                                className="text-green-600"
                                size={32}
                            />

                            <h2 className="font-semibold text-lg mt-5">
                                {card.title}
                            </h2>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
};

export default AdminDashboard;