import { and, count, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { competitions, gameSessions, scores } from "../../../../db/schema";

export async function POST(request: Request) {
  const p = await request.json() as { name?: string; grade?: string; team?: string; studentId?: string; competitionCode?: string; deviceId?: string };
  if (!p.name?.trim() || !p.grade || !p.team) return Response.json({ error: "Preencha os dados do estudante." }, { status: 400 });
  const db = await getDb();
  const [active] = await db.select().from(competitions).where(eq(competitions.active, true)).limit(1);
  const code = active ? p.competitionCode?.trim().toUpperCase() : "LIVRE";
  if (active && code !== active.code) return Response.json({ error: "Código da competição inválido." }, { status: 403 });
  if (active && !p.studentId?.trim()) return Response.json({ error: "Informe a matrícula ou código do aluno." }, { status: 400 });
  const studentId = p.studentId?.trim().slice(0, 40) || `${p.name.trim().toLowerCase()}|${p.grade}`;
  if (active) {
    const [attempts] = await db.select({ total: count(scores.id) }).from(scores).where(and(eq(scores.studentId, studentId), eq(scores.competitionCode, active.code)));
    if (Number(attempts?.total || 0) >= active.maxAttempts) return Response.json({ error: `Limite de ${active.maxAttempts} tentativa(s) atingido.` }, { status: 409 });
    const existing = await db.select().from(gameSessions).where(and(eq(gameSessions.studentId, studentId), eq(gameSessions.competitionCode, active.code), eq(gameSessions.used, false))).limit(1);
    if (existing.length) return Response.json({ error: "Já existe uma partida aberta para esta matrícula. Finalize-a antes de abrir outra aba." }, { status: 409 });
  }
  const token = crypto.randomUUID();
  await db.insert(gameSessions).values({ token, studentId, name: p.name.trim().slice(0, 80), grade: p.grade.slice(0, 40), team: p.team.slice(0, 20), competitionCode: code || "LIVRE", startedAt: new Date().toISOString(), deviceId: p.deviceId?.slice(0,80)||"", heartbeatAt:new Date().toISOString() });
  return Response.json({ token, competitionCode: code || "LIVRE", competitionName: active?.name || "Jogo livre", liveStatus: active?.liveStatus || "open" });
}
