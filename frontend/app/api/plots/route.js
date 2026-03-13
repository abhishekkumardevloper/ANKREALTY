import { NextResponse } from "next/server";
import { createPlot, listPlots } from "@/lib/plots";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

function isAdmin(request) {
  return request.headers.get("x-admin-secret") === ADMIN_SECRET;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") === "admin" ? "admin" : "public";
  const plots = await listPlots(scope);
  return NextResponse.json(plots);
}

export async function POST(request) {
  const body = await request.json();
  const adminCreate = isAdmin(request);

  const created = await createPlot({
    ...body,
    createdBy: adminCreate ? "admin" : "user",
    status: adminCreate ? "approved" : "pending"
  });

  return NextResponse.json(created, { status: 201 });
}
