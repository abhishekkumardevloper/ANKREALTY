import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlot } from "@/lib/plots";

function inr(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default async function PlotDetails({ params }) {
  const plot = await getPlot(params.id);
  if (!plot || plot.status !== "approved") return notFound();

  return (
    <main className="container section-gap">
      <Link href="/">← Back to Home</Link>
      <article className="panel detail-card">
        <img src={plot.image} alt={plot.title} className="detail-image" />
        <div>
          <h1>{plot.title}</h1>
          <p className="muted">{plot.location}, {plot.city}</p>
          <p className="price">{inr(plot.price)}</p>
          <p><strong>Plot Size:</strong> {plot.size}</p>
          <p>{plot.description}</p>
          <hr />
          <p><strong>Seller Contact:</strong> {plot.contactName || "ANK Realty"}</p>
          <p><strong>Phone:</strong> {plot.contactPhone || "Available after inquiry"}</p>
        </div>
      </article>
    </main>
  );
}
