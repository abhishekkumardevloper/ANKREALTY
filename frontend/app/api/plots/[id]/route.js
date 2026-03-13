import { NextResponse } from "next/server";
import { deletePlot, getPlot, updatePlot } from "@/lib/plots";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

function isAdmin(request) {
  return request.headers.get("x-admin-secret") === ADMIN_SECRET;
}

export async function GET(_, { params }) {
  const plot = await getPlot(params.id);
  if (!plot) return NextResponse.json({ message: "Plot not found" }, { status: 404 });
  return NextResponse.json(plot);
}

export async function PUT(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updatePlot(params.id, body);

  if (!updated) return NextResponse.json({ message: "Plot not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const ok = await deletePlot(params.id);
  if (!ok) return NextResponse.json({ message: "Plot not found" }, { status: 404 });
  return NextResponse.json({ message: "Plot deleted" });
}
