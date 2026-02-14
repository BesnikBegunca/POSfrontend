import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const resetForm = () => {
    setStoreName("");
    setOwnerFullName("");
    setOwnerEmail("");
    setOwnerPassword("");
    setImageFile(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      setLoading(true);

      const fd = new FormData();
      fd.append("storeName", storeName.trim());
      fd.append("slug", slug.trim());
      fd.append("ownerFullName", ownerFullName.trim());
      fd.append("ownerEmail", ownerEmail.trim());
      fd.append("ownerPassword", ownerPassword);

      if (imageFile) fd.append("image", imageFile);

      const res = await axios.post(`${API}/api/superadmin/stores`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg(`Store created ✅ ${res.data.name} (${res.data.slug})`);
      setStoreName("");
      setSlug("");
      setImageFile(null);
      setOwnerFullName("");
      setOwnerEmail("");
      setOwnerPassword("");
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Create Store</h1>
            <p style={styles.subtitle}>
              Create a new store and assign an owner.
            </p>
          </div>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          <form onSubmit={submit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Slug (e.g. abc-market)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            {/* IMAGE */}
            <input
              style={{ ...styles.input, padding: 10 }}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />

            {imageFile && (
              <div style={styles.previewWrap}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  style={styles.previewImg}
                />
                <div style={styles.previewText}>
                  {imageFile.name} · {Math.round(imageFile.size / 1024)} KB
                </div>
              </div>
            )}

            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Owner full name"
                value={ownerFullName}
                onChange={(e) => setOwnerFullName(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Owner email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>

            <input
              style={styles.input}
              type="password"
              placeholder="Owner password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
            />

            <button style={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Create Store"}
            </button>
          </form>

          {msg && <div style={styles.success}>{msg}</div>}
          {err && <div style={styles.error}>{err}</div>}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "auto",
    background: "transparent",
    padding: 0,
    fontFamily: '"Manrope", "Segoe UI", Tahoma, sans-serif',
    color: "#0F172A",
  },

  container: {
    maxWidth: 720,
    margin: "0 auto",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 900,
  },

  subtitle: {
    margin: "6px 0 0",
    color: "rgba(15,23,42,.65)",
    fontSize: 14,
    fontWeight: 600,
  },

  /* CARD (same as manager / stores) */
  card: {
    background: "#FFFFFF",
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,.08)",
    padding: 24,
    boxShadow: "0 26px 60px rgba(15,23,42,.08)",
  },

  form: {
    display: "grid",
    gap: 14,
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,.12)",
    background: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
  },

  button: {
    height: 46,
    borderRadius: 12,
    border: "none",
    background: "#f59e0b",
    color: "#1f2937",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(245,158,11,0.25)",
  },

  success: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "rgba(34,197,94,.12)",
    color: "#166534",
    fontWeight: 700,
  },

  error: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "rgba(239,68,68,.12)",
    color: "#7F1D1D",
    fontWeight: 700,
    whiteSpace: "pre-wrap",
  },

  previewWrap: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(15,23,42,.08)",
    background: "#fff7ed",
  },

  previewImg: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },

  previewText: {
    padding: 10,
    fontSize: 12,
    opacity: 0.7,
  },
};
