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

    if (!storeName.trim()) return setErr("Store name is required");
    if (!ownerFullName.trim()) return setErr("Owner full name is required");
    if (!ownerEmail.trim()) return setErr("Owner email is required");
    if (!ownerPassword.trim()) return setErr("Owner password is required");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const fd = new FormData();
      fd.append("storeName", storeName.trim());
      fd.append("ownerFullName", ownerFullName.trim());
      fd.append("ownerEmail", ownerEmail.trim());
      fd.append("ownerPassword", ownerPassword);

      if (imageFile) fd.append("image", imageFile); // MUST match DTO: Image

      const res = await axios.post(
        `${API}/api/superadmin/stores`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(`Store created ✅ ${res.data.name}`);
      resetForm();
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <h2>Create Store (SuperAdmin)</h2>

      <form onSubmit={submit} style={form}>
        <input
          style={inp}
          placeholder="Store name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />

        {/* Image upload */}
        <input
          style={inp}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        {imageFile && (
          <div style={previewWrap}>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
              style={previewImg}
            />
            <div style={previewText}>
              {imageFile.name} · {Math.round(imageFile.size / 1024)} KB
            </div>
          </div>
        )}

        <input
          style={inp}
          placeholder="Owner full name"
          value={ownerFullName}
          onChange={(e) => setOwnerFullName(e.target.value)}
        />

        <input
          style={inp}
          placeholder="Owner email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
        />

        <input
          style={inp}
          type="password"
          placeholder="Owner password"
          value={ownerPassword}
          onChange={(e) => setOwnerPassword(e.target.value)}
        />

        <button style={btn} disabled={loading}>
          {loading ? "Creating..." : "Create Store + Owner"}
        </button>
      </form>

      {msg && <p style={ok}>{msg}</p>}
      {err && <p style={bad}>{err}</p>}
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  maxWidth: 520,
  margin: "50px auto",
  fontFamily: "system-ui",
};

const form = {
  display: "grid",
  gap: 10,
};

const inp = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ccc",
};

const btn = {
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#111",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const ok = {
  marginTop: 12,
  color: "green",
};

const bad = {
  marginTop: 12,
  color: "red",
  whiteSpace: "pre-wrap",
};

const previewWrap = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 10,
  background: "#fafafa",
};

const previewImg = {
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: 10,
};

const previewText = {
  fontSize: 12,
  opacity: 0.7,
  marginTop: 6,
};
