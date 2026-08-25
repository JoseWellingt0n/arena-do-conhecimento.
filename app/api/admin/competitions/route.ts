import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { competitions } from "../../../../db/schema";
import { isAdminRequest } from "../auth";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const p = await request.json() as { name?: string; code?: string; maxAttempts?: number; scoringRule?: string; startsAt?: string; endsAt?: string };
  const name = p.name?.trim(), code = p.code?.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (!name || !code || code.length < 4) return Response.json({ error: "Informe um nome e um código com pelo menos 4 caracteres." }, { status: 400 });
  const db = await getDb();
  await db.update(competitions).set({ active: false });
  try {
    const [saved] = await db.insert(competitions).values({ name: name.slice(0, 80), code: code.slice(0, 20), active: true, maxAttempts: Math.max(1, Math.min(10, Number(p.maxAttempts) || 1)), scoringRule: ["best", "first", "latest"].includes(p.scoringRule || "") ? p.scoringRule! : "best", startsAt: p.startsAt || null, endsAt: p.endsAt || null }).returning();
    return Response.json({ competition: saved }, { status: 201 });
  } catch { return Response.json({ error: "Esse código já foi utilizado. Escolha outro." }, { status: 409 }); }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const p = await request.json() as { id?: number; active?: boolean };
  if (!p.id) return Response.json({ error: "Rodada inválida." }, { status: 400 });
  const db = await getDb();
  await db.update(competitions).set({ active: false });
  if (p.active) await db.update(competitions).set({ active: true }).where(eq(competitions.id, p.id));
  return Response.json({ ok: true });
}
