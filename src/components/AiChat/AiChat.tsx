import { useEffect, useRef, useState } from "react";
import "./AiChat.css";
import type { Exhibit } from "../../types";
import { AI_ENDPOINT } from "../../api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type AiChatProps = {
  onResults: (response: string, exhibits: Exhibit[]) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  prefill?: string;
  prefillKey?: number;
};

function AiChat({
  onResults,
  isOpen,
  onToggle,
  prefill,
  prefillKey,
}: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const AI_Icon = `${import.meta.env.BASE_URL}assets/AI icon.svg`;

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen || !prefill) return;
    setInputValue(prefill);
  }, [isOpen, prefill, prefillKey]);

  const sendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    const messageText = inputValue.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText }),
    })
      .then((response) => response.json())
      .then((json) => {
        const replyText =
          typeof json?.response === "string"
            ? json.response
            : "Sorry, I could not find a response.";
        const aiMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: replyText,
        };
        setMessages((prev) => [...prev, aiMessage]);
        onResults(
          replyText,
          Array.isArray(json?.exhibits) ? json.exhibits : [],
        );
      })
      .catch(() => {
        const aiMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: "Something went wrong while contacting the AI service.",
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className={`ai-chat ${isOpen ? "is-open" : ""}`}>
      <button
        className="ai-chat__toggle"
        type="button"
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? "Close" : <img src={AI_Icon} alt="AI" />}
      </button>
      {isOpen && (
        <div className="ai-chat__panel">
          <div className="ai-chat__header">
            <span>AI Search</span>
          </div>
          <div className="ai-chat__messages" ref={messagesRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat__message ai-chat__message--${message.role}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat__message ai-chat__message--assistant">
                <span className="ai-chat__dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
          </div>
          {messages.length === 0 && (
            <div className="ai_info">
              <p className="ai_info_text">
                Chat history will not be preserved. <br /> The AI can make
                mistakes
              </p>
            </div>
          )}
          <form className="ai-chat__form" onSubmit={handleSubmit}>
            <input
              className="ai-chat__input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask for an exhibit..."
              disabled={isLoading}
            />
            <button
              className="ai-chat__send"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AiChat;
