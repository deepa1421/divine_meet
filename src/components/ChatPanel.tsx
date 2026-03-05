// ============================================================
// ChatPanel.tsx
//
// Yeh sirf UI ka zimma sambhalta hai 🎨
// Koi LLM logic ya constants yahan nahi hain —
// sab kuch panditResponses.ts se import hota hai.
//
// Do tabs hain:
//   💬 Comments → Public devotee stream + user comment box
//   📖 Pandit Ji → Private AI chat with intent detection
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Users, MessageCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

// Saare types, constants aur LLM functions ek hi jagah se aate hain
import {
  type DeityType,
  type IntentType,
  type Message,
  type ConversationTurn,
  SATSANG_INFO,
  INTENT_LABELS,
  DEVOTEE_LINES,
  SAMPLE_DEVOTEE_NAMES,
  detectIntent,
  getPanditReply,
} from "../lib/panditResponses";

import { logToGoogleSheets } from "../lib/googleSheets";

/* ---------- Props ---------- */

interface ChatPanelProps {
  deity: DeityType;
  // Optional: DevoteeMessages headless component se aane wale messages
  externalMessages?: Message[];
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function ChatPanel({ deity, externalMessages = [] }: ChatPanelProps) {

  // Current deity ka satsang info shortcut
  const info = SATSANG_INFO[deity];

  /* ---------- Tab State ---------- */
  // "comments" = public devotee chat | "pandit" = private AI chat
  const [activeTab, setActiveTab] = useState<"comments" | "pandit">("comments");

  /* ---------- Comments Tab State ---------- */

  // Comments tab ke saare messages — pehla message pandit ji ka greeting hota hai
  const [commentMessages, setCommentMessages] = useState<Message[]>([
    {
      id: "greeting-comment",
      text: info.greeting,
      sender: "pandit",
      timestamp: new Date(),
    },
  ]);

  // User ka comment input
  const [commentInput, setCommentInput] = useState("");

  /* ---------- Pandit Chat Tab State ---------- */

  // Pandit tab ke messages — pehla message Pandit Ji ka welcome hota hai
  const [panditMessages, setPanditMessages] = useState<Message[]>([
    {
      id: "pandit-greeting",
      text: `🙏 Pranam! Main aapka AI Pandit Ji hoon — ${info.name} mein aapka swagat hai. Koi bhi prashn poochhen, mantra ka arth jaanein, ya apni manokamna share karein. Main yahan hoon! ${info.emoji}`,
      sender: "pandit",
      timestamp: new Date(),
    },
  ]);

  // Poori conversation history — multi-turn LLM context ke liye
  // Har successful exchange ke baad update hoti hai
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);

  // Pandit tab ka input field
  const [panditInput, setPanditInput] = useState("");

  /* ---------- Shared State ---------- */

  // LLM call ho rahi hai ya nahi — loading indicator ke liye
  const [isLoading, setIsLoading] = useState(false);

  // Fluctuating online count — real satsang jaisa feel
  const [onlineCount, setOnlineCount] = useState(info.baseOnline);

  // Scroll references — naye messages pe auto-scroll karne ke liye
  const commentScrollRef = useRef<HTMLDivElement>(null);
  const panditScrollRef = useRef<HTMLDivElement>(null);

  /* ──────────────────────────────────────────
     Effects
     ────────────────────────────────────────── */

  /**
   * Jab deity badle — dono tabs reset ho jaate hain.
   * Nayi deity ka greeting, nayi history, nayi online count.
   */
  useEffect(() => {
    const newInfo = SATSANG_INFO[deity];

    setCommentMessages([
      {
        id: "greeting-comment",
        text: newInfo.greeting,
        sender: "pandit",
        timestamp: new Date(),
      },
    ]);

    setPanditMessages([
      {
        id: "pandit-greeting",
        text: `🙏 Pranam! Main aapka AI Pandit Ji hoon — ${newInfo.name} mein aapka swagat hai. Koi bhi prashn poochhen, mantra ka arth jaanein, ya apni manokamna share karein. Main yahan hoon! ${newInfo.emoji}`,
        sender: "pandit",
        timestamp: new Date(),
      },
    ]);

    // Naya deity change hone par conversation history clear karo
    setConversationHistory([]);
    setOnlineCount(newInfo.baseOnline + Math.floor(Math.random() * 25));
  }, [deity]);

  /**
   * Bahar se aane wale devotee messages (DevoteeMessages component se)
   * seedha comments tab mein add ho jaate hain.
   */
  useEffect(() => {
    if (externalMessages.length > 0) {
      setCommentMessages((prev) => [...prev, ...externalMessages]);
    }
  }, [externalMessages]);

