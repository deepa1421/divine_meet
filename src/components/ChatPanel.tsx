import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

/* ---------- Message Interface ---------- */
interface Message {
  id: string;
  text: string;
  sender: "user" | "pandit" | "devotee";
  senderName?: string;
  timestamp: Date;
}

/* ---------- Props Interface ---------- */
interface ChatPanelProps {
  deity: "shiva" | "hanuman" | "gayatri";
}

/* ---------- Component ---------- */
export default function ChatPanel({ deity }: ChatPanelProps) {

  

  /* ------------------ Greeting ------------------ */

  const GREETINGS = {
    hanuman:
      "🙏 जय श्री राम! Welcome to the Hanuman Chalisa satsang.",
    shiva:
      "🔱 हर हर महादेव! Welcome to the Maha Mrityunjay Jaap.",
    gayatri:
      "🌺 जय माता गायत्री! Welcome to the Gayatri Mantra chanting session.",
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      text: GREETINGS[deity],
      sender: "pandit",
      timestamp: new Date(),
    },
  ]);

  /* Update greeting when deity changes */
  useEffect(() => {
    setMessages([
      {
        id: "greeting",
        text: GREETINGS[deity],
        sender: "pandit",
        timestamp: new Date(),
      },
    ]);
  }, [deity]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ------------------ Dynamic Online Count ------------------ */

  useEffect(() => {
    const base =
      deity === "hanuman" ? 108 :
      deity === "shiva" ? 84 :
      64;

    setOnlineCount(base + Math.floor(Math.random() * 25));
  }, [deity]);

  /* ------------------ Devotee Messages ------------------ */

  useEffect(() => {
    const interval = setInterval(() => {
      const devoteeLines = {
        hanuman: [
          "🙏 जय बजरंगबली!",
          "संकट मोचन हनुमान की जय!",
          "जय श्री राम!"
        ],
        shiva: [
          "🔱 हर हर महादेव!",
          "ॐ नमः शिवाय",
          "महादेव की कृपा बनी रहे 🙏"
        ],
        gayatri: [
          "🌺 ॐ भूर्भुवः स्वः",
          "जय माता गायत्री",
          "गायत्री माता की जय 🙏"
        ],
      };

      const names = ["Ramesh", "Sita", "Aman", "Kavita", "Vikram", "Priya","Rahul", "Anjali", "Suresh", "Pooja","Amit", "Neha", "Sunil", "Divya", "Rohit", "Sneha","Manish", "Pooja", "Sanjay", "Anita","Ashish", "Kiran", "Vijay", "Meena"];

      const randomMsg =
        devoteeLines[deity][
          Math.floor(Math.random() * devoteeLines[deity].length)
        ];

      const randomName =
        names[Math.floor(Math.random() * names.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: randomMsg,
          sender: "devotee",
          senderName: randomName,
          timestamp: new Date(),
        },
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, [deity]);

  /* ------------------ Auto Scroll ------------------ */

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ------------------ Send Message ------------------ */

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "🙏 Blessings upon you.",
          sender: "pandit",
          timestamp: new Date(),
        },
      ]);
    } catch (e: any) {
      toast.error("Failed to respond");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">

      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-primary">
            💬 Live Satsang Chat
          </h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={12} />
            <span>{onlineCount} online</span>
          </span>
        </div>
        
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : msg.sender === "devotee"
                  ? "bg-muted text-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {msg.sender === "pandit" && (
                <span className="text-xs font-display text-primary block mb-1">
                  🙏 AI Pandit
                </span>
              )}
              {msg.sender === "devotee" && msg.senderName && (
                <span className="text-xs font-semibold text-accent block mb-0.5">
                  {msg.senderName}
                </span>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prayer..."
            disabled={isLoading}
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground p-2 rounded-lg"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}