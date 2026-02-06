import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function OwnerCreateStaff() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Waiter");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return setErr("No token. Login as Owner.");

      const res = await axios.post(
        `${API}/api/owner/staff`,
        { fullName, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(`Created ✅ ${res.data.fullName} (${res.data.role})`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("Waiter");
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Create Staff</h2>
      <p style={{ opacity: 0.85, marginTop: 6 }}>
        Create <b>Admin</b>, <b>Waiter</b> or <b>Cashier</b>. Staff will inherit your RestaurantId automatically.
      </p>

      <div
        style={{
          marginTop: 12,
          borderRadius: 16,
          padding: 14,
          background: "rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.10)",
          maxWidth: 560,
        }}
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inp}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inp}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inp}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}>
            <option value="Admin">Admin</option>
            <option value="Waiter">Waiter</option>
            <option value="Cashier">Cashier</option>
          </select>

          <button style={btn}>Create</button>
        </form>

        {msg && <div style={{ marginTop: 10, color: "#b6ffcf", fontWeight: 700 }}>{msg}</div>}
        {err && <div style={{ marginTop: 10, color: "#ffb6b6", fontWeight: 700 }}>{err}</div>}
      </div>
    </div>
  );
}

const inp = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#e9eefb",
  outline: "none",
};

const btn = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(233,238,251,0.9)",
  color: "#0b1220",
  fontWeight: 900,
  cursor: "pointer",
};