  /**
   * Auto-generated devotee comments — har 12 second par ek comment.
   * Agar DevoteeMessages component connected nahi hai toh bhi satsang live lagti hai.
   * Online count bhi thoda fluctuate karta rehta hai.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const lines = DEVOTEE_LINES[deity];
      const randomMsg = lines[Math.floor(Math.random() * lines.length)];
      const randomName = SAMPLE_DEVOTEE_NAMES[Math.floor(Math.random() * SAMPLE_DEVOTEE_NAMES.length)];

      setCommentMessages((prev) => [
        ...prev,
        {
          id: `auto-${Date.now()}`,
          text: randomMsg,
          sender: "devotee",
          senderName: `🙏 ${randomName}`,
          timestamp: new Date(),
        },
      ]);

      // +1 ya -1 — thoda realistic fluctuation
      setOnlineCount((c) => Math.max(10, c + Math.floor(Math.random() * 3) - 1));
    }, 12000);

    return () => clearInterval(interval);
  }, [deity]);

  // Comments scroll — naya message aane par neeche scroll karo
  useEffect(() => {
    commentScrollRef.current?.scrollTo({
      top: commentScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [commentMessages]);

  // Pandit chat scroll — naya reply aane par neeche scroll karo
  useEffect(() => {
    panditScrollRef.current?.scrollTo({
      top: panditScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [panditMessages]);

  /* ──────────────────────────────────────────
     Handlers
     ────────────────────────────────────────── */

