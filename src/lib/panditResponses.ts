// ============================================================
// panditResponses.ts  →  src/lib/panditResponses.ts
//
// Ab yeh file full frontend RAG pipeline use karti hai:
//
//   User Query
//     → detectIntent()          [Groq Llama — fast classification]
//     → retrieveRelevantChunks() [Transformers.js + Cosine Similarity]
//     → getPanditReply()         [Groq Llama — context-aware response]
//
// 100% browser-side RAG with Groq for speed! ⚡
//
// Required env var (.env file mein):
//   VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
// ============================================================

import {
  initVectorstore,
  retrieveRelevantChunks,
  formatContextForLLM,
  isVectorstoreReady,
} from "./vectorstore";

/* ─────────────────────────────────────────────
   1. TYPES
   ───────────────────────────────────────────── */

export type DeityType = "shiva" | "hanuman" | "gayatri" | "ganesh" | "surya" | "guru" | "kalabhairav";

export type IntentType =
  | "greeting"
  | "wish"
  | "prayer_request"
  | "mantra_question"
  | "personal_concern"
  | "assistance"
  | "appreciation"
  | "general";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "pandit" | "devotee";
  senderName?: string;
  timestamp: Date;
  intent?: IntentType;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

/* ─────────────────────────────────────────────
   2. CONSTANTS
   ───────────────────────────────────────────── */

// Groq API Key
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

// Groq OpenAI-compatible endpoint
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Common headers for Groq
const GROQ_HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${GROQ_API_KEY}`,
};

export const SATSANG_INFO: Record<
  DeityType,
  { name: string; greeting: string; emoji: string; accentColor: string; baseOnline: number }
> = {
  surya: {
    name: "Surya Bhagwan Jaap",
    greeting: "☀️ जय सूर्याय नमः! Welcome to the Surya Bhagwan Satsang.",
    emoji: "☀️",
    accentColor: "#f59e0b",
    baseOnline: 50,
  },
  shiva: {
    name: "Maha Mrityunjay Jaap",
    greeting: "🔱 हर हर महादेव! Welcome to the Maha Mrityunjay Jaap.",
    emoji: "🔱",
    accentColor: "#6366f1",
    baseOnline: 84,
  },
  hanuman: {
    name: "Hanuman Chalisa Satsang",
    greeting: "🙏 जय श्री राम! Welcome to the Hanuman Chalisa Satsang.",
    emoji: "🙏",
    accentColor: "#f97316",
    baseOnline: 108,
  },
  ganesh: {
    name: "Ganesh Chaturthi Satsang",
    greeting: "🐘 गणपति बाप्पा मोरया! Welcome to the Ganesh Satsang.",
    emoji: "🐘",
    accentColor: "#ec4899",
    baseOnline: 150,
  },
  guru: {
    name: "Guru Brihaspati Satsang",
    greeting: "🙏 जय गुरुदेव! Welcome to the Guru Brihaspati Satsang.",
    emoji: "🙏",
    accentColor: "#fbbf24",
    baseOnline: 70,
  },
  gayatri: {
    name: "Gayatri Mantra Satsang",
    greeting: "🌺 जय माता गायत्री! Welcome to the Gayatri Mantra Satsang.",
    emoji: "🌺",
    accentColor: "#f59e0b",
    baseOnline: 64,
  },
  kalabhairav: {
    name: "Kalabhairav Ashtakam",
    greeting: "🛡️ जय कालभैरव! Welcome to the Kalabhairav Satsang.",
    emoji: "🛡️",
    accentColor: "#475569",
    baseOnline: 90,
  },
};

export const INTENT_LABELS: Record<IntentType, { label: string; color: string }> = {
  greeting: { label: "👋 Pranam", color: "#10b981" },
  wish: { label: "✨ Wish", color: "#f59e0b" },
  prayer_request: { label: "🙏 Prayer Request", color: "#8b5cf6" },
  mantra_question: { label: "📖 Mantra Query", color: "#3b82f6" },
  personal_concern: { label: "💛 Personal Concern", color: "#f59e0b" },
  assistance: { label: "🤝 Assistance", color: "#6366f1" },
  appreciation: { label: "🌸 Appreciation", color: "#ec4899" },
  general: { label: "💬 General", color: "#6b7280" },
};

export const DEVOTEE_LINES: Record<DeityType, string[]> = {
  surya: [
    "☀️ जय सूर्य देव!", "ॐ घृणि सूर्याय नमः", "Surya Dev ki jai! ☀️",
    "Blessings from the Sun God 🙏", "Jyoti swaroop bhagwan ki jai!",
  ],
  shiva: [
    "🔱 हर हर महादेव!", "ॐ नमः शिवाय", "महादेव की कृपा बनी रहे 🙏",
    "Bholenath ki jai! 🔱", "Mahadev aap sab par kripa karo 🙏",
  ],
  hanuman: [
    "🙏 जय बजरंगबली!", "संकट मोचन हनुमान की जय!", "जय श्री राम! 🚩",
    "Jai Hanuman ji 🙏", "बजरंगबली सबकी रक्षा करें 🙏",
  ],
  ganesh: [
    "🐘 गणपति बाप्पा मोरया!", "मंगल मूर्ति मोरया!", "जय श्री गणेश! 🙏",
    "Ganpati Bappa Moryaya! 🐘", "Vighnaharta sabke dukh haro 🙏",
  ],
  guru: [
    "🙏 जय गुरुदेव!", "गुरु ब्रह्मा गुरु विष्णु...", "Guru kripa hi kevalam 🙏",
    "Jai Brihaspati Dev! 🌟", "Sharanagati Guru charan mein 🙏",
  ],
  gayatri: [
    "🌺 ॐ भूर्भुवः स्वः", "जय माता गायत्री", "गायत्री माता की जय 🙏",
    "Mata rani ki jai 🌺", "Jai Gayatri Mata 🙏✨",
  ],
  kalabhairav: [
    "🛡️ जय कालभैरव!", "ॐ कालभैरवाय नमः", "Bhairav Baba ki jai! 🙏",
    "Dharmarakshaka bhairava 🙏", "Kashi Kotwal ki jai! 🛡️",
  ],
};

export const SAMPLE_DEVOTEE_NAMES: string[] = [
  "Ramesh Sharma", "Sita Verma", "Aman Gupta", "Kavita Singh",
  "Vikram Patel", "Priya Mishra", "Rahul Yadav", "Anjali Pandey",
  "Suresh Kumar", "Pooja Joshi", "Deepak Tiwari", "Meena Agarwal",
];

// Traditional Persona Rules for AI Pandit
const PANDIT_PERSONA = `
- **Tone**: Calm, respectful, and authoritative yet deeply compassionate.
- **Address**: Use "Priya Bhakt", "Vatsa", or "Devotee" with warmth.
- **Vocabulary**: Use "Devotional Hinglish" — Integrate words like:
    - *Shraddha* (Faith), *Sadhana* (Practice), *Kripa* (Grace), *Manokamna* (Wish).
    - *Kalyan* (Blessing), *Satsang* (Spiritual gathering), *Moksha* (Liberation).
