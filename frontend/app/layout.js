import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "ANK Realty",
  description: "Dynamic real estate portal with admin panel and user sell submissions"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link href="/" className="brand">ANK Realty</Link>
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/sell">Sell Your Plot</Link>
              <Link href="/admin">Admin Panel</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
