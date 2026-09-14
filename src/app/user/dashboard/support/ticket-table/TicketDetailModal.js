"use client";
import React, { useState, useEffect, useRef } from "react";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  addTicketReplytest,
  getTicketReplyByTicketId,
} from "@/app/redux/slices/UserticketSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

export default function TicketDetailModal({ open, onClose, ticket }) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const { getTicketByTicketIdData } = useSelector((state) => state.userticket);

  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fName = getEncryptedLocalData("FName");
    setUser(fName);
    setUserData({ FName: fName });
    const fetchData = async () => {
      try {
        await dispatch(getTicketReplyByTicketId(ticket.TicketId));
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchData();
  }, [dispatch, ticket?.TicketId]);

  if (!open || !ticket) return null;

  const ticketIndexZero = getTicketByTicketIdData?.ticket[0] || {};
  const handleReply = async (e) => {
    e.preventDefault();
    const urid = getEncryptedLocalData("UserId");
    try {
      const data = {
        ticketId: ticketIndexZero.TicketId,
        createdBy: urid,
        message: reply,
        status: 1,
        seen: 1,
        imageFile: null,
      };

      await dispatch(addTicketReplytest(data)).unwrap();
      setReply("");
      await dispatch(getTicketReplyByTicketId(ticket.TicketId));
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const allMessages = [
    ...(getTicketByTicketIdData?.replies?.length
      ? getTicketByTicketIdData.replies.map((item) => ({
        id: item.id,
        message: item.Message,
        timestamp: item.ReplyDate,
        Name: item.Name,
        Status: item.Status,
        user: item.appUserId ? "User" : "Admin",
      }))
      : []),
    ...replies,
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="bt-modal-overlay" style={{ zIndex: "70" }}>
      <div
        ref={modalRef}
        className="bt-modal-box" >
        {/* Close Button */}
        <button
          className="bt-modal-close"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <h2 className="bt-modal-title">
          Ticket Details
        </h2>

        {/* Ticket Info */}
        <div className="bt-ticket-info-grid">
          <div className="bt-info-item">
            <p className="bt-info-label">User</p>
            <p className="bt-info-value">{ticketIndexZero.UserName || "N/A"}</p>
          </div>

          <div className="bt-info-item bt-text-right">
            <p className="bt-info-label">Type</p>
            <p className="bt-info-value">{ticketIndexZero.TicketType || "N/A"}</p>
          </div>

          <div className="bt-info-item">
            <p className="bt-info-label">Subject</p>
            <p className="bt-info-value">{ticketIndexZero.Subject || "N/A"}</p>
          </div>

          <div className="bt-info-item bt-text-right">
            <p className="bt-info-label">Time</p>
            <p className="bt-info-value">{ticketIndexZero.CreatedDate || "N/A"}</p>
          </div>

          <div className="bt-info-item bt-col-span-2 bt-text-right">
            <p className="bt-info-label">Status</p>
            <span
              className={`bt-status-badge ${ticketIndexZero.StatusType?.toLowerCase() === "open"
                  ? "bt-status-open"
                  : "bt-status-closed"
                }`}
            >
              <span
                className={`bt-status-dot ${ticketIndexZero.StatusType?.toLowerCase() === "open"
                    ? "bt-status-dot-open"
                    : "bt-status-dot-closed"
                  }`}
              />
              {ticketIndexZero.StatusType || "N/A"}
            </span>
          </div>
        </div>

        {/* Image */}
        {(() => {
          const imagePath = ticketIndexZero.ImagePath;
          if (!imagePath) return false;
          if (typeof imagePath !== 'string') return false;
          const trimmed = imagePath.trim();
          if (!trimmed) return false;
          if (trimmed === "NaN" || trimmed === "null" || trimmed === "undefined") return false;
          if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) return false;
          if (trimmed.includes('/NaN') || trimmed.endsWith('/NaN')) return false;
          return true;
        })() && (
          <div className="bt-ticket-image">
            <img
              src={ticketIndexZero.ImagePath}
              alt="Ticket"
              className="bt-image"
            />
          </div>
        )}

        {/* Conversation */}
        <div className="bt-conversation-section">
          <h3 className="bt-conversation-title">Conversation</h3>

          <div className="bt-conversation-area">
            {allMessages.map((message, index) => {
              const isUser = message.Status === 1;

              return (
                <div
                  key={message.id || index}
                  className={`bt-message-wrapper ${isUser ? "bt-message-user" : "bt-message-admin"}`}
                >
                  <div
                    className={`bt-message-bubble ${isUser ? "bt-bubble-user" : "bt-bubble-admin"}`}
                  >
                    {!isUser && (
                      <p className="bt-message-sender">
                        {message.Name || "Admin"}
                      </p>
                    )}

                    <p className="bt-message-text" dangerouslySetInnerHTML={{ __html: message.message }} />

                    <span className={`bt-message-time ${isUser ? "bt-time-right" : "bt-time-left"}`}>
                      {message.timestamp || ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="bt-reply-form">
          <label className="bt-reply-label">Activity</label>

          <textarea
            className="bt-reply-textarea"
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            required
          />

          <button
            type="submit"
            disabled={!reply.trim()}
            className="bt-reply-btn"
          >
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
}



