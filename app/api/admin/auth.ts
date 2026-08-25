export async function isAdminRequest(request:Request){
  const token=request.headers.get("cookie")?.match(/(?:^|;\s*)arena_admin=([^;]+)/)?.[1];
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!token||!url||!key)return false;
  try{const response=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${decodeURIComponent(token)}`},cache:"no-store"});if(!response.ok)return false;const user=await response.json() as{email?:string};return user.email?.trim().toLowerCase()===process.env.ADMIN_EMAIL?.trim().toLowerCase()}catch{return false}
}
