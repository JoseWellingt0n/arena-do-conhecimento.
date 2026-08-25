import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { competitions } from "../../../db/schema";

export async function GET(request: Request) {
  const db = await getDb();
  const code = new URL(request.url).searchParams.get("code")?.trim().toUpperCase();
  const [active] = await db.select().from(competitions).where(eq(competitions.active, true)).limit(1);
  if (!active) return Response.json({ required: false, code: "LIVRE", name: "Jogo livre", maxAttempts: 0 });
  if (!code) return Response.json({ required: true, name: active.name, maxAttempts: active.maxAttempts });
  const [match] = await db.select().from(competitions).where(and(eq(competitions.active, true), eq(competitions.code, code))).limit(1);
  if (!match) return Response.json({ error: "Código da competição inválido ou encerrado." }, { status: 404 });
  const now = Date.now();
  if (match.startsAt && now < Date.parse(match.startsAt)) return Response.json({ error: "Esta competição ainda não começou." }, { status: 403 });
  if (match.endsAt && now > Date.parse(match.endsAt)) return Response.json({ error: "Esta competição já foi encerrada." }, { status: 403 });
  return Response.json({ required: true, valid: true, code: match.code, name: match.name, maxAttempts: match.maxAttempts });
}
