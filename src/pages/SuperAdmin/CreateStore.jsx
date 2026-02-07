import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/superadmin/stores`,
        { storeName, slug, ownerFullName, ownerEmail, ownerPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(`Store created ✅ ${res.data.name} (${res.data.slug})`);
      setStoreName(""); setSlug("");
      setOwnerFullName(""); setOwnerEmail(""); setOwnerPassword("");
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "50px auto", fontFamily: "system-ui" }}>
      <h2>Create Store (SuperAdmin)</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input style={inp} placeholder="Store name" value={storeName} onChange={(e)=>setStoreName(e.target.value)} />
        <input style={inp} placeholder="Slug (e.g. abc-market)" value={slug} onChange={(e)=>setSlug(e.target.value)} />
        <input style={inp} placeholder="Owner full name" value={ownerFullName} onChange={(e)=>setOwnerFullName(e.target.value)} />
        <input style={inp} placeholder="Owner email" value={ownerEmail} onChange={(e)=>setOwnerEmail(e.target.value)} />
        <input style={inp} placeholder="Owner password" type="password" value={ownerPassword} onChange={(e)=>setOwnerPassword(e.target.value)} />
        <button style={btn}>Create Store + Owner</button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}

const inp = { padding: 12, borderRadius: 12, border: "1px solid #ccc" };
const btn = { padding: 12, borderRadius: 12, border: "none", background: "#111", color: "#fff", fontWeight: 800 };
