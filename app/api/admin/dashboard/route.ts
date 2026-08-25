import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { competitions, scores } from "../../../../db/schema";
import { isAdminRequest } from "../auth";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  const db = await getDb();
  const rows = await db.select().from(scores).orderBy(desc(scores.id)).limit(5000);
  const rounds = await db.select().from(competitions).orderBy(desc(competitions.id));
  const topics = new Map<string, { total: number; correct: number }>();
  for (const row of rows) {
    try {
      for (const answer of JSON.parse(row.answersJson || "[]") as Array<{ topic?: string; isCorrect?: boolean }>) {
        const topic = answer.topic || "Não informado", current = topics.get(topic) || { total: 0, correct: 0 };
        current.total++; if (answer.isCorrect) current.correct++; topics.set(topic, current);
      }
    } catch {}
  }
  const topicStats = [...topics].map(([topic, value]) => ({ topic, ...value, accuracy: value.total ? Math.round(value.correct / value.total * 100) : 0 })).sort((a, b) => a.accuracy - b.accuracy);
  const group=(key:"grade"|"team")=>[...rows.reduce((map,row)=>{const k=row[key],v=map.get(k)||{label:k,attempts:0,correct:0};v.attempts++;v.correct+=row.correct;map.set(k,v);return map},new Map<string,{label:string;attempts:number;correct:number}>()).values()].map(v=>({...v,accuracy:Math.round(v.correct/v.attempts*10)})).sort((a,b)=>b.accuracy-a.accuracy);
  const daily=[...rows.reduce((map,row)=>{const day=row.createdAt.slice(0,10),v=map.get(day)||{date:day,attempts:0};v.attempts++;map.set(day,v);return map},new Map<string,{date:string;attempts:number}>()).values()].sort((a,b)=>a.date.localeCompare(b.date)).slice(-14);
  return Response.json({ scores: rows, competitions: rounds, topicStats,gradeStats:group("grade"),teamStats:group("team"),dailyStats:daily,suspicious:rows.filter(r=>r.integrityStatus!=="ok").length });
}
