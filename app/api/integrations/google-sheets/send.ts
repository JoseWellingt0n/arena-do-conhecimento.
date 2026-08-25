import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { integrationSettings } from "../../../../db/schema";

export async function sendScoreToGoogleSheets(score: Record<string, unknown>) {
  try {
    const db = await getDb();
    const [setting] = await db.select().from(integrationSettings).where(eq(integrationSettings.key, "google_sheets_webhook")).limit(1);
    if (!setting?.value) return;
    const response = await fetch(setting.value, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(score), redirect: "follow" });
    const text = await response.text();
    const result = JSON.parse(text) as { ok?: boolean };
    if (!response.ok || !result.ok) throw new Error("Google Sheets did not confirm the score.");
  } catch {
    // The game result remains safely stored even if Google Sheets is unavailable.
  }
}
