/**
 * googleSheets.ts
 * Utility to log AI interactions to a Google Sheet via Apps Script Webhook.
 */

const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

export async function logToGoogleSheets(data: {
    userMessage: string;
    aiResponse: string;
    deity: string;
    intent: string;
}) {
    if (!WEBHOOK_URL) {
        console.warn("[GoogleSheets] WEBHOOK_URL not found in .env. Skipping log.");
        return;
    }

    try {
        console.log("[GoogleSheets] Sending log to:", WEBHOOK_URL);
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            mode: "no-cors", // Required for Apps Script Web Apps
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
            }),
        });
        console.log("[GoogleSheets] Log request completed.");

        console.log("[GoogleSheets] Log request sent successfully.");
    } catch (error) {
        console.error("[GoogleSheets] Error logging to sheets:", error);
    }
}
