import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function SuperAdminStoresList() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // edit modal state
  const [editing, setEditing] = useState(null); // store object
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/superadmin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return stores;
    return stores.filter((s) =>
      `${s.name} ${s.slug} ${s.ownerEmail}`.toLowerCase().includes(t),
    );
  }, [q, stores]);

  const openEdit = (s) => {
    setEditing(s);
    setName(s.name);
    setSlug(s.slug);
    setIsActive(!!s.isActive);
  };

  const closeEdit = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setIsActive(true);
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setErr("");
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        isActive,
      };

      const res = await axios.put(
        `${API}/api/superadmin/stores/${editing.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStores((prev) =>
        prev.map((x) => (x.id === editing.id ? { ...x, ...res.data } : x)),
      );

      closeEdit();
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(
        typeof data === "string" ? data : JSON.stringify(data ?? "Save failed"),
      );
      setSaving(false);
    }
  };

  const toggleActive = async (s) => {
    setErr("");
    try {
      const res = await axios.put(
        `${API}/api/superadmin/stores/${s.id}`,
        { isActive: !s.isActive },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStores((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, ...res.data } : x)),
      );
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Toggle failed");
    }
  };

  const del = async (s) => {
    const ok = window.confirm(
      `Delete store "${s.name}"? (This will remove it from DB)`,
    );
    if (!ok) return;

    setErr("");
    try {
      await axios.delete(`${API}/api/superadmin/stores/${s.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores((prev) => prev.filter((x) => x.id !== s.id));
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : "Delete failed");
    }
  };

  return (
    <div>
      <div style={topRow}>
        <div>
          <h2 style={{ margin: 0 }}>Stores</h2>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Manage all stores (CRUD). Search, edit, disable, delete.
          </div>
        </div>

        <button style={btnOutline} onClick={fetchStores} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          style={search}
          placeholder="Search: name / slug / owner email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ opacity: 0.8, fontWeight: 700 }}>
          {filtered.length} stores
        </div>
      </div>

      {err && <div style={errorBox}>{err}</div>}

      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Slug</th>
              <th style={th}>Owner</th>
              <th style={th}>Active</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={td}>{s.id}</td>
                <td style={tdStrong}>{s.name}</td>
                <td style={td}>{s.slug}</td>
                <td style={td}>{s.ownerEmail}</td>
                <td style={td}>
                  <span style={pill(s.isActive)}>
                    {s.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={btnSmall} onClick={() => openEdit(s)}>
                      Edit
                    </button>
                    <button style={btnSmall} onClick={() => toggleActive(s)}>
                      {s.isActive ? "Disable" : "Activate"}
                    </button>
                    <button style={btnDanger} onClick={() => del(s)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td style={td} colSpan={6}>
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div style={modalBackdrop} onClick={closeEdit}>
          <div style={modalCard} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Edit Store</div>
                <div style={{ opacity: 0.8, marginTop: 4 }}>
                  ID: {editing.id} • Owner: {editing.ownerEmail}
                </div>
              </div>
              <button style={btnOutline} onClick={closeEdit}>
                Close
              </button>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <label style={label}>Name</label>
              <input
                style={inp}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label style={label}>Slug</label>
              <input
                style={inp}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />

              <label
                style={{
                  ...label,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active
              </label>

              <button style={btnPrimary} onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
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
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid rgba(15,23,42,0.08)",
  background: "#ffffff",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
};

const th = {
  textAlign: "left",
  padding: 12,
  fontSize: 12,
  opacity: 0.7,
  background: "#fff7ed",
  borderBottom: "1px solid rgba(15,23,42,0.10)",
  color: "#7c2d12",
};

const td = {
  padding: 12,
  borderBottom: "1px solid rgba(15,23,42,0.08)",
  opacity: 0.85,
  color: "#0f172a",
};

const tdStrong = { ...td, fontWeight: 900, opacity: 1 };

const pill = (active) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  background: active ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.12)",
  border: active
    ? "1px solid rgba(34,197,94,0.30)"
    : "1px solid rgba(239,68,68,0.25)",
  color: active ? "#166534" : "#b91c1c",
});

const btnSmall = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(245,158,11,0.35)",
  background: "rgba(245,158,11,0.14)",
  color: "#7c2d12",
  fontWeight: 900,
  cursor: "pointer",
};

const btnDanger = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,60,60,0.28)",
  background: "rgba(239,68,68,0.12)",
  color: "#b91c1c",
  fontWeight: 900,
  cursor: "pointer",
};

const btnOutline = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.14)",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};

const btnPrimary = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(245,158,11,0.35)",
  background: "#f59e0b",
  color: "#1f2937",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.22)",
  color: "#b91c1c",
  fontWeight: 800,
};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "grid",
  placeItems: "center",
  padding: 16,
  zIndex: 50,
};

const modalCard = {
  width: "min(520px, 96vw)",
  borderRadius: 18,
  padding: 16,
  background: "#ffffff",
  border: "1px solid rgba(15,23,42,0.12)",
  boxShadow: "0 26px 60px rgba(15,23,42,0.18)",
};

const label = { fontSize: 12, fontWeight: 900, opacity: 0.7 };

const inp = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
  boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
};
