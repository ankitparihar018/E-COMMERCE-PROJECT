import { useEffect, useState } from "react";

import {
    getFarmers,
    approveFarmer,
    rejectFarmer
} from "../../services/admin.api";

const Farmers = () => {

    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFarmers = async () => {

        try {

            const response = await getFarmers();

            if (response.data.success) {
                setFarmers(response.data.farmers);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFarmers();
    }, []);

    const approve = async (id) => {

        try {
            await approveFarmer(id);
            loadFarmers();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to approve farmer."
            );
        }
    };

    const reject = async (id) => {

        const reason = prompt(
            "Enter rejection reason:"
        );

        if (!reason) return;

        try {

            await rejectFarmer(id, reason);

            loadFarmers();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to reject farmer."
            );

        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading farmers...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

            <h1 className="text-3xl font-bold">
                Manage Farmers
            </h1>

            <p className="text-gray-500 mt-2">
                Approve and manage farmer applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

                {farmers.map((farmer) => (

                    <div
                        key={farmer._id}
                        className="bg-white border rounded-2xl p-5"
                    >

                        <div className="flex justify-between items-start gap-3">

                            <div>

                                <h2 className="font-semibold text-lg">
                                    {farmer.farmName}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {farmer.city},{" "}
                                    {farmer.state}
                                </p>

                            </div>

                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
                                {farmer.verificationStatus}
                            </span>

                        </div>

                        <p className="text-sm text-gray-600 mt-4">
                            {farmer.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-5">

                            {farmer.verificationStatus !== "approved" && (
                                <button
                                    onClick={() =>
                                        approve(farmer._id)
                                    }
                                    className="flex-1 min-w-[120px] py-2 rounded-lg bg-green-600 text-white"
                                >
                                    Approve
                                </button>
                            )}

                            {farmer.verificationStatus !== "rejected" && (
                                <button
                                    onClick={() =>
                                        reject(farmer._id)
                                    }
                                    className="flex-1 min-w-[120px] py-2 rounded-lg bg-red-500 text-white"
                                >
                                    Reject
                                </button>
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Farmers;