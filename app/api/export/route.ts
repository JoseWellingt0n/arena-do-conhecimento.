import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { scores } from "../../../db/schema";
import { isAdminRequest } from "../admin/auth";

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const db = await getDb();
  const rows = await db.select().from(scores).orderBy(desc(scores.score), desc(scores.id));
  const header = ["ID", "Nome completo", "Matrícula", "Turma", "Time", "Modalidade", "Rodada", "Tentativa", "Acertos", "Pontos", "Duração (s)", "Data"];
  const csv = [header, ...rows.map((row) => [row.id, row.name, row.studentId, row.grade, row.team, row.subject, row.competitionCode, row.attemptNumber, row.correct, row.score, row.duration, row.createdAt])]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="resultados-arena-do-conhecimento-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
