import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
let client:ReturnType<typeof postgres>|undefined;
export async function getDb(){const url=process.env.DATABASE_URL;if(!url)throw new Error("DATABASE_URL não configurada.");client??=postgres(url,{prepare:false,max:5,ssl:"require"});return drizzle(client,{schema})}
