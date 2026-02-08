import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function OwnerStaffList() {
  const [staff, setStaff] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/owner/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return staff;
    return staff.filter((s) =>
      `${s.fullName} ${s.email} ${s.role}`.toLowerCase().includes(t)
    );
  }, [q, staff]);

  return (
    <div>
      <div style={topRow}>
        <div>
          <h2 style={{ margin: 0 }}>Staff List</h2>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Staff of your store (from API).
          </div>
        </div>

        <button style={btnOutline} onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          style={search}
          placeholder="Search staff..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ opacity: 0.8, fontWeight: 700 }}>
          {filtered.length} staff
        </div>
      </div>

      {err && <div style={errorBox}>{err}</div>}

      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Full Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>StoreId</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={td}>{s.id}</td>
                <td style={tdStrong}>{s.fullName}</td>
                <td style={td}>{s.email}</td>
                <td style={td}>
                  <span style={pill}>{s.role}</span>
                </td>
                <td style={td}>{s.storeId}</td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td style={td} colSpan={5}>
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= styles ================= */

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const search = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#e9eefb",
  outline: "none",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.12)",
};

const th = {
  textAlign: "left",
  padding: 12,
  fontSize: 12,
  opacity: 0.85,
  background: "rgba(0,0,0,0.25)",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const td = {
  padding: 12,
  borderBottom: "1px solid rgba(255,255,255,0.10)",
  opacity: 0.9,
};

const tdStrong = { ...td, fontWeight: 900, opacity: 1 };

const pill = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  background: "rgba(47,107,255,0.18)",
  border: "1px solid rgba(47,107,255,0.30)",
  color: "#cfe1ff",
};

const btnOutline = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "transparent",
  color: "#e9eefb",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "rgba(255,60,60,0.15)",
  border: "1px solid rgba(255,60,60,0.24)",
  color: "#ffd5d5",
  fontWeight: 800,
};
