"use client";

import { getTicketReplyByTicketId } from "@/app/redux/slices/UserticketSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ViewTicketModal({ open, onClose, ticket }) {
  const dispatch = useDispatch();
  const { getTicketByTicketIdData } = useSelector((state) => state.userticket);

  useEffect(() => {
    if (!open || !ticket) return;
    dispatch(getTicketReplyByTicketId(ticket?.TicketId));
  }, [open, ticket]);

  if (!open || !ticket) return null;

  const ticketDetail = getTicketByTicketIdData?.ticket[0];
  const replies = getTicketByTicketIdData?.replies;

  return (
    <div className="overlay show">
      <div className="popup" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="popup-bar"></div>
        <div className="popup-body">

          {/* Close Button */}
          <button className="popup-x" onClick={onClose}>✕</button>

          {/* Header */}
          <h2 className="st text-white" style={{ marginBottom: "12px" }}>Ticket Details</h2>
          <hr />

          {/* Ticket Info */}
          <div className="g2" style={{ fontSize: "13px", color: "var(--text-2)", marginBottom: "12px" }}>
            <div>
              <p style={{ color: "var(--text-3)", fontSize: "11px", marginBottom: "2px" }}>User</p>
              <p style={{ fontWeight: 600, color: "white" }}>{ticketDetail?.UserName || "N/A"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "var(--text-3)", fontSize: "11px", marginBottom: "2px" }}>Type</p>
              <p style={{ fontWeight: 600, color: "white" }}>{ticketDetail?.TicketType}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-3)", fontSize: "11px", marginBottom: "2px" }}>Subject</p>
              <p style={{ fontWeight: 600, color: "white" }}>{ticketDetail?.Subject}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "var(--text-3)", fontSize: "11px", marginBottom: "2px" }}>Time</p>
              <p style={{ fontWeight: 600, color: "white" }}>{ticketDetail?.CreatedDate}</p>
            </div>
          </div>

          {/* Image if exists */}
          {(() => {
            const imagePath = ticketDetail?.ImagePath;
            if (!imagePath) return false;
            if (typeof imagePath !== 'string') return false;
            const trimmed = imagePath.trim();
            if (!trimmed) return false;
            if (trimmed === "NaN" || trimmed === "null" || trimmed === "undefined") return false;
            if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) return false;
            if (trimmed.includes('/NaN') || trimmed.endsWith('/NaN')) return false;
            return true;
          })() && (
            <div style={{ marginBottom: "12px" }}>
              <img
                src={ticketDetail.ImagePath}
                alt="Ticket"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          )}

          {/* Status */}
          <div style={{ marginBottom: "12px" }}>
            <span
              className={
                ticketDetail?.StatusType === "Open"
                  ? "bt-status-open"
                  : "bt-status-closed"
              }
            >
              {ticketDetail?.StatusType}
            </span>
          </div>

          {/* Conversation */}
          <p className="st text-white" style={{ marginBottom: "8px", fontSize: "13px" }}>
            Conversation
          </p>
          <div
            style={{
              height: "200px",
              overflowY: "auto",
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {replies?.length > 0 ? (
              replies.map((msg, i) => {
                const isUser = msg.Status === 1;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: isUser ? "#7c3aed" : "var(--bg-3)",
                        border: `1px solid ${isUser
                            ? "rgba(124,58,237,0.4)"
                            : "var(--border)"
                          }`,
                      }}
                    >
                      {/* Admin name */}
                      {!isUser && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#a78bfa",
                            marginBottom: "3px",
                            fontWeight: 600,
                          }}
                        >
                          {msg.Name}
                        </p>
                      )}

                      {/* Message text */}
                      <p
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                          color: isUser ? "#ffffff" : "var(--text-1)",
                          margin: 0,
                        }}
                      >
                        {msg.Message}
                      </p>

                      {/* Time */}
                      <p
                        style={{
                          fontSize: "9px",
                          opacity: 0.7,
                          marginTop: "4px",
                          marginBottom: 0,
                          textAlign: isUser ? "right" : "left",
                          color: isUser ? "#e9d5ff" : "var(--text-3)",
                        }}
                      >
                        {msg.ReplyDate}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  color: "var(--text-3)",
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                No conversation found
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "16px" }}>
            <button className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}