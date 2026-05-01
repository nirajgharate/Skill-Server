import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Loader2,
  Copy,
  CheckCircle2,
  Send,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { bookingService } from "../services/api.service";
import chatService from "../services/chat.service";
import useSocket from "../hooks/useSocket";
import { getAvatarUrl } from "../utils/avatar.util";

const formatBooking = (booking) => {
  if (!booking) return null;

  const service =
    booking.serviceId?.name ||
    booking.service ||
    booking.serviceName ||
    "Service";
  const userInfo =
    booking.userId && typeof booking.userId === "object" ? booking.userId : {};
  const workerInfo =
    booking.workerId && typeof booking.workerId === "object"
      ? booking.workerId
      : {};

  const user = {
    ...userInfo,
    name: userInfo?.name || booking.customer || "Customer",
    phone: userInfo?.phone || "",
  };
  const worker = {
    ...workerInfo,
    name: workerInfo?.name || booking.expert || "Professional",
    phone: workerInfo?.phone || "",
  };

  return {
    ...booking,
    service,
    user,
    worker,
    contactName: worker.name || user.name || "Contact",
    phone: worker.phone || user.phone || booking.phone || "",
    status:
      booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) ||
      "Pending",
  };
};

export default function MessagePage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { socket, registerUser, on, off } = useSocket();

  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const loadChat = async () => {
      if (!bookingId) {
        setError(
          "Booking ID is missing. Please return to your booking list and try again.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const bookingData = await bookingService.getBookingDetails(bookingId);
        const chatThread = await chatService.getChatThread(bookingId);

        if (!chatThread || !Array.isArray(chatThread.messages)) {
          throw new Error("Invalid chat history returned from the server.");
        }

        setBooking(formatBooking(bookingData));
        setMessages(chatThread.messages || []);
      } catch (err) {
        console.error(
          "Unable to load chat thread:",
          err.response?.data || err.message || err,
        );
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load booking or chat history. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [bookingId]);

  useEffect(() => {
    if (!authUser?._id) return;

    if (socket && socket.connected) {
      registerUser(authUser._id, authUser.role || "user");
      setConnected(true);
    }

    const handleConnect = () => {
      setConnected(true);
      registerUser(authUser._id, authUser.role || "user");
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const authUserId = String(authUser?._id || authUser?.id || "");
    const handleIncomingMessage = (data) => {
      if (!data || data.bookingId !== bookingId) return;
      if (String(data.senderId) === authUserId) return;

      setMessages((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          senderRole: data.senderRole,
          senderName: data.senderName || "Contact",
          content: data.message,
          createdAt: data.createdAt,
        },
      ]);
    };

    on("message_sent", handleIncomingMessage);

    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
    }

    return () => {
      off("message_sent", handleIncomingMessage);
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      }
    };
  }, [authUser, bookingId, socket, on, off, registerUser]);

  const handleCopy = async () => {
    if (!contactPhone) return;
    try {
      await navigator.clipboard.writeText(contactPhone);
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleSend = async () => {
    if (!draft.trim()) return;

    setSending(true);
    try {
      const response = await chatService.sendMessage(bookingId, draft.trim());
      const newMessage = response.message || response.data?.message || response;

      setMessages((prev) => [
        ...prev,
        {
          senderId: authUser._id,
          senderRole: authUser.role,
          senderName: authUser.name || "Me",
          content: draft.trim(),
          createdAt: newMessage?.createdAt || new Date().toISOString(),
        },
      ]);
      setDraft("");
    } catch (err) {
      console.error("Failed to send chat message:", err);
      setError("Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const isWorker =
    authUser?.role === "worker" || booking?.worker?._id === authUser?._id;
  const partner = booking ? (isWorker ? booking.user : booking.worker) : null;
  const selfRoleLabel = isWorker ? "Worker" : "Customer";
  const partnerRoleLabel = isWorker ? "Customer" : "Professional";
  const chatTitle = partner?.name || booking?.contactName || "Booking Chat";
  const bookingServiceTitle = booking?.service || "Service";
  const contactPhone = partner?.phone || booking?.phone || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-2xl bg-white p-3 shadow-sm hover:bg-slate-100 transition-all"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-600 font-black mb-2">
                Live booking chat
              </p>
              <h1 className="text-3xl font-black text-slate-900">
                Chat with {chatTitle}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {bookingServiceTitle} · Booking ID {bookingId}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <MessageSquare size={16} /> View dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm min-h-[680px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={getAvatarUrl({
                      profilePhoto: partner?.profilePhoto,
                      avatarGender: partner?.avatarGender,
                      gender: partner?.gender,
                      name: chatTitle,
                      fallbackSeed: chatTitle,
                    })}
                    alt={chatTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    Chatting with {partnerRoleLabel}
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {chatTitle}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    You are signed in as {selfRoleLabel}
                  </p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {connected ? "Connected" : "Connecting..."}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 size={34} className="text-indigo-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center gap-4 py-16">
                <p className="text-lg font-black text-slate-900">
                  Unable to load chat
                </p>
                <p className="text-sm text-slate-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-4">
                  {messages.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
                      <p className="font-black text-slate-900 mb-2">
                        No messages yet
                      </p>
                      <p className="text-sm">
                        Send the first update for this booking.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMine =
                        String(msg.senderId) ===
                        String(authUser?._id || authUser?.id);
                      return (
                        <div
                          key={`${msg.createdAt}-${index}`}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-3xl px-4 py-3 shadow-sm ${
                              isMine
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                              {isMine ? "You" : msg.senderName || "Contact"}
                            </p>
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {msg.content}
                            </p>
                            <p
                              className={`mt-2 text-[11px] ${isMine ? "text-indigo-200" : "text-slate-500"}`}
                            >
                              {new Date(msg.createdAt).toLocaleString([], {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Type your message
                  </label>
                  <textarea
                    rows={4}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write something like ‘Hi, I’m on my way, please confirm the access details.’"
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-500">
                      {contactPhone
                        ? "Contact phone available"
                        : "No phone details available for this booking."}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        disabled={!contactPhone}
                        className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Copy size={16} />
                        {copySuccess ? "Copied" : "Copy phone"}
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={!draft.trim() || sending}
                        className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200/30 hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        Send message
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Booking summary
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Service
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {booking?.service}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {booking?.status}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Booking ID
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {bookingId}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Contact
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {chatTitle}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {partnerRoleLabel} • {contactPhone || "No phone provided"}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  You are
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  {authUser?.name || selfRoleLabel}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {selfRoleLabel} • {authUser?.email || "No email set"}
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-5 text-slate-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-indigo-600" />
                <div>
                  <p className="font-black">Real-time chat enabled</p>
                  <p className="text-sm">
                    Messages are saved to this booking thread and delivered
                    instantly when the other party is online.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
