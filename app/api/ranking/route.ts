import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { competitions, gameSessions, scores } from "../../../db/schema";
import { isAdminRequest } from "../admin/auth";
import { sendScoreToGoogleSheets } from "../integrations/google-sheets/send";

type AnswerPayload = { topic?: string; text?: string; selectedIndex?: number | null; correctIndex?: number; options?: string[]; why?: string; timeLeft?: number };

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const [active] = await db.select().from(competitions).where(eq(competitions.active, true)).limit(1);
    let rows = await db.select().from(scores).orderBy(desc(scores.id)).limit(5000);
    const params=new URL(request.url).searchParams,period=params.get("period")||"round",subject=params.get("subject")||"all",now=Date.now();
    if(subject!=="all")rows=rows.filter(row=>row.subject===subject);
    if (period==="round"&&active) rows = rows.filter((row) => row.competitionCode === active.code);
    if(period==="week")rows=rows.filter(row=>Date.parse(row.createdAt)>=now-7*86400000);
    if(period==="month")rows=rows.filter(row=>Date.parse(row.createdAt)>=now-30*86400000);
    const rule = active?.scoringRule || "best";
    const selected = new Map<string, typeof rows[number]>();
    for (const row of rows) {
      const key = row.studentId || `${row.name.trim().toLowerCase()}|${row.grade}`;
      const current = selected.get(key);
      if (!current || (rule === "latest" && row.id > current.id) || (rule === "first" && row.id < current.id) || (rule === "best" && (row.score > current.score || row.score === current.score && row.correct > current.correct))) selected.set(key, row);
    }
    const ranking = [...selected.values()].sort((a, b) => b.score - a.score || b.correct - a.correct || b.id - a.id).slice(0, 500);
    const isAdmin = await isAdminRequest(request);
    const visibleRows = isAdmin ? ranking : ranking.map((entry) => ({ ...entry, name: abbreviateStudentName(entry.name), answersJson: "[]", studentId: "" }));
    const teamMap = new Map<string, { team: string; totalScore: number; totalCorrect: number; players: number }>();
    for (const row of ranking) {
      const item = teamMap.get(row.team) || { team: row.team, totalScore: 0, totalCorrect: 0, players: 0 };
      item.totalScore += row.score; item.totalCorrect += row.correct; item.players++; teamMap.set(row.team, item);
    }
    const teams = [...teamMap.values()].sort((a, b) => b.totalScore - a.totalScore);
    return Response.json({ scores: visibleRows, teams, period, subject, activeCompetition: active ? { name: active.name, codeRequired: true, maxAttempts: active.maxAttempts } : null });
  } catch { return Response.json({ error: "Não foi possível carregar o ranking." }, { status: 500 }); }
}

function abbreviateStudentName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "Aluno";
  return `${parts[0]} ${parts.slice(1).map((part) => `${part.charAt(0).toUpperCase()}.`).join(" ")}`;
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  try { const db=await getDb(); await db.delete(scores); return Response.json({ok:true}); }
  catch { return Response.json({error:"Não foi possível excluir o histórico."},{status:500}); }
}