- **Structure**: Always start with a relevant traditional blessing (Ashirwad).
- **Empathy**: Validating human emotions (sadness, hope, fear) before providing spiritual guidance.
- **Authenticity**: Speak like a seasoned guide who has spent decades in the temple.
`;

// Deity-specific system prompts — enriched for authenticity
const DEITY_CONTEXT: Record<DeityType, string> = {
  hanuman: `You are a Param Pujya AI Pandit Ji of the Ram-Bhakti parampara.
You are a master of Hanuman's valor and humility from the Ram Charitmanas.
Address the devotee with the warmth of a spiritual elder.
The satsang you are hosting is: "Hanuman Chalisa Satsang".
Use the power of "Bajrangbali" to inspire strength and courage.`,

  shiva: `You are a meditative and wise AI Pandit Ji from the Shaivite tradition.
You carry the stillness of Kailash and the compassion of Mahadev.
Address the devotee with a sense of profound spiritual depth.
The satsang you are hosting is: "Maha Mrityunjay Jaap".
Focus on healing, liberation from fear, and the eternal "Om Namah Shivaya".`,

  gayatri: `You are a serene and scholarly AI Pandit Ji of the Vedic tradition.
You are the carrier of "Veda Mata" Gayatri's light and wisdom.
Address the devotee with clarity and motherly compassion.
The satsang you are hosting is: "Gayatri Mantra Satsang".
Focus on the illumination of the intellect and the 24 syllables' divine power.`,

  ganesh: `You are a joyous and wise AI Pandit Ji of the Ganapatya tradition.
You are the carrier of Lord Ganesha's wisdom, the remover of obstacles (Vighnaharta).
Address the devotee with encouragement and the promise of a smooth beginning.
The satsang you are hosting is: "Ganesh Chaturthi Satsang".
Focus on the "Shree Ganeshaaya Dheemahi" stotram and the power of beginnings.`,

  surya: `You are an illuminated AI Pandit Ji of the Saurya tradition.
You represent the life-giving energy of the Divine Sun, Lord Surya.
The satsang you are hosting is: "Surya Bhagwan Jaap".
Focus on health, vitality, and the removal of darkness from the mind.`,

  guru: `You are a wise AI Pandit Ji of the Guru-Shishya tradition.
You represent the wisdom of Guru Brihaspati.
The satsang you are hosting is: "Guru Brihaspati Satsang".
Focus on knowledge, spiritual guidance, and the importance of a Guru.`,

  kalabhairav: `You are a stern yet protective AI Pandit Ji of the Bhairava tradition.
You represent the guardian of time and Kashi, Lord Kalabhairav.
The satsang you are hosting is: "Kalabhairav Ashtakam".
Focus on discipline, protection from fear, and the transcendence of time.`,
};

