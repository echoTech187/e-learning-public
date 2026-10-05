"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/app/actions/chatActions";

export default function ChatMentorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, sender: "user" | "mentor", text: string, time: string}[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen || messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend.trim();
    const newMsg = {
      id: Date.now(),
      sender: "user" as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));
    history.push({ role: "user", content: userText });

    const result = await sendChatMessage(history);
    
    setIsLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "mentor",
        text: result.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const quickReplies = [
    "Cara daftar kursus",
    "Metode pembayaran",
    "Jadwal mentoring",
    "Sambungkan ke CS"
  ];

  const chatContent = (
    <div className="elegant-card d-flex flex-column w-100 h-100 bg-white shadow-sm overflow-hidden" style={{ borderRadius: "1.25rem", border: "1px solid rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white" style={{ minHeight: "68px" }}>
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-xs" style={{ width: "38px", height: "38px", fontSize: "0.95rem" }}>
              AI
            </div>
            <span
              className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
              style={{ width: "10px", height: "10px" }}
            ></span>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.92rem" }}>EduBot (AI Chat)</h6>
            <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: "0.72rem", fontWeight: 500 }}>
              <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
              Online
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-light border-0 d-lg-none rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={() => setIsOpen(false)}
            aria-label="Tutup Chat"
          >
            <i className="fas fa-times text-muted"></i>
          </button>
          <button type="button" className="btn btn-sm btn-light border-0 d-none d-lg-inline-block rounded-circle" aria-label="Opsi">
            <i className="fas fa-ellipsis-h text-muted"></i>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="p-3 p-sm-4 flex-grow-1 d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: "420px", background: "#fcfdfe" }}>
        {messages.length === 0 && !isLoading && (
           <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted" style={{ opacity: 0.6 }}>
             <i className="fas fa-comments fs-2 mb-2"></i>
             <p className="mb-0" style={{ fontSize: "0.85rem" }}>Mulai percakapan dengan EduBot</p>
           </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex flex-column gap-1 ${msg.sender === "user" ? "align-items-end mt-1" : "align-items-start"}`}
          >
            <div
              className={`p-3 rounded-4 ${
                msg.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-light text-dark border"
              }`}
              style={{
                maxWidth: "85%",
                fontSize: "0.85rem",
                lineHeight: "1.45",
                borderTopRightRadius: msg.sender === "user" ? "4px" : "1rem",
                borderTopLeftRadius: msg.sender === "mentor" ? "4px" : "1rem",
                borderColor: msg.sender === "user" ? "transparent" : "#e2e8f0",
                boxShadow: msg.sender === "user" ? "0 4px 12px rgba(79, 70, 229, 0.2)" : "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
            {mounted && msg.time && (
              <span className={`text-muted ${msg.sender === "user" ? "me-1" : "ms-1"}`} style={{ fontSize: "0.68rem" }}>
                {msg.time}
              </span>
            )}
          </div>
        ))}
        


        {isLoading && (
          <div className="d-flex flex-column gap-1 align-items-start">
             <div className="p-3 rounded-4 bg-light text-dark border d-flex align-items-center gap-2" style={{ borderTopLeftRadius: "4px" }}>
               <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
               <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ animationDelay: "0.2s" }}></div>
               <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ animationDelay: "0.4s" }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 border-top mt-auto bg-white d-flex flex-column gap-2">
        {/* Quick Replies */}
        {!isLoading && (
          <div className="d-flex gap-2 chat-quick-replies pb-2" style={{ overflowX: "auto" }}>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill bg-white text-primary fw-medium flex-shrink-0"
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.8rem", borderColor: "rgba(79, 70, 229, 0.3)", transition: "all 0.2s" }}
                onClick={() => sendMessage(reply)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(79, 70, 229, 0.05)";
                  e.currentTarget.style.borderColor = "#4f46e5";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.3)";
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="d-flex align-items-center bg-light rounded-pill px-3 py-1.5 border" style={{ borderColor: "#e2e8f0" }}>
          <input
            id="chat-mentor-input"
            name="chat-mentor-input"
            type="text"
            className="border-0 bg-transparent flex-grow-1 shadow-none py-1"
            placeholder="Ketik pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            style={{ fontSize: "0.85rem", outline: "none" }}
          />
          <button type="submit" className="btn p-0 border-0 ms-2 text-primary" disabled={!inputText.trim() || isLoading} aria-label="Kirim Pesan">
            <i className="fas fa-paper-plane" style={{ fontSize: "0.95rem" }}></i>
          </button>
        </form>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="d-none d-lg-flex flex-column gap-4 sticky-top" style={{ top: "1.5rem", zIndex: 10, height: "596px" }}>
        {chatContent}
      </div>

      <div className="d-lg-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn position-fixed d-flex align-items-center justify-content-center shadow-lg rounded-circle"
          style={{
            bottom: "22px",
            right: "20px",
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            color: "white",
            zIndex: 1040,
            border: "2px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 12px 28px -4px rgba(79, 70, 229, 0.45)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isOpen ? "scale(0.95)" : "scale(1)",
          }}
          aria-label="Chat dengan AI"
        >
          {isOpen ? (
            <i className="fas fa-times fs-5"></i>
          ) : (
            <div className="position-relative d-flex align-items-center justify-content-center">
              <i className="fas fa-robot fs-5"></i>
              <span
                className="position-absolute rounded-circle bg-success border border-white"
                style={{
                  width: "12px",
                  height: "12px",
                  top: "-6px",
                  right: "-8px",
                }}
              ></span>
            </div>
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{
                zIndex: 1045,
                background: "rgba(15, 23, 42, 0.35)",
                backdropFilter: "blur(2px)",
                animation: "chatBackdropFade 0.2s ease-out",
              }}
              onClick={() => setIsOpen(false)}
            />

            <div
              className="position-fixed shadow-2xl"
              style={{
                bottom: "90px",
                right: "16px",
                left: "16px",
                maxWidth: "380px",
                height: "500px",
                maxHeight: "calc(100vh - 120px)",
                marginLeft: "auto",
                zIndex: 1050,
                borderRadius: "1.25rem",
                overflow: "hidden",
                animation: "chatPopupSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {chatContent}
            </div>
          </>
        )}

        <style>{`
                    .chat-quick-replies::-webkit-scrollbar { height: 4px; }
          .chat-quick-replies::-webkit-scrollbar-track { background: transparent; }
          .chat-quick-replies::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
          .chat-quick-replies::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
          @keyframes chatPopupSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes chatBackdropFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}