  /**
   * postComment()
   * User ka comment turant comments tab mein add karta hai — no LLM needed.
   */
  const postComment = () => {
    const text = commentInput.trim();
    if (!text) return;

    setCommentMessages((prev) => [
      ...prev,
      {
        id: `user-comment-${Date.now()}`,
        text,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setCommentInput("");
  };

  /**
   * sendToPandit()
   * 2-step LLM pipeline:
   *   Step 1 → detectIntent(text)         — panditResponses.ts
   *   Step 2 → getPanditReply(...)         — panditResponses.ts
   * Dono functions panditResponses.ts se imported hain — yahan sirf call hota hai.
   */
  const sendToPandit = async () => {
    const text = panditInput.trim();
    if (!text || isLoading) return;

    // User ka message turant dikhao — optimistic UI
    const userMsg: Message = {
      id: `user-pandit-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setPanditMessages((prev) => [...prev, userMsg]);
    setPanditInput("");
    setIsLoading(true);

    try {
      // Step 1: Intent pata karo (fast lightweight call)
      const detectedIntent: IntentType = await detectIntent(text);

      // Step 2: Intent + deity + history ke saath Pandit Ji ka jawab lao
      const reply = await getPanditReply(text, detectedIntent, deity, conversationHistory);

      // Future turns ke liye history update karo
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: reply },
      ]);

      // Pandit Ji ka reply add karo — intent badge bhi saath mein
      setPanditMessages((prev) => [
        ...prev,
        {
          id: `pandit-reply-${Date.now()}`,
          text: reply,
          sender: "pandit",
          timestamp: new Date(),
          intent: detectedIntent,
        },
      ]);

      // 📝 Log to Google Sheets
      logToGoogleSheets({
        userMessage: text,
        aiResponse: reply,
        deity: deity,
        intent: detectedIntent,
      });

    } catch {
      toast.error("Pandit Ji se connect nahi ho pa raha. Please try again 🙏");
    } finally {
      setIsLoading(false);
    }
  };

  /* ──────────────────────────────────────────
     UI Helper
     ────────────────────────────────────────── */

  /**
   * renderMessage()
   * Ek message bubble render karta hai.
   * @param showIntent - true hone par pandit reply ke upar intent badge dikhta hai
   */
  const renderMessage = (msg: Message, showIntent: boolean) => (
    <div
      key={msg.id}
      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm shadow-2xl backdrop-blur-2xl border transition-all hover:scale-[1.02] ${msg.sender === "user"
          ? "bg-gradient-to-br from-primary to-saffron text-primary-foreground rounded-br-none border-white/20 shadow-[0_8px_20px_-4px_rgba(255,165,0,0.4)]"
          : msg.sender === "devotee"
            ? "bg-white/5 text-foreground rounded-bl-none border-white/10"
            : "bg-gradient-to-br from-secondary/40 to-secondary/80 text-secondary-foreground rounded-bl-none border-white/20 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.3)]"
          }`}
      >
        {/* Pandit Ji label — deity naam ke saath */}
        {msg.sender === "pandit" && (
          <span
            className="text-[10px] font-black uppercase tracking-[0.15em] block mb-1.5 opacity-80"
            style={{ color: info.accentColor }}
          >
            {info.emoji} Pandit Ji — {info.name}
          </span>
        )}

        {/* Intent badge — sirf pandit tab replies mein dikhta hai */}
        {showIntent && msg.sender === "pandit" && msg.intent && (
          <span
            className="text-[9px] font-black uppercase tracking-wider rounded-full px-2 py-0.5 mb-2 inline-block shadow-sm"
            style={{
              background: `${INTENT_LABELS[msg.intent].color}33`,
              color: INTENT_LABELS[msg.intent].color,
              border: `1px solid ${INTENT_LABELS[msg.intent].color}66`,
            }}
          >
            {INTENT_LABELS[msg.intent].label}
          </span>
        )}

        {/* Devotee naam */}
        {msg.sender === "devotee" && msg.senderName && (
          <span
            className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-70"
            style={{ color: info.accentColor }}
          >
            {msg.senderName}
          </span>
        )}

        {/* Message text */}
        <span className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</span>

        {/* Timestamp — chhota aur subtle */}
        <span className="text-[9px] opacity-40 block mt-1.5 text-right font-bold uppercase tracking-tighter">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );

  /* ──────────────────────────────────────────
     Render
     ────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl border-l border-white/5 shadow-2xl overflow-hidden relative">

      {/* ── Background Subtle Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-30 animate-pulse"
          style={{ background: info.accentColor }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 blur-[120px] rounded-full opacity-20"
          style={{ background: info.accentColor }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 px-5 py-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse shadow-[0_0_10px_0_rgba(239,68,68,0.5)]" />
            <div>
              <h3 className="font-display font-black text-xs tracking-[0.1em] text-primary uppercase">
                {info.name}
              </h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Satsang Live Stream</p>
            </div>
          </div>

          {/* Online count badge */}
          <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1 uppercase scale-90">
            <Users size={10} />
            <span>{onlineCount} JOINED</span>
          </span>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1.5 bg-black/40 border border-white/5 rounded-2xl p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl py-2.5 transition-all duration-300 ${activeTab === "comments"
              ? "bg-primary text-white shadow-[0_4px_12px_0_rgba(255,165,0,0.4)] scale-[1.02]"
              : "text-white/40 hover:text-white/70"
              }`}
          >
            <MessageCircle size={13} />
            COMMENTS
          </button>

          <button
            onClick={() => setActiveTab("pandit")}
            className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl py-2.5 transition-all duration-300 ${activeTab === "pandit"
              ? "bg-primary text-white shadow-[0_4px_12px_0_rgba(255,165,0,0.4)] scale-[1.02]"
              : "text-white/40 hover:text-white/70"
              }`}
          >
            <BookOpen size={13} />
            PANDIT JI
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "comments" ? (

        /* ── Comments Tab ── */
        <>
          <div ref={commentScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            <div className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2 px-4 bg-white/5 rounded-xl border border-white/5 mb-4 italic">
              ✨ Share your blessings with other devotees
            </div>
            {commentMessages.map((msg) => renderMessage(msg, false))}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl group">
            <div className="flex gap-2 relative">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && postComment()}
                placeholder={`${info.emoji} Blessings...`}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-white/20 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
              />
              <button
                onClick={postComment}
                disabled={!commentInput.trim()}
                className="bg-primary text-white p-3 rounded-2xl disabled:opacity-20 transition-all active:scale-95 shadow-[0_4px_12px_0_rgba(255,165,0,0.4)] hover:shadow-[0_4px_20px_0_rgba(255,165,0,0.6)]"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] font-black uppercase tracking-tighter text-white/20 mt-2.5 text-center">
              Tap enter to post your blessing 🙏
            </p>
          </div>
        </>

      ) : (

        /* ── Pandit Ji Tab ── */
        <>
          <div ref={panditScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            <div className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2 px-4 bg-white/5 rounded-xl border border-white/5 mb-4 italic">
              🕉️ Spiritual Guidance powered by Pandit Ji
            </div>
            {panditMessages.map((msg) => renderMessage(msg, true))}

            {/* Typing indicator — LLM respond kar raha hai tab */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-5 py-3 text-sm flex items-center gap-3 backdrop-blur-md shadow-xl">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                    Pandit Ji thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl group">
            <div className="flex gap-2 relative">
              <input
                value={panditInput}
                onChange={(e) => setPanditInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendToPandit()}
                placeholder="Ask Pandit Ji anything..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-white/20 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest disabled:opacity-30"
              />
              <button
                onClick={sendToPandit}
                disabled={isLoading || !panditInput.trim()}
                className="bg-primary text-white p-3 rounded-2xl disabled:opacity-20 transition-all active:scale-95 shadow-[0_4px_12px_0_rgba(255,165,0,0.4)] hover:shadow-[0_4px_20px_0_rgba(255,165,0,0.6)]"
              >
                {isLoading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <Send size={18} />
                }
              </button>
            </div>
            <p className="text-[9px] font-black uppercase tracking-tighter text-white/20 mt-2.5 text-center">
              🤖 Divine AI • Intent automatically detected
            </p>
          </div>
        </>
      )}
    </div>
  );
}
