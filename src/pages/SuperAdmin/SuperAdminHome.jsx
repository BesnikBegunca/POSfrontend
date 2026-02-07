export default function SuperAdminHome() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>SuperAdmin Dashboard</h1>
      <p style={{ opacity: 0.85 }}>
        Këtu menaxhon krejt platformën: stores, owners, status, etj.
      </p>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
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
              borderRadius: 16,
              padding: 14,
              background: "rgba(0,0,0,0.20)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8 }}>{c.title}</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
