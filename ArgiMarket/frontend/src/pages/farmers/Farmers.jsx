import { useEffect, useMemo, useState } from "react";
import { MapPin, Sprout, Users } from "lucide-react";

import FarmerCard from "../../components/FarmerCard";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import { getFarmers } from "../../services/farmer.api";

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");

    useEffect(() => {
        const loadFarmers = async () => {
            try {
                const response = await getFarmers();

                if (!response.data.success) {
                    throw new Error(response.data.message || "Unable to load farmers.");
                }

                setFarmers(response.data.farmers);
            } catch (loadError) {
                setError(
                    loadError.response?.data?.message ||
                    loadError.message ||
                    "Unable to load farmers."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFarmers();
    }, []);

    const cities = useMemo(
        () => [...new Set(farmers.map((farmer) => farmer.city).filter(Boolean))]
            .sort((first, second) => first.localeCompare(second)),
        [farmers]
    );

    const visibleFarmers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return farmers.filter((farmer) => {
            const searchableText = [
                farmer.farmName,
                farmer.user?.fullname,
                farmer.city,
                farmer.state,
                ...(farmer.crops || [])
            ].filter(Boolean).join(" ").toLowerCase();

            return (!query || searchableText.includes(query)) &&
                (!city || farmer.city === city);
        });
    }, [farmers, search, city]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="rounded-3xl bg-gradient-to-br from-green-50 via-white to-lime-50 p-6 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                    People behind your produce
                </p>
                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Meet Our Farmers
                </h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                    Discover approved local farms, learn what they grow, and connect with the people cultivating your food.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white/80 p-4">
                        <Users className="text-green-700" size={21} />
                        <span className="text-sm font-medium">Verified farmer profiles</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white/80 p-4">
                        <Sprout className="text-green-700" size={21} />
                        <span className="text-sm font-medium">Crops and farming details</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white/80 p-4">
                        <MapPin className="text-green-700" size={21} />
                        <span className="text-sm font-medium">Farm locations near you</span>
                    </div>
                </div>
            </header>

            {!loading && !error && farmers.length > 0 && (
                <section
                    aria-label="Find a farmer"
                    className="mt-7 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search farms, farmers, crops, or regions..."
                    />
                    <label className="sr-only" htmlFor="farmer-city-filter">
                        Filter by city
                    </label>
                    <select
                        id="farmer-city-filter"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className="min-w-48 rounded-xl border px-4 py-3"
                    >
                        <option value="">All locations</option>
                        {cities.map((cityName) => (
                            <option key={cityName} value={cityName}>
                                {cityName}
                            </option>
                        ))}
                    </select>
                </section>
            )}

            {loading ? (
                <Loader />
            ) : error ? (
                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700" role="alert">
                    {error}
                </div>
            ) : farmers.length === 0 ? (
                <div className="mt-8 rounded-2xl border bg-white px-6 py-16 text-center text-gray-500">
                    No approved farmer profiles are available yet.
                </div>
            ) : visibleFarmers.length === 0 ? (
                <div className="mt-8 rounded-2xl border bg-white px-6 py-16 text-center">
                    <h2 className="text-lg font-semibold">No farmers match your search.</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Try another name, crop, or location.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setCity("");
                        }}
                        className="mt-4 font-medium text-green-700 underline"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <>
                    <p className="mt-6 text-sm text-gray-500">
                        Showing {visibleFarmers.length} of {farmers.length} farms
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleFarmers.map((farmer) => (
                            <FarmerCard key={farmer._id} farmer={farmer} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Farmers;
