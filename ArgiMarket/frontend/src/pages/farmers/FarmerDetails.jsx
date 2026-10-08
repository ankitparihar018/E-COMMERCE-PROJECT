import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import Loader from "../../components/Loader";
import ProductCard from "../../components/ProductCard";
import { getFarmer } from "../../services/farmer.api";
import { startConversation } from "../../services/chat.api";
import { useAuth } from "../../context/AuthContext";

const FarmerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chatError, setChatError] = useState("");
    const [startingChat, setStartingChat] = useState(false);

    useEffect(() => {
        const loadFarmer = async () => {
            try {
                const response = await getFarmer(id);

                if (!response.data.success) {
                    throw new Error(response.data.message || "Farmer not found.");
                }

                setFarmer(response.data.farmer);
            } catch (loadError) {
                setError(
                    loadError.response?.data?.message ||
                    loadError.message ||
                    "Unable to load this farm."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFarmer();
    }, [id]);

    const messageFarmer = async () => {
        if (!farmer?.user?._id) {
            return;
        }

        setStartingChat(true);
        setChatError("");
        try {
            const response = await startConversation(farmer.user._id);
            if (!response.data.success || !response.data.conversation?._id) {
                throw new Error(
                    response.data.message || "Unable to start a conversation."
                );
            }

            navigate(`/chats/${response.data.conversation._id}`);
        } catch (requestError) {
            setChatError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to start a conversation."
            );
        } finally {
            setStartingChat(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error || !farmer) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">
                    Farm not found
                </h1>
                <p className="mt-2 text-gray-600">
                    {error || "This farm may no longer be available."}
                </p>
                <Link
                    to="/farmers"
                    className="inline-block mt-6 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
                >
                    Browse Farmers
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <Link to="/farmers" className="text-green-700 hover:underline">
                ← All Farmers
            </Link>

            <section className="mt-6 rounded-2xl border bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green-100 text-2xl font-bold text-green-700">
                        {farmer.user?.profileImage ? (
                            <img
                                src={farmer.user.profileImage}
                                alt={farmer.farmName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            farmer.farmName?.charAt(0)
                        )}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-3xl font-bold">
                            {farmer.farmName}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {farmer.user?.fullname}
                        </p>
                        <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
                            {farmer.user?.contact && (
                                <a
                                    href={`tel:${farmer.user.contact}`}
                                    className="flex items-center gap-2 hover:text-green-700"
                                >
                                    <Phone size={16} />
                                    <span>{farmer.user.contact}</span>
                                </a>
                            )}
                            {farmer.user?.email && (
                                <a
                                    href={`mailto:${farmer.user.email}`}
                                    className="flex items-center gap-2 break-all hover:text-green-700"
                                >
                                    <Mail size={16} className="shrink-0" />
                                    <span>{farmer.user.email}</span>
                                </a>
                            )}
                        </div>
                        {user?.role === "consumer" && (
                            <button
                                type="button"
                                onClick={messageFarmer}
                                disabled={startingChat}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                            >
                                <MessageCircle size={17} />
                                {startingChat ? "Opening chat..." : "Message farmer"}
                            </button>
                        )}
                    </div>
                </div>

                {chatError && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {chatError}
                    </p>
                )}

                <p className="mt-5 flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    {farmer.farmLocation}, {farmer.city}, {farmer.state} {farmer.pincode}
                </p>

                {farmer.description && (
                    <div className="mt-7">
                        <h2 className="text-xl font-semibold">About the farm</h2>
                        <p className="mt-2 whitespace-pre-line text-gray-700">
                            {farmer.description}
                        </p>
                    </div>
                )}

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div>
                        <h2 className="font-semibold">Farming method</h2>
                        <p className="mt-1 capitalize text-gray-600">
                            {farmer.farmingMethod || "Not specified"}
                        </p>
                    </div>
                    {farmer.farmSize > 0 && (
                        <div>
                            <h2 className="font-semibold">Farm size</h2>
                            <p className="mt-1 text-gray-600">
                                {farmer.farmSize} acres
                            </p>
                        </div>
                    )}
                </div>

                {farmer.crops?.length > 0 && (
                    <div className="mt-7">
                        <h2 className="font-semibold">Crops grown</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {farmer.crops.map((crop) => (
                                <span
                                    key={crop}
                                    className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800"
                                >
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-bold">Products from this farm</h2>
                {farmer.products?.length ? (
                    <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {farmer.products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-gray-600">
                        This farmer has no products available right now.
                    </p>
                )}
            </section>
        </div>
    );
};

export default FarmerDetails;
