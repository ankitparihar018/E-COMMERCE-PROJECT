import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { MessageCircle, Send } from "lucide-react";
import {
    getConversationMessages,
    getConversations
} from "../services/chat.api";
import { useAuth } from "../context/AuthContext";

const mergeMessages = (current, incoming) => {
    const byId = new Map(
        current.map((message) => [message._id, message])
    );

    incoming.forEach((message) => {
        byId.set(message._id, message);
    });

    return [...byId.values()].sort(
        (first, second) =>
            new Date(first.createdAt) - new Date(second.createdAt)
    );
};

const Chat = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [messageData, setMessageData] = useState({
        conversationId: null,
        messages: []
    });
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [connected, setConnected] = useState(false);
    const [sending, setSending] = useState(false);
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const messages = useMemo(
        () => messageData.conversationId === conversationId
            ? messageData.messages
            : [],
        [conversationId, messageData]
    );
    const messageLoading = Boolean(conversationId) &&
        messageData.conversationId !== conversationId;

    const loadConversations = useCallback(async () => {
        try {
            const response = await getConversations();
            if (response.data.success) {
                setConversations(response.data.conversations || []);
                setError("");
            }
        } catch (loadError) {
            setError(
                loadError.response?.data?.message ||
                "Unable to load conversations."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConversations();
        const refreshId = window.setInterval(loadConversations, 15000);

        return () => {
            window.clearInterval(refreshId);
        };
    }, [loadConversations]);

    useEffect(() => {
        if (!conversationId) {
            return undefined;
        }

        let active = true;

        getConversationMessages(conversationId)
            .then((response) => {
                if (active && response.data.success) {
                    setMessageData((current) => ({
                        conversationId,
                        messages: mergeMessages(
                            current.conversationId === conversationId
                                ? current.messages
                                : [],
                            response.data.messages || []
                        )
                    }));
                    setError("");
                }
            })
            .catch((loadError) => {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load this conversation."
                    );
                    setMessageData({
                        conversationId,
                        messages: []
                    });
                }
            });

        const socket = io("/", {
            path: "/socket.io",
            withCredentials: true,
            autoConnect: false
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("chat:join", conversationId, (result) => {
                if (!result?.success) {
                    setError(result?.message || "Unable to join conversation.");
                }
            });
        });
        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", () => {
            setConnected(false);
            setError("Chat connection lost. Please try again.");
        });
        socket.on("chat:message", (message) => {
            if (active && message.conversationId === conversationId) {
                setMessageData((current) => ({
                    conversationId,
                    messages: mergeMessages(
                        current.conversationId === conversationId
                            ? current.messages
                            : [],
                        [message]
                    )
                }));
                loadConversations();
            }
        });
        socket.connect();

        return () => {
            active = false;
            socket.disconnect();
            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [conversationId, loadConversations]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectedConversation = conversations.find(
        (conversation) => conversation._id === conversationId
    );

    const getOtherParticipant = (conversation) => (
        user?.role === "consumer"
            ? conversation.farmer
            : conversation.buyer
    );

    const sendMessage = (event) => {
        event.preventDefault();
        const text = draft.trim();
        const socket = socketRef.current;

        if (!text || !conversationId || !socket?.connected || sending) {
            return;
        }

        setSending(true);
        setError("");
        socket.timeout(10000).emit(
            "chat:send",
            { conversationId, text },
            (timeoutError, response) => {
                setSending(false);

                if (timeoutError || !response?.success) {
                    setError(
                        response?.message ||
                        "Message could not be sent. Please try again."
                    );
                    return;
                }

                setDraft("");
                setMessageData((current) => ({
                    conversationId,
                    messages: mergeMessages(
                        current.conversationId === conversationId
                            ? current.messages
                            : [],
                        [response.message]
                    )
                }));
                loadConversations();
            }
        );
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex items-center gap-3">
                <MessageCircle className="text-green-700" size={28} />
                <div>
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-sm text-gray-500">
                        Chat directly with buyers and farmers.
                    </p>
                </div>
            </div>

            {error && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="grid min-h-[65vh] overflow-hidden rounded-2xl border bg-white md:grid-cols-[320px_1fr]">
                <aside className="border-b md:border-b-0 md:border-r">
                    <h2 className="border-b px-5 py-4 font-semibold">
                        Conversations
                    </h2>

                    {loading ? (
                        <p className="p-5 text-sm text-gray-500">
                            Loading conversations...
                        </p>
                    ) : conversations.length === 0 ? (
                        <div className="p-5 text-sm text-gray-500">
                            No conversations yet.
                            {user?.role === "consumer" && (
                                <Link
                                    to="/farmers"
                                    className="mt-2 block text-green-700 underline"
                                >
                                    Browse farmers
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="max-h-[30vh] overflow-y-auto md:max-h-[65vh]">
                            {conversations.map((conversation) => {
                                const other = getOtherParticipant(conversation);
                                return (
                                    <button
                                        key={conversation._id}
                                        type="button"
                                        onClick={() =>
                                            navigate(`/chats/${conversation._id}`)
                                        }
                                        className={`w-full border-b px-5 py-4 text-left hover:bg-green-50 ${
                                            conversation._id === conversationId
                                                ? "bg-green-50"
                                                : ""
                                        }`}
                                    >
                                        <p className="font-medium">
                                            {other?.fullname || "Marketplace user"}
                                        </p>
                                        <p className="mt-1 truncate text-sm text-gray-500">
                                            {conversation.lastMessage || "Start the conversation"}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </aside>

                <section className="flex min-h-[55vh] flex-col md:min-h-0">
                    {!conversationId ? (
                        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
                            <MessageCircle size={42} className="mb-3 text-green-600" />
                            <p className="font-medium">Select a conversation</p>
                            <p className="mt-1 text-sm">
                                {user?.role === "consumer"
                                    ? "Open a farmer's profile to start a chat."
                                    : "Buyer messages will appear here."}
                            </p>
                        </div>
                    ) : !selectedConversation && !loading ? (
                        <div className="p-8 text-center text-gray-500">
                            This conversation is unavailable.
                        </div>
                    ) : (
                        <>
                            <header className="flex items-center justify-between border-b px-5 py-4">
                                <div>
                                    <h2 className="font-semibold">
                                        {selectedConversation
                                            ? getOtherParticipant(selectedConversation)?.fullname
                                            : "Conversation"}
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {connected ? "Connected" : "Connecting..."}
                                    </p>
                                </div>
                            </header>

                            <div
                                aria-live="polite"
                                className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 sm:p-6"
                            >
                                {messageLoading && (
                                    <p className="text-center text-sm text-gray-500">
                                        Loading messages...
                                    </p>
                                )}
                                {!messageLoading && messages.length === 0 && (
                                    <p className="pt-10 text-center text-sm text-gray-500">
                                        Say hello to start the conversation.
                                    </p>
                                )}
                                {messages.map((message) => {
                                    const ownMessage =
                                        message.sender?._id === user?.id ||
                                        message.sender?._id === user?._id;
                                    return (
                                        <div
                                            key={message._id}
                                            className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                                    ownMessage
                                                        ? "bg-green-600 text-white"
                                                        : "border bg-white text-gray-800"
                                                }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words">
                                                    {message.text}
                                                </p>
                                                <time
                                                    dateTime={message.createdAt}
                                                    className={`mt-1 block text-right text-[11px] ${
                                                        ownMessage
                                                            ? "text-green-100"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {new Date(message.createdAt).toLocaleTimeString(
                                                        [],
                                                        { hour: "2-digit", minute: "2-digit" }
                                                    )}
                                                </time>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            <form
                                onSubmit={sendMessage}
                                className="flex items-end gap-3 border-t p-4"
                            >
                                <label htmlFor="chat-message" className="sr-only">
                                    Message
                                </label>
                                <textarea
                                    id="chat-message"
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    maxLength={2000}
                                    rows={2}
                                    placeholder="Write a message..."
                                    className="max-h-32 min-h-12 flex-1 resize-y rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!connected || sending || !draft.trim()}
                                    className="flex h-12 items-center gap-2 rounded-xl bg-green-600 px-4 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Send message"
                                >
                                    <Send size={18} />
                                    <span className="hidden sm:inline">
                                        {sending ? "Sending" : "Send"}
                                    </span>
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Chat;
