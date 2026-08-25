import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { integrationSettings, scores } from "../../../../db/schema";
import { isAdminRequest } from "../../admin/auth";

const SETTING_KEY = "google_sheets_webhook";
const EMAIL_KEY = "google_sheets_notification_email";

function validAppsScriptUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "script.google.com" && url.pathname.startsWith("/macros/s/") && url.pathname.endsWith("/exec");
  } catch { return false; }
}

async function callSheet(url: string, payload: { health?: boolean; batch?: unknown[]; notifyEmail?: string }) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" });
  const text = await response.text();
  let data: { ok?: boolean; health?: string; inserted?: number; skipped?: number; emailSent?: boolean; error?: string } = {};
  try { data = JSON.parse(text); } catch {
    const loginPage = /accounts\.google|ServiceLogin|<!doctype html/i.test(text);
    throw new Error(loginPage ? "O Apps Script não está público. Na implantação, selecione acesso para ‘Qualquer pessoa’." : "O Apps Script não devolveu uma resposta válida. Atualize o código e faça uma nova implantação.");
  }
  if (!response.ok || !data.ok) throw new Error(data.error || `O Google Planilhas recusou o envio (HTTP ${response.status}).`);
  if (payload.health && data.health !== "ready") throw new Error("O código do Apps Script está desatualizado. Copie o novo código exibido no jogo e faça uma Nova implantação.");
  if (payload.batch && !Number.isInteger(data.inserted)) throw new Error("O Apps Script não confirmou quantas linhas foram gravadas. Atualize o código e faça uma Nova implantação.");
  return data;
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const db = await getDb();
  const [setting] = await db.select().from(integrationSettings).where(eq(integrationSettings.key, SETTING_KEY)).limit(1);
  const [emailSetting] = await db.select().from(integrationSettings).where(eq(integrationSettings.key, EMAIL_KEY)).limit(1);
  return Response.json({ configured: Boolean(setting?.value), url: setting?.value || "", email: emailSetting?.value || "" });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const body = await request.json() as { url?: string; email?: string };
  const url = body.url?.trim() || "";
  const authenticatedEmail = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase() || "";
  const email = body.email?.trim().toLowerCase() || authenticatedEmail;
  if (url && !validAppsScriptUrl(url)) return Response.json({ error: "Use a URL de implantação do Google Apps Script terminada em /exec." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Digite um endereço de e-mail válido." }, { status: 400 });
  const db = await getDb();
  if (!url) {
    await db.delete(integrationSettings).where(eq(integrationSettings.key, SETTING_KEY));
    await db.delete(integrationSettings).where(eq(integrationSettings.key, EMAIL_KEY));
  } else {
    try { await callSheet(url, { health: true }); }
    catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Não foi possível validar a integração." }, { status: 502 }); }
    await db.insert(integrationSettings).values({ key: SETTING_KEY, value: url }).onConflictDoUpdate({ target: integrationSettings.key, set: { value: url, updatedAt: new Date().toISOString() } });
    if (email) await db.insert(integrationSettings).values({ key: EMAIL_KEY, value: email }).onConflictDoUpdate({ target: integrationSettings.key, set: { value: email, updatedAt: new Date().toISOString() } });
    else await db.delete(integrationSettings).where(eq(integrationSettings.key, EMAIL_KEY));
  }
  return Response.json({ ok: true, configured: Boolean(url), tested: Boolean(url), email });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const db = await getDb();
  const [setting] = await db.select().from(integrationSettings).where(eq(integrationSettings.key, SETTING_KEY)).limit(1);
  const [emailSetting] = await db.select().from(integrationSettings).where(eq(integrationSettings.key, EMAIL_KEY)).limit(1);
  if (!setting?.value) return Response.json({ error: "Configure primeiro o Google Planilhas." }, { status: 400 });
  const rows = await db.select().from(scores);
  try {
    const result = await callSheet(setting.value, { batch: rows, notifyEmail: emailSetting?.value || "" });
    return Response.json({ ok: true, sent: result.inserted ?? rows.length, skipped: result.skipped ?? 0, total: rows.length, emailSent: Boolean(result.emailSent), email: emailSetting?.value || "" });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "O Google Planilhas recusou a sincronização." }, { status: 502 });
  }
}