// Intent-specific response guidance — modernized for better "Hinglish" flow
const INTENT_GUIDE: Record<IntentType, string> = {
  greeting:
    "Respond with a high-level traditional blessing like 'Sadaa sukhi raho' or 'Kalyan ho'. Invite them warmly into the vibration of the satsang.",
  wish:
    "Validating their desire with spiritual wisdom. Explain that with 'nishkaam bhakti' (selfless devotion), even the impossible becomes possible. Bless their 'manokamna'.",
  prayer_request:
    "Approach this with deep empathy. Assure them that the deity hears every silent whisper. Share a specific mantra context for their protection and relief.",
  mantra_question:
    "Explain with the precision of a teacher. Use the RETRIEVED CONTEXT to break down the Sanskrit meaning (Arth) and its spiritual significance (Mahatmya).",
  personal_concern:
    "This is a delicate moment. Be the wise counselor. Use terms like 'Dhairy' (patience) and 'Ishwar ki kripa'. Connect their struggle to a spiritual teaching.",
  assistance:
    "Guide them with 'Seva' in mind. Explain how this digital satsang is a modern 'Dwar' (gateway) to connect with the divine.",
  appreciation:
    "Accept it as 'Prasad' for the deity. Share the joy of their progress and encourage their 'Sadhana'.",
  general:
    "Keep the devotional essence alive. Even general answers should feel grounded in the deity's presence.",
};

/* ─────────────────────────────────────────────
   3. VECTORSTORE WARM-UP
   ───────────────────────────────────────────── */

export async function warmUpVectorstore(): Promise<void> {
  if (!isVectorstoreReady()) {
    console.log("[PanditResponses] Warming up vectorstore...");
    try {
      await initVectorstore();
      console.log("[PanditResponses] Vectorstore ready ✅");
    } catch (err) {
      console.warn("[PanditResponses] Vectorstore warm-up failed:", err);
    }
  }
}

/* ─────────────────────────────────────────────
   4. LLM + RAG FUNCTIONS
   ───────────────────────────────────────────── */

/**
 * detectIntent()
 * Uses Llama 3.1 8b for fast, bilingual intent classification.
 */
export async function detectIntent(userMessage: string): Promise<IntentType> {
  try {
    if (!GROQ_API_KEY) return "general";

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: GROQ_HEADERS,
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 50,
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `Classify the user's message into exactly ONE of these intents (supports Hindi and English):
- greeting (hi, hello, pranam, namaste)
- wish (make a wish, manokamna, I hope for...)
- prayer_request (pray for me, health issues, help my family)
- mantra_question (meaning of a mantra, how to chant)
- personal_concern (sad, anxiety, losing hope)
- assistance (how to use app, help with tools, assistance needed)
- appreciation (thank you, great app, blessings to you)
- general (anything else)

Reply ONLY with JSON: {"intent": "..."}`,
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!res.ok) return "general";

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? '{"intent":"general"}';
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    const valid: Set<string> = new Set([
      "greeting", "wish", "prayer_request", "mantra_question",
      "personal_concern", "assistance", "appreciation", "general"
    ]);

    return valid.has(parsed.intent) ? (parsed.intent as IntentType) : "general";
  } catch (err) {
    console.error("[detectIntent] Error:", err);
    return "general";
  }
}

/**
 * getPanditReply()
 * Full RAG Pipeline using Groq Llama 3.3 70b.
 */
export async function getPanditReply(
  userMessage: string,
  intent: IntentType,
  deity: DeityType,
  conversationHistory: ConversationTurn[],
): Promise<string> {
  try {
    if (!GROQ_API_KEY) {
      return "🙏 Kripaya .env file mein API key add karein taaki Pandit Ji jawaab de sakein.";
    }

    // 1. Vector Search
    const results = await retrieveRelevantChunks(userMessage, deity, 2);
    const contextText = formatContextForLLM(results);

    // 2. Build Prompt
    const systemPrompt = `${DEITY_CONTEXT[deity]}

═══════════════════════════════════════
PANDIT PERSONA & RULES:
${PANDIT_PERSONA}
═══════════════════════════════════════

═══════════════════════════════════════
RETRIEVED CONTEXT (Scripture):
${contextText}
═══════════════════════════════════════

LANGUAGE NOTE:
The user specifically requested responses in a natural, warm mix of Hindi and English (Hinglish). 
Ensure your "Devotional Hinglish" feels like a real, wise Pandit Ji speaking.

RESPONSE PARAMETERS:
- CURRENT INTENT: ${intent}
- INTENT GUIDE: ${INTENT_GUIDE[intent]}
- Start with a traditional blessing.
- No bullet points.
- Use 🙏 emoji (max 2).
- End with a short blessing like "Jai [Deity]!".
`;

    // 3. Call Groq
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: GROQ_HEADERS,
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.map((h) => ({ role: h.role, content: h.content })),
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[Groq Error]", err);
      return "🙏 Kshama karein, main abhi dhyan mein hoon. Kripaya thodi der baad koshish karein.";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "🙏 Koi sandesh nahi mila.";

  } catch (err) {
    console.error("[Pandit Error]", err);
    return "🙏 Kuch takniki samasya aayi hai. Kripaya punah prayaas karein.";
  }
}