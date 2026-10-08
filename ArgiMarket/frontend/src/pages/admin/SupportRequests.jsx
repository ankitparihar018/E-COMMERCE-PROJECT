import { useEffect, useState } from "react";
import {
    getSupportRequests,
    updateSupportRequestStatus
} from "../../services/admin.api";

const statusLabels = {
    open: "Open",
    in_progress: "In progress",
    resolved: "Resolved"
};

const SupportRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    useEffect(() => {
        let active = true;

        getSupportRequests()
            .then((response) => {
                if (active && response.data.success) {
                    setRequests(response.data.requests || []);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                        "Unable to load support requests."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const changeStatus = async (requestId, status) => {
        setError("");
        setUpdatingId(requestId);

        try {
            const response = await updateSupportRequestStatus(
                requestId,
                status
            );

            if (response.data.success) {
                setRequests((current) =>
                    current.map((request) =>
                        request._id === requestId
                            ? response.data.request
                            : request
                    )
                );
            }
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to update support request."
            );
        } finally {
            setUpdatingId("");
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading support requests...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <h1 className="text-3xl font-bold">Buyer Support Requests</h1>
            <p className="mt-2 text-gray-500">
                Review buyer messages and update their request status.
            </p>

            {error && (
                <p role="alert" className="mt-5 text-sm text-red-600">
                    {error}
                </p>
            )}

            {requests.length === 0 ? (
                <div className="mt-8 rounded-2xl border bg-white p-10 text-center text-gray-500">
                    No support requests have been submitted.
                </div>
            ) : (
                <div className="mt-8 space-y-4">
                    {requests.map((request) => (
                        <article
                            key={request._id}
                            className="rounded-2xl border bg-white p-5 sm:p-6"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                                        {request.category} · #{request._id.slice(-8).toUpperCase()}
                                    </p>
                                    <h2 className="mt-2 text-lg font-semibold">
                                        {request.subject}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {request.consumer?.fullname || "Buyer"} ·{" "}
                                        {request.consumer?.email || "No email"} ·{" "}
                                        {new Date(request.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <label className="text-sm">
                                    <span className="sr-only">Request status</span>
                                    <select
                                        value={request.status}
                                        disabled={updatingId === request._id}
                                        onChange={(event) =>
                                            changeStatus(
                                                request._id,
                                                event.target.value
                                            )
                                        }
                                        className="rounded-lg border px-3 py-2 disabled:opacity-60"
                                    >
                                        {Object.entries(statusLabels).map(
                                            ([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>
                            </div>
                            <p className="mt-5 whitespace-pre-wrap border-t pt-4 text-gray-700">
                                {request.message}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportRequests;
