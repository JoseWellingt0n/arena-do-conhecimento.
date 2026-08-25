import { count, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { competitions, gameSessions } from "../../../db/schema";

export async function GET() {
  const db=await getDb(); const [round]=await db.select().from(competitions).where(eq(competitions.active,true)).limit(1);
  if(!round)return Response.json({active:false,status:"open",players:0});
  const [waiting]=await db.select({total:count(gameSessions.token)}).from(gameSessions).where(eq(gameSessions.competitionCode,round.code));
  return Response.json({active:true,name:round.name,status:round.liveStatus,players:Number(waiting?.total||0),startedAt:round.liveStartedAt});
}
