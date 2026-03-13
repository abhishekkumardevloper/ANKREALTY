"use client";

import { useEffect, useMemo, useState } from "react";

const empty = {
  title: "",
  description: "",
  location: "",
  city: "",
  price: "",
  image: "",
  size: "",
  status: "approved",
  contactName: "",
  contactPhone: ""
};

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [plots, setPlots] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("Enter admin secret to manage listings.");

  const fetchPlots = async (secret) => {
    if (!secret) return;
    const response = await fetch("/api/plots?scope=admin", { headers: { "x-admin-secret": secret }, cache: "no-store" });
    const data = await response.json();
    setPlots(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPlots(adminSecret);
  }, [adminSecret]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const pendingPlots = useMemo(() => plots.filter((p) => p.status === "pending"), [plots]);
  const activePlots = useMemo(() => plots.filter((p) => p.status !== "pending"), [plots]);

  const save = async (event) => {
    event.preventDefault();
    if (!adminSecret) {
      setMessage("Admin secret is required.");
      return;
    }

    const url = editingId ? `/api/plots/${editingId}` : "/api/plots";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ ...form, price: Number(form.price || 0) })
    });

    if (!response.ok) {
      setMessage("Save failed. Please verify admin secret.");
      return;
    }

    setMessage(editingId ? "Plot updated" : "Plot created");
    setEditingId(null);
    setForm(empty);
    await fetchPlots(adminSecret);
  };

  const remove = async (id) => {
    const response = await fetch(`/api/plots/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": adminSecret }
    });

    if (!response.ok) {
      setMessage("Delete failed.");
      return;
    }

    setMessage("Plot deleted.");
    await fetchPlots(adminSecret);
  };

  const approve = async (plot) => {
    const response = await fetch(`/api/plots/${plot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ status: "approved" })
    });

    if (!response.ok) {
      setMessage("Approval failed.");
      return;
    }

    setMessage("Plot approved and now visible on home page.");
    await fetchPlots(adminSecret);
  };

  return (
    <main className="container section-gap">
      <h1>Admin Panel</h1>
      <p className="muted">Manage all website listings and approve user-submitted plots.</p>

      <div className="panel" style={{ marginBottom: 16 }}>
        <label>Admin Secret
          <input value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} placeholder="default: admin123 or set ADMIN_SECRET" />
        </label>
      </div>

      <p><strong>{message}</strong></p>

      <section className="panel">
        <h2>{editingId ? "Edit Listing" : "Create New Listing"}</h2>
        <form onSubmit={save}>
          <div className="form-grid">
            <label>Title<input value={form.title} onChange={(e) => updateField("title", e.target.value)} required /></label>
            <label>Location<input value={form.location} onChange={(e) => updateField("location", e.target.value)} required /></label>
            <label>City<input value={form.city} onChange={(e) => updateField("city", e.target.value)} required /></label>
            <label>Price<input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} required /></label>
            <label>Size<input value={form.size} onChange={(e) => updateField("size", e.target.value)} required /></label>
            <label>Status<input value={form.status} onChange={(e) => updateField("status", e.target.value)} /></label>
            <label>Image URL<input value={form.image} onChange={(e) => updateField("image", e.target.value)} required /></label>
            <label>Contact Name<input value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} /></label>
            <label>Contact Phone<input value={form.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} /></label>
          </div>
          <label>Description<textarea rows="4" value={form.description} onChange={(e) => updateField("description", e.target.value)} required /></label>
          <button type="submit" className="btn">{editingId ? "Update" : "Create"}</button>
        </form>
      </section>

      <section className="section-gap">
        <h2>Pending User Submissions ({pendingPlots.length})</h2>
        <div className="card-grid">
          {pendingPlots.map((plot) => (
            <article className="card" key={plot.id}>
              <img src={plot.image} alt={plot.title} />
              <div className="card-content">
                <h3>{plot.title}</h3>
                <p className="muted">{plot.location}, {plot.city}</p>
                <p>{plot.description}</p>
                <p className="muted">Seller: {plot.contactName} ({plot.contactPhone})</p>
                <div className="actions">
                  <button className="btn" onClick={() => approve(plot)}>Approve</button>
                  <button className="btn danger" onClick={() => remove(plot.id)}>Reject/Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-gap">
        <h2>All Active Listings ({activePlots.length})</h2>
        <div className="card-grid">
          {activePlots.map((plot) => (
            <article className="card" key={plot.id}>
              <img src={plot.image} alt={plot.title} />
              <div className="card-content">
                <h3>{plot.title}</h3>
                <p className="muted">{plot.location}, {plot.city}</p>
                <div className="actions">
                  <button className="btn secondary" onClick={() => { setEditingId(plot.id); setForm({ ...plot, price: String(plot.price) }); }}>Edit</button>
                  <button className="btn danger" onClick={() => remove(plot.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
