export default function OwnerHome() {
  const fullName = localStorage.getItem("fullName") || "Owner";
  const role = localStorage.getItem("role") || "";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26 }}>Welcome, {fullName} 👋</h1>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            This is your Owner dashboard. Role: <b>{role}</b>
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {[
          { title: "Today Sales", value: "—", hint: "connect later" },
          { title: "Open Tables", value: "—", hint: "connect later" },
          { title: "Staff Count", value: "—", hint: "connect later" },
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
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              {c.hint}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          borderRadius: 16,
          padding: 14,
          background: "rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Quick actions</div>
        <div style={{ opacity: 0.85 }}>
          • Go to <b>Create Staff</b> to add Waiter/Cashier/Admin <br />
          • Later we’ll add: products, tables, reports, settlements
        </div>
      </div>
    </div>
  );
}
