import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { students } from "../../../db/schema";

export async function POST(request: Request) {
  const { studentId } = await request.json() as { studentId?: string };
  if (!studentId?.trim()) return Response.json({ error: "Informe a matrícula." }, { status: 400 });
  const db = await getDb();
  const [student] = await db.select().from(students).where(eq(students.studentId, studentId.trim())).limit(1);
  if (!student?.active) return Response.json({ error: "Matrícula não encontrada." }, { status: 404 });
  return Response.json({ student: { name: student.name, grade: student.grade, team: student.team, extraTime: student.extraTime } });
}
