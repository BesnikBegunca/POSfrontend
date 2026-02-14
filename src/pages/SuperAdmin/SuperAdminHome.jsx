export default function SuperAdminHome() {
  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 900, color: "#0f172a" }}>
        SuperAdmin Dashboard
      </h1>
      <p style={{ opacity: 0.7, color: "#0f172a" }}>
        Këtu menaxhon krejt platformën: stores, owners, status, etj.
      </p>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        {[
          { title: "Total Stores", value: "—" },
          { title: "Active Stores", value: "—" },
          { title: "Owners", value: "—" },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              borderRadius: 18,
              padding: 16,
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.6 }}>{c.title}</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
