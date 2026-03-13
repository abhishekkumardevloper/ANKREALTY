"use client";

import { useState } from "react";

const initial = {
  title: "",
  description: "",
  location: "",
  city: "",
  price: "",
  image: "",
  size: "",
  contactName: "",
  contactPhone: ""
};

export default function SellPage() {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMsg("Submitting...");

    const response = await fetch("/api/plots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price || 0) })
    });

    if (!response.ok) {
      setMsg("Submission failed. Please try again.");
      return;
    }

    setMsg("Your plot was submitted successfully. Admin will review and approve it.");
    setForm(initial);
  };

  return (
    <main className="container section-gap">
      <h1>Sell Your Own Plot</h1>
      <p className="muted">Anyone can submit plot details from this form. It goes to admin for approval.</p>
      {msg && <p><strong>{msg}</strong></p>}

      <form className="panel" onSubmit={submit}>
        <div className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => update("title", e.target.value)} required /></label>
          <label>Location<input value={form.location} onChange={(e) => update("location", e.target.value)} required /></label>
          <label>City<input value={form.city} onChange={(e) => update("city", e.target.value)} required /></label>
          <label>Price (INR)<input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required /></label>
          <label>Size<input value={form.size} onChange={(e) => update("size", e.target.value)} required /></label>
          <label>Image URL<input value={form.image} onChange={(e) => update("image", e.target.value)} required /></label>
          <label>Contact Name<input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} required /></label>
          <label>Contact Phone<input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} required /></label>
        </div>
        <label>Description<textarea rows="4" value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
        <button className="btn" type="submit">Submit Plot</button>
      </form>
    </main>
  );
}
