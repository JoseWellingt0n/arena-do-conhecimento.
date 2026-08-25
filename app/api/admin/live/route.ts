import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { competitions } from "../../../../db/schema";
import { isAdminRequest } from "../auth";

export async function PUT(request: Request){
 if(!(await isAdminRequest(request)))return Response.json({error:"Acesso restrito."},{status:403});
 const {status}=await request.json() as {status?:string}; if(!["open","waiting","running","paused","finished"].includes(status||""))return Response.json({error:"Estado inválido."},{status:400});
 const db=await getDb(); const [round]=await db.select().from(competitions).where(eq(competitions.active,true)).limit(1); if(!round)return Response.json({error:"Nenhuma rodada ativa."},{status:404});
 await db.update(competitions).set({liveStatus:status!,liveStartedAt:status==="running"?new Date().toISOString():round.liveStartedAt}).where(eq(competitions.id,round.id)); return Response.json({ok:true});
}
