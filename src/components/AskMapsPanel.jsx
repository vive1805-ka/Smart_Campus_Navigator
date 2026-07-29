import { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  Sparkles,
  X,
  RotateCcw,
  ArrowUp,
  Plus,
  MessageSquare,
  Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Simulated AI
   ═══════════════════════════════════════════ */

const DEFAULT_SUGGESTIONS = [
  "What can Ask Maps help me with today?",
  "How's the traffic on my commute?",
  "Fun things to do this weekend",
  "Best dosa within a 15 min drive",
  "Plan a tour of historic places nearby",
];

const AI_RESPONSES = {
  "What can Ask Maps help me with today?":
    "I can help you with a lot! Here are a few things:\n\n• **Navigate** to any destination with real-time traffic\n• **Discover** restaurants, cafés, and attractions nearby\n• **Plan trips** with multi-stop routes and estimated times\n• **Check traffic** conditions on your commute\n• **Find** parking, gas stations, and EV chargers\n\nJust ask me anything about places, directions, or things to do! 🗺️",
  "How's the traffic on my commute?":
    "Based on current conditions along your typical route:\n\n🟢 **OMR (IT Expressway)** — Light traffic, flowing smoothly\n🟡 **Anna Salai** — Moderate congestion near Teynampet\n🔴 **Mount Road Junction** — Heavy traffic, expect 12 min delay\n\n**Estimated commute time:** 35 minutes (8 min longer than usual)\n\n💡 *Tip: Leaving in 20 minutes could save you ~10 minutes.*",
  "Fun things to do this weekend":
    "Here are some great options for this weekend in Chennai! 🎉\n\n1. **Marina Beach sunrise walk** — Best before 6:30 AM\n2. **DakshinaChitra Heritage Museum** — Art & culture exhibits\n3. **VGP Universal Kingdom** — Amusement park on ECR\n4. **San Thome Cathedral** — Beautiful neo-Gothic architecture\n5. **Elliot's Beach** — Quieter alternative with great food stalls\n\nWant me to plan a route covering any of these?",
  "Best dosa within a 15 min drive":
    "Here are the top-rated dosa spots near you: 🥞\n\n1. **Murugan Idli Shop** ⭐ 4.5 — 8 min drive\n   _Famous for their ghee roast dosa_\n2. **Saravana Bhavan** ⭐ 4.3 — 11 min drive\n   _Classic masala dosa with sambar_\n3. **Ratna Cafe** ⭐ 4.6 — 13 min drive\n   _Legendary ghee podi dosa since 1948_\n4. **Hotel Vasanta Bhavan** ⭐ 4.2 — 6 min drive\n   _Great butter dosa, very affordable_\n\nWant directions to any of these?",
  "Plan a tour of historic places nearby":
    "Here's a curated historic tour of Chennai! 🏛️\n\n**Morning (9 AM – 12 PM)**\n1. Fort St. George — India's first English fortress\n2. Government Museum — One of the oldest in India\n\n**Afternoon (12:30 – 4 PM)**\n3. Kapaleeshwarar Temple — Stunning Dravidian architecture\n4. San Thome Basilica — Built over the tomb of St. Thomas\n\n**Evening (4:30 – 7 PM)**\n5. Vivekanandar Illam — Beautiful ice house by the sea\n6. Marina Beach walk at sunset\n\n**Total distance:** ~18 km | **Estimated time:** 6 hours with stops\n\nShall I create turn-by-turn directions for this tour?",
};

function getAIResponse(question) {
  if (AI_RESPONSES[question]) return AI_RESPONSES[question];
  const lower = question.toLowerCase();
  if (lower.includes("direction") || lower.includes("route") || lower.includes("navigate"))
    return "I'd be happy to help with directions! 🧭\n\nTo get started, could you tell me:\n1. Where are you starting from?\n2. Where would you like to go?\n\nI can optimize for fastest route, least traffic, or walking distance.";
  if (lower.includes("restaurant") || lower.includes("food") || lower.includes("eat"))
    return "Let me find some great food options near you! 🍽️\n\nI found several highly-rated restaurants within 15 minutes. What cuisine are you in the mood for?\n\n• South Indian\n• North Indian\n• Chinese\n• Continental\n• Street Food";
  if (lower.includes("thank"))
    return "You're welcome! 😊 Feel free to ask me anything else about places, directions, or things to do around you. Happy exploring! 🗺️";
  return "That's a great question! 🤔\n\nI can help you explore places, get directions, check traffic, and discover things to do. Could you give me a bit more detail about what you're looking for?\n\nFor example:\n• A specific type of place (restaurants, parks, museums)\n• Directions to somewhere\n• Things to do in a specific area";
}

/* ═══════════════════════════════════════════
   AskMapsPanel — Chat-only panel content
   ═══════════════════════════════════════════ */

export default function AskMapsPanel() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const hasMessages = messages.length > 0;

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  /* ── Send message ── */
  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || inputValue).trim();
      if (!trimmed || isTyping) return;
      setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
      setInputValue("");
      setIsTyping(true);
      setShowHistory(false);
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        const reply = getAIResponse(trimmed);
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: reply }]);
        setIsTyping(false);
      }, delay);
    },
    [inputValue, isTyping]
  );

  const startNewChat = useCallback(() => {
    if (messages.length > 0) {
      setConversations((prev) => [
        ...prev,
        { id: Date.now(), title: messages[0]?.text?.slice(0, 50) || "Conversation", messages: [...messages], timestamp: new Date() },
      ]);
    }
    setMessages([]);
    setShowHistory(false);
    setInputValue("");
  }, [messages]);

  const restoreConversation = useCallback((conv) => {
    setMessages(conv.messages);
    setShowHistory(false);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" aria-label="Menu">
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-gray-800 flex items-center gap-1.5">
            Ask Maps
            <Sparkles size={14} className="text-blue-500" />
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {hasMessages && (
            <button onClick={startNewChat} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" aria-label="New chat" title="New chat">
              <Plus size={18} />
            </button>
          )}
          <button onClick={() => setShowHistory((p) => !p)} className={`p-1.5 rounded-full transition-colors cursor-pointer ${showHistory ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`} aria-label="History" title="Chat history">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 mx-3" />

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-y-auto">
        {showHistory ? (
          <HistoryView conversations={conversations} onRestore={restoreConversation} onNewChat={startNewChat} />
        ) : hasMessages ? (
          <div className="px-4 py-4 space-y-4">
            {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <EmptyState suggestions={DEFAULT_SUGGESTIONS} onSuggestionClick={sendMessage} />
        )}
      </div>

      {/* ─── Chat Input ─── */}
      {!showHistory && (
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="relative flex items-end bg-white rounded-3xl border border-gray-200
                       shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all duration-200"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400
                         outline-none border-none px-4 py-3 max-h-[120px] leading-relaxed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 mb-2 transition-all duration-200 cursor-pointer ${
                inputValue.trim() && !isTyping
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Send"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Sub-components (kept local)
   ═══════════════════════════════════════════ */

function EmptyState({ suggestions, onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center px-5 pt-12 pb-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-500 mb-2">Hi</h2>
        <p className="text-sm text-gray-400">Ask anything, about anywhere.</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-2.5">
        {suggestions.map((text, i) => {
          const isLast = i === suggestions.length - 1 && suggestions.length % 2 !== 0;
          return (
            <button key={i} onClick={() => onSuggestionClick(text)} className={`text-left text-[13px] leading-snug text-gray-600 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 hover:bg-blue-50/60 hover:border-blue-200 hover:text-gray-800 transition-all duration-200 cursor-pointer shadow-sm hover:shadow ${isLast ? "col-span-2" : ""}`}>
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-blue-600 text-white rounded-br-md" : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"}`}>
        <FormattedText text={message.text} isUser={isUser} />
      </div>
    </div>
  );
}

function FormattedText({ text, isUser }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n");
        return (
          <div key={pi}>
            {lines.map((line, li) => {
              const formatted = line.split(/(\*\*[^*]+\*\*)/).map((seg, si) => {
                if (seg.startsWith("**") && seg.endsWith("**"))
                  return <strong key={si} className={isUser ? "font-semibold" : "font-semibold text-gray-900"}>{seg.slice(2, -2)}</strong>;
                if (seg.startsWith("_") && seg.endsWith("_"))
                  return <em key={si} className="opacity-80">{seg.slice(1, -1)}</em>;
                return seg;
              });
              return <p key={li} className={li > 0 ? "mt-0.5" : ""}>{formatted}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
        <Loader2 size={14} className="text-blue-500 animate-spin" />
        <span className="text-sm text-gray-400">Thinking…</span>
      </div>
    </div>
  );
}

function HistoryView({ conversations, onRestore, onNewChat }) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Recent Conversations</h3>
        <button onClick={onNewChat} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer">
          <Plus size={14} /> New chat
        </button>
      </div>
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No conversations yet</p>
          <p className="text-xs text-gray-300 mt-1">Your Ask Maps conversations will appear here</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button key={conv.id} onClick={() => onRestore(conv)} className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50/60 transition-colors group cursor-pointer">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <MessageSquare size={14} className="text-gray-500 group-hover:text-blue-600" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate font-medium">{conv.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{conv.messages.length} messages · {formatTimeAgo(conv.timestamp)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
