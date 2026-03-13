import Link from "next/link";
import { listPlots } from "@/lib/plots";

function inr(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default async function HomePage() {
  const plots = await listPlots("public");

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">100% dynamic listing website</p>
          <h1>Find your next plot with ANK Realty</h1>
          <p className="hero-sub">All approved listings are managed from Admin Panel. Users can also submit their own plot from the Sell page.</p>
          <div className="hero-actions">
            <Link href="/sell" className="btn">Post Your Plot</Link>
            <Link href="/admin" className="btn secondary">Open Admin</Link>
          </div>
        </div>
      </section>

      <section className="container section-gap">
        <h2>Latest Approved Plots</h2>
        <div className="card-grid">
          {plots.map((plot) => (
            <article className="card" key={plot.id}>
              <img src={plot.image} alt={plot.title} />
              <div className="card-content">
                <h3>{plot.title}</h3>
                <p className="muted">{plot.location}{plot.city ? `, ${plot.city}` : ""}</p>
                <p className="price">{inr(plot.price)}</p>
                <p className="muted">{plot.size}</p>
                <Link className="btn" href={`/plots/${plot.id}`}>View Details</Link>
              </div>
            </article>
          ))}
          {plots.length === 0 && <p>No approved plots yet. Add from admin or submit from sell page.</p>}
        </div>
      </section>
    </main>
  );
}
