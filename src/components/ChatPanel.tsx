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
      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm ${msg.sender === "user"
          ? "bg-primary text-primary-foreground rounded-br-none"
          : msg.sender === "devotee"
            ? "bg-muted text-foreground rounded-bl-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none border border-border"
          }`}
      >
        {/* Pandit Ji label — deity naam ke saath */}
        {msg.sender === "pandit" && (
          <span
            className="text-xs font-semibold block mb-1"
            style={{ color: info.accentColor }}
          >
            {info.emoji} Pandit Ji — {info.name}
          </span>
        )}

        {/* Intent badge — sirf pandit tab replies mein dikhta hai */}
        {showIntent && msg.sender === "pandit" && msg.intent && (
          <span
            className="text-[10px] font-medium rounded-full px-2 py-0.5 mb-1 inline-block"
            style={{
              background: `${INTENT_LABELS[msg.intent].color}22`,
              color: INTENT_LABELS[msg.intent].color,
              border: `1px solid ${INTENT_LABELS[msg.intent].color}44`,
            }}
          >
            {INTENT_LABELS[msg.intent].label}
          </span>
        )}

        {/* Devotee naam */}
        {msg.sender === "devotee" && msg.senderName && (
          <span
            className="text-[11px] font-semibold block mb-0.5"
            style={{ color: info.accentColor }}
          >
            {msg.senderName}
          </span>
        )}

        {/* Message text */}
        <span className="leading-relaxed whitespace-pre-wrap">{msg.text}</span>

        {/* Timestamp — chhota aur subtle */}
        <span className="text-[10px] opacity-40 block mt-1 text-right">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );

  /* ──────────────────────────────────────────
     Render
     ────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">

      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm text-primary leading-tight">
              {info.emoji} {info.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">Live Satsang</p>
          </div>

          {/* Online count badge */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#22c55e" }}
            />
            <Users size={11} />
            <span>{onlineCount} online</span>
          </span>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-md py-1.5 transition-all ${activeTab === "comments"
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <MessageCircle size={12} />
            Comments
          </button>

          <button
            onClick={() => setActiveTab("pandit")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-md py-1.5 transition-all ${activeTab === "pandit"
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <BookOpen size={12} />
            Pandit Ji
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "comments" ? (

        /* ── Comments Tab ── */
        <>
          <div ref={commentScrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-center text-[11px] text-muted-foreground py-1 px-2 bg-muted/50 rounded-lg">
              💬 Public satsang comments — sabhi devotees yahan share kar sakte hain
            </div>
            {commentMessages.map((msg) => renderMessage(msg, false))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && postComment()}
                placeholder={`${info.emoji} Share your blessings...`}
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={postComment}
                disabled={!commentInput.trim()}
                className="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-40 transition-opacity"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
              Enter dabao ya button click karo to post
            </p>
          </div>
        </>

      ) : (

        /* ── Pandit Ji Tab ── */
        <>
          <div ref={panditScrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-center text-[11px] text-muted-foreground py-1 px-2 bg-muted/50 rounded-lg">
              🛕 AI Pandit Ji se seedha baat karein — prashn, mantra, ya apni baat
            </div>
            {panditMessages.map((msg) => renderMessage(msg, true))}

            {/* Typing indicator — LLM respond kar raha hai tab */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-xl rounded-bl-none px-4 py-2.5 text-sm flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="text-muted-foreground text-xs">
                    Pandit Ji soch rahe hain...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={panditInput}
                onChange={(e) => setPanditInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendToPandit()}
                placeholder="Koi bhi prashn poochhen Pandit Ji se..."
                disabled={isLoading}
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
              <button
                onClick={sendToPandit}
                disabled={isLoading || !panditInput.trim()}
                className="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-40 transition-opacity"
              >
                {isLoading
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Send size={15} />
                }
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
              🤖 AI-powered • Intent automatically detect hota hai
            </p>
          </div>
        </>
      )}
    </div>
  );
}