export async function POST(request: Request) {
  try {
    const p = await request.json() as { name?: string; grade?: string; team?: string; studentId?: string; competitionCode?: string; sessionToken?: string; answers?: AnswerPayload[]; duration?: number; score?: number; correct?: number; achievements?:string[] };
    const legacyFreeResult = !Array.isArray(p.answers) && Number.isInteger(p.correct) && !p.competitionCode;
    if (!p.name?.trim() || !p.grade || !p.team || (!legacyFreeResult && (!Array.isArray(p.answers) || p.answers.length !== 10))) return Response.json({ error: "Resultado inválido." }, { status: 400 });
    const db = await getDb();
    const code = p.competitionCode?.trim().toUpperCase() || "LIVRE";
    const [competition] = await db.select().from(competitions).where(eq(competitions.code, code)).limit(1);
    const studentId = p.studentId?.trim().slice(0, 40) || `${p.name.trim().toLowerCase()}|${p.grade}`;
    let session: typeof gameSessions.$inferSelect | undefined;
    if (p.sessionToken) [session] = await db.select().from(gameSessions).where(eq(gameSessions.token, p.sessionToken)).limit(1);
    if (competition?.active) {
      if (!session || session.used || session.studentId !== studentId || session.competitionCode !== code || session.grade !== p.grade || session.team !== p.team) return Response.json({ error: "Sessão de jogo inválida ou já utilizada." }, { status: 403 });
      const [attempts] = await db.select({ total: count(scores.id) }).from(scores).where(and(eq(scores.studentId, studentId), eq(scores.competitionCode, code)));
      if (Number(attempts?.total || 0) >= competition.maxAttempts) return Response.json({ error: "Limite de tentativas atingido." }, { status: 409 });
    }
    const rawAnswers: AnswerPayload[] = Array.isArray(p.answers) ? p.answers : Array.from({ length: 10 }, (_, index) => ({ topic: "Resultado anterior", text: "Questão não registrada", selectedIndex: index < Number(p.correct) ? 0 : 1, correctIndex: 0, options: ["Correta", "Incorreta"], why: "Resultado salvo antes da atualização pedagógica.", timeLeft: 0 }));
    const safeAnswers = rawAnswers.slice(0, 10).map((answer) => ({
      topic: String(answer.topic || "Não informado").slice(0, 60), text: String(answer.text || "").slice(0, 500),
      selectedIndex: Number.isInteger(answer.selectedIndex) ? answer.selectedIndex : null,
      correctIndex: Number.isInteger(answer.correctIndex) ? Math.max(0, Math.min(3, answer.correctIndex!)) : -1,
      options: Array.isArray(answer.options) ? answer.options.slice(0, 4).map(String) : [], why: String(answer.why || "").slice(0, 500),
      timeLeft: Math.max(0, Math.min(240, Number(answer.timeLeft) || 0)),
      isCorrect: Number.isInteger(answer.selectedIndex) && answer.selectedIndex === answer.correctIndex,
    }));
    const correct = safeAnswers.filter((answer) => answer.isCorrect).length;
    const score = safeAnswers.reduce((total, answer) => total + (answer.isCorrect ? 500 + Math.round(Math.min(answer.timeLeft, 180) / 180 * 300) : 0), 0);
    const [attempts] = await db.select({ total: count(scores.id) }).from(scores).where(and(eq(scores.studentId, studentId), eq(scores.competitionCode, code)));
    const duration=Math.max(0,Math.min(2400,Number(p.duration)||0)),notes:string[]=[];if(duration<30)notes.push("Conclusão rápida demais");if(safeAnswers.filter(a=>a.timeLeft>=179).length>=8)notes.push("Tempos de resposta incomuns");
    const portugueseCount=safeAnswers.filter(answer=>answer.topic.startsWith("Português")).length;
    const subject=portugueseCount===0?"math":portugueseCount===safeAnswers.length?"portuguese":"mixed";
    const [saved] = await db.insert(scores).values({ name: p.name.trim().slice(0, 80), grade: p.grade.slice(0, 40), team: p.team.slice(0, 20), subject, score, correct, studentId, competitionCode: code, answersJson: JSON.stringify(safeAnswers), duration, attemptNumber: Number(attempts?.total || 0) + 1, integrityStatus:notes.length?"review":"ok",integrityNotes:notes.join("; "),achievementsJson:JSON.stringify((p.achievements||[]).slice(0,10)) }).returning();
    if (session) await db.update(gameSessions).set({ used: true }).where(eq(gameSessions.token, session.token));
    await sendScoreToGoogleSheets(saved);
    return Response.json({ score: saved }, { status: 201 });
  } catch { return Response.json({ error: "Não foi possível salvar o resultado." }, { status: 500 }); }
}
