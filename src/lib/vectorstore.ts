// ============================================================
// vectorstore.ts  →  src/lib/vectorstore.ts
//
// Pure browser-side RAG — koi backend nahi! 🚀
//
// Kaise kaam karta hai:
//   1. Transformers.js se multilingual embedding model load karo
//      (paraphrase-multilingual-MiniLM-L12-v2 — ONNX format, ~45MB)
//   2. Pehli baar use hone par saare knowledge chunks embed karo
//   3. Cache karo taaki baar baar embed na karna pade
//   4. User query aayi → embed karo → cosine similarity → top K chunks return karo
//
// Install:
//   npm install @xenova/transformers
// ============================================================

import { pipeline, env } from "@xenova/transformers";
import { ALL_CHUNKS, type KnowledgeChunk } from "./knowledgebase";

// ── Transformers.js Config ──
// Models browser mein cache hote hain (IndexedDB) — ek baar download, hamesha fast
env.allowLocalModels = false; // Sirf CDN se lo
env.useBrowserCache = true;  // Browser cache use karo — repeat loads fast honge

// Model name — multilingual, Hindi + English dono support karta hai ✅
const MODEL_NAME = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

// ── Module-level cache ──
// Puri browser session mein sirf ek baar embed + ek baar model load hoga

// Embedding pipeline — pehli call par initialize hoga
let _embedder: Awaited<ReturnType<typeof pipeline>> | null = null;

// Knowledge base ke pre-computed embeddings — pehli query par compute honge
let _cachedEmbeddings: number[][] | null = null;

// Loading state — duplicate parallel loads se bachao
let _initPromise: Promise<void> | null = null;

/* ─────────────────────────────────────────────
   PUBLIC API
   ───────────────────────────────────────────── */

/**
 * initVectorstore()
 *
 * Vectorstore ko warm up karo:
 *   1. Embedding model download + load karo (first time ~45MB)
 *   2. Saare knowledge chunks embed karo
 *   3. Embeddings memory mein cache karo
 */
export async function initVectorstore(): Promise<void> {
    // Already initialized hai?
    if (_cachedEmbeddings !== null) return;

    // Koi aur already initialize kar raha hai? — Us promise ka wait karo
    if (_initPromise !== null) return _initPromise;

    // Initialize karna shuru karo
    _initPromise = _doInit();
    return _initPromise;
}

/**
 * retrieveRelevantChunks()
 *
 * User query ke liye sabse relevant knowledge chunks dhundho.
 */
export async function retrieveRelevantChunks(
    query: string,
    deity: "hanuman" | "shiva" | "gayatri" | null = null,
    topK: number = 3,
): Promise<Array<{ chunk: KnowledgeChunk; score: number }>> {

    // Ensure vectorstore ready hai
    await initVectorstore();

    const embedder = _embedder!;
    const cachedEmbeddings = _cachedEmbeddings!;

    // Query embed karo
    const queryOutput = await embedder(query, { pooling: "mean", normalize: true } as any);
    const queryVec = Array.from(queryOutput.data) as number[];

    // Har chunk ke saath cosine similarity compute karo
    const scored = ALL_CHUNKS.map((chunk, i) => ({
        chunk,
        score: cosineSimilarity(queryVec, cachedEmbeddings[i]),
    }));

    // Deity filter lagao (agar diya gaya hai)
    const filtered = deity
        ? scored.filter((s) => s.chunk.deity === deity)
        : scored;

    // Score ke hisaab se sort karo (highest first) aur top K lo
    return filtered
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

/**
 * formatContextForLLM()
 */
export function formatContextForLLM(
    results: Array<{ chunk: KnowledgeChunk; score: number }>,
): string {
    if (results.length === 0) {
        return "No specific scripture reference found. Respond from general devotional knowledge.";
    }

    // Sirf reasonably relevant chunks include karo (score > 0.3)
    const relevant = results.filter((r) => r.score > 0.3);

    if (relevant.length === 0) {
        return "No closely matching scripture found. Respond warmly from general knowledge.";
    }

    return relevant
        .map(
            ({ chunk, score }, i) =>
                `[Reference ${i + 1}: ${chunk.title} | Category: ${chunk.category} | Relevance: ${(score * 100).toFixed(0)}%]\n${chunk.content}`,
        )
        .join("\n\n---\n\n");
}

/**
 * isVectorstoreReady()
 * Quick check — vectorstore initialize ho chuka hai ya nahi.
 */
export function isVectorstoreReady(): boolean {
    return _cachedEmbeddings !== null;
}

/* ─────────────────────────────────────────────
   INTERNAL HELPERS
   ───────────────────────────────────────────── */

/**
 * _doInit()
 */
async function _doInit(): Promise<void> {
    try {
        console.log("[Vectorstore] Initializing embedding model...");

        _embedder = await pipeline("feature-extraction", MODEL_NAME);
        console.log("[Vectorstore] Model loaded ✅");

        console.log(`[Vectorstore] Embedding ${ALL_CHUNKS.length} knowledge chunks...`);

        const embeddings: number[][] = [];

        for (const chunk of ALL_CHUNKS) {
            const output = await _embedder(chunk.content, {
                pooling: "mean",
                normalize: true,
            } as any);
            embeddings.push(Array.from(output.data) as number[]);
        }

        _cachedEmbeddings = embeddings;
        console.log("[Vectorstore] All chunks embedded and cached ✅");

    } catch (err) {
        _embedder = null;
        _cachedEmbeddings = null;
        _initPromise = null;
        console.error("[Vectorstore] Initialization failed:", err);
        throw err;
    }
}

/**
 * cosineSimilarity()
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return dot / denominator;
}
