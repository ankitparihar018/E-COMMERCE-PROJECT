import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const FarmerCard = ({ farmer }) => {

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

            <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl overflow-hidden">

                    {farmer.user?.profileImage ? (
                        <img
                            src={farmer.user.profileImage}
                            className="w-full h-full object-cover"
                            alt={farmer.farmName}
                        />
                    ) : (
                        farmer.farmName?.charAt(0)
                    )}

                </div>

                <div>
                    <h3 className="font-semibold text-lg">
                        {farmer.farmName}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {farmer.user?.fullname}
                    </p>
                </div>

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <MapPin size={16} />
                {farmer.city}, {farmer.state}
            </div>

            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {farmer.description}
            </p>

            <Link
                to={`/farmers/${farmer.user?._id || farmer._id}`}
                className="block text-center mt-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
                View Farm
            </Link>

        </div>
    );
};

export default FarmerCard;