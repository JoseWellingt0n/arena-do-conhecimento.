import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { students } from "../../../../db/schema";
import { isAdminRequest } from "../auth";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito." }, { status: 403 });
  const db = await getDb(); return Response.json({ students: await db.select().from(students).orderBy(desc(students.id)).limit(5000) });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito." }, { status: 403 });
  const body = await request.json() as { students?: Array<{ studentId?: string; name?: string; grade?: string; team?: string; extraTime?: boolean }> };
  const valid=(body.students||[]).filter(s=>s.studentId?.trim()&&s.name?.trim()&&s.grade?.trim()&&s.team?.trim()).slice(0,5000);
  const db=await getDb();
  for(const s of valid) await db.insert(students).values({studentId:s.studentId!.trim().slice(0,40),name:s.name!.trim().slice(0,80),grade:s.grade!.trim().slice(0,40),team:s.team!.trim().slice(0,20),extraTime:Boolean(s.extraTime)}).onConflictDoUpdate({target:students.studentId,set:{name:s.name!.trim().slice(0,80),grade:s.grade!.trim().slice(0,40),team:s.team!.trim().slice(0,20),extraTime:Boolean(s.extraTime),active:true}});
  return Response.json({ok:true, imported:valid.length});
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito." }, { status: 403 });
  const id=Number(new URL(request.url).searchParams.get("id")); if(!id)return Response.json({error:"Aluno inválido."},{status:400});
  const db=await getDb(); await db.update(students).set({active:false}).where(eq(students.id,id)); return Response.json({ok:true});
}
