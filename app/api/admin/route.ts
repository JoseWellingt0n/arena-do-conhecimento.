import { isAdminRequest } from "./auth";

export async function GET(request: Request) {
  return Response.json({ isAdmin: await isAdminRequest(request) });
}
