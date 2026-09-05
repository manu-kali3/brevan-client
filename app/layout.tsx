export const metadata = { title: "Brevan Client Portal", description: "Track your service bookings and request changes" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", margin: 0, background: "#f4f6f9" }}>
        <header style={{ background: "#1a2138", color: "#fff", padding: "14px 24px" }}>
          <strong>Brevan Softwares</strong> <span style={{ opacity: 0.7, marginLeft: 8 }}>Client Portal</span>
        </header>
        <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
