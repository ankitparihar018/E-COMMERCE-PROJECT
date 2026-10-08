import { useEffect, useState } from "react";
import {
    getMyFarmerProfile,
    createFarmerProfile,
    updateFarmerProfile,
    deleteFarmerProfile
} from "../../services/farmer.api";

const emptyForm = {
    farmName: "",
    farmLocation: "",
    city: "",
    state: "",
    pincode: "",
    crops: "",
    farmingMethod: "conventional",
    farmSize: "",
    description: ""
};

const FarmerProfile = () => {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    const loadProfile = async () => {
        try {
            const response = await getMyFarmerProfile();

            if (response.data.success) {
                const data = response.data.profile;

                setProfile(data);

                if (!data) {
                    return;
                }

                setForm({
                    farmName: data.farmName || "",
                    farmLocation: data.farmLocation || "",
                    city: data.city || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    crops: data.crops?.join(", ") || "",
                    farmingMethod:
                        data.farmingMethod || "conventional",
                    farmSize: data.farmSize || "",
                    description: data.description || ""
                });
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const update = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const data = {
                ...form,
                crops: form.crops
                    .split(",")
                    .map((crop) => crop.trim())
                    .filter(Boolean)
            };

            let response;

            if (profile) {
                response = await updateFarmerProfile(data);
            } else {
                response = await createFarmerProfile(data);
            }

            if (response.data.success) {
                alert("Farmer profile saved successfully.");
                loadProfile();
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to save profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const removeProfile = async () => {
        if (!window.confirm(
            "Delete your farmer profile and all your products? Your account and orders will not be deleted."
        )) {
            return;
        }

        try {
            setDeleting(true);
            const response = await deleteFarmerProfile();

            if (response.data.success) {
                setProfile(null);
                setForm({ ...emptyForm });
                alert("Farmer profile deleted successfully.");
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete profile."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Farmer Profile
                </h1>

                <p className="text-gray-500 mt-2">
                    Add information about your farm.
                </p>
            </div>

            {profile?.verificationStatus && (() => {
                const statusStyles = {
                    approved: "border-green-200 bg-green-50 text-green-800",
                    pending: "border-yellow-200 bg-yellow-50 text-yellow-800",
                    rejected: "border-red-200 bg-red-50 text-red-800"
                };
                const statusMessages = {
                    approved: "Your farm profile is approved and visible to buyers.",
                    pending: "Your farm profile is waiting for verification.",
                    rejected: "Your farm profile was not approved. Update your information and contact support if you need help."
                };
                const status = profile.verificationStatus;

                return (
                    <div className={`mb-6 rounded-xl border p-4 ${statusStyles[status] || "border-gray-200 bg-gray-50 text-gray-700"}`}>
                        <p>
                            Verification status:{" "}
                            <strong className="capitalize">
                                {status}
                            </strong>
                        </p>
                        <p className="mt-1 text-sm">
                            {statusMessages[status] || "Your farm profile verification status."}
                        </p>
                        {status === "rejected" && profile.rejectionReason && (
                            <p className="mt-2 text-sm">
                                <strong>Reason:</strong> {profile.rejectionReason}
                            </p>
                        )}
                    </div>
                );
            })()}

            <form
                onSubmit={submit}
                className="bg-white border rounded-2xl p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >

                <div className="sm:col-span-2">
                    <label className="block font-medium mb-2">
                        Farm Name
                    </label>

                    <input
                        name="farmName"
                        value={form.farmName}
                        onChange={update}
                        required
                        className="input-field w-full px-4 py-3 border rounded-xl"
                        placeholder="Green Valley Farm"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-medium mb-2">
                        Farm Location
                    </label>

                    <input
                        name="farmLocation"
                        value={form.farmLocation}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                        placeholder="Village / Farm location"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        City
                    </label>

                    <input
                        name="city"
                        value={form.city}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        State
                    </label>

                    <input
                        name="state"
                        value={form.state}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        Pincode
                    </label>

                    <input
                        name="pincode"
                        value={form.pincode}
                        onChange={update}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        Farm Size
                    </label>

                    <input
                        name="farmSize"
                        type="number"
                        min="0"
                        step="any"
                        value={form.farmSize}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                        placeholder="e.g. 5"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-medium mb-2">
                        Crops
                    </label>

                    <input
                        name="crops"
                        value={form.crops}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                        placeholder="Tomato, Potato, Wheat"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                        Separate multiple crops using commas.
                    </p>
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        Farming Method
                    </label>

                    <select
                        name="farmingMethod"
                        value={form.farmingMethod}
                        onChange={update}
                        className="w-full px-4 py-3 border rounded-xl"
                    >
                        <option value="organic">
                            Organic
                        </option>

                        <option value="conventional">
                            Conventional
                        </option>

                        <option value="mixed">
                            Mixed
                        </option>
                    </select>
                </div>

                <div className="sm:col-span-2">

                    <label className="block font-medium mb-2">
                        Farm Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={update}
                        rows="5"
                        className="w-full px-4 py-3 border rounded-xl resize-none"
                        placeholder="Tell consumers about your farm..."
                    />

                </div>

                <button
                    disabled={saving || deleting}
                    className="sm:col-span-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : profile
                            ? "Update Profile"
                            : "Create Profile"}
                </button>

                {profile && (
                    <button
                        type="button"
                        onClick={removeProfile}
                        disabled={saving || deleting}
                        className="sm:col-span-2 py-3 rounded-xl border border-red-600 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete Profile"}
                    </button>
                )}

            </form>

        </div>
    );
};

export default FarmerProfile;