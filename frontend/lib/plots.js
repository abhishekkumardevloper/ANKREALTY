import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "plots.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasSupabase() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function mapRowToPlot(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    location: row.location ?? "",
    city: row.city ?? "",
    price: Number(row.price ?? 0),
    image: row.image_url ?? "",
    size: row.size ?? "",
    status: row.status ?? "pending",
    contactName: row.contact_name ?? "",
    contactPhone: row.contact_phone ?? "",
    createdBy: row.created_by ?? "admin"
  };
}

function mapPlotToRow(plot) {
  return {
    id: plot.id,
    title: plot.title,
    description: plot.description ?? "",
    location: plot.location ?? "",
    city: plot.city ?? "",
    price: Number(plot.price ?? 0),
    image_url: plot.image ?? "",
    size: plot.size ?? "",
    status: plot.status ?? "pending",
    contact_name: plot.contactName ?? "",
    contact_phone: plot.contactPhone ?? "",
    created_by: plot.createdBy ?? "admin"
  };
}

async function supabaseFetch(endpoint, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  const bodyText = await response.text();
  return bodyText ? JSON.parse(bodyText) : null;
}

async function readLocalPlots() {
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw);
}

async function writeLocalPlots(plots) {
  await fs.writeFile(dataFile, JSON.stringify(plots, null, 2));
}

function sortByNewest(items) {
  return [...items].sort((a, b) => String(b.id).localeCompare(String(a.id)));
}

export async function listPlots(scope = "public") {
  if (hasSupabase()) {
    const filters = scope === "public" ? "?status=eq.approved&order=created_at.desc" : "?order=created_at.desc";
    const rows = await supabaseFetch(`plots${filters}`, { method: "GET" });
    return rows.map(mapRowToPlot);
  }

  const plots = await readLocalPlots();
  return scope === "public" ? plots.filter((item) => item.status === "approved") : sortByNewest(plots);
}

export async function getPlot(id) {
  if (hasSupabase()) {
    const rows = await supabaseFetch(`plots?id=eq.${id}&limit=1`, { method: "GET" });
    return rows?.[0] ? mapRowToPlot(rows[0]) : null;
  }

  const plots = await readLocalPlots();
  return plots.find((item) => item.id === id) || null;
}

export async function createPlot(input) {
  const plot = {
    id: input.id || `plot-${Date.now()}`,
    title: input.title || "Untitled plot",
    description: input.description || "",
    location: input.location || "",
    city: input.city || "",
    price: Number(input.price || 0),
    image: input.image || "",
    size: input.size || "",
    status: input.status || "pending",
    contactName: input.contactName || "",
    contactPhone: input.contactPhone || "",
    createdBy: input.createdBy || "user"
  };

  if (hasSupabase()) {
    const rows = await supabaseFetch("plots", { method: "POST", body: JSON.stringify([mapPlotToRow(plot)]) });
    return mapRowToPlot(rows[0]);
  }

  const plots = await readLocalPlots();
  plots.unshift(plot);
  await writeLocalPlots(plots);
  return plot;
}

export async function updatePlot(id, updates) {
  if (hasSupabase()) {
    const payload = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.size !== undefined) payload.size = updates.size;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.contactName !== undefined) payload.contact_name = updates.contactName;
    if (updates.contactPhone !== undefined) payload.contact_phone = updates.contactPhone;

    const rows = await supabaseFetch(`plots?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    return rows?.[0] ? mapRowToPlot(rows[0]) : null;
  }

  const plots = await readLocalPlots();
  const index = plots.findIndex((item) => item.id === id);
  if (index === -1) return null;
  plots[index] = { ...plots[index], ...updates, price: Number(updates.price ?? plots[index].price) };
  await writeLocalPlots(plots);
  return plots[index];
}

export async function deletePlot(id) {
  if (hasSupabase()) {
    await supabaseFetch(`plots?id=eq.${id}`, { method: "DELETE" });
    return true;
  }

  const plots = await readLocalPlots();
  const next = plots.filter((item) => item.id !== id);
  if (next.length === plots.length) return false;
  await writeLocalPlots(next);
  return true;
}
