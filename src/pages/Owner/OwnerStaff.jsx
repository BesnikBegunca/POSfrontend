import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5083";

export default function OwnerStaff() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Waiter");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // optional: list staff (nëse e bon endpoint ma vonë)
  const [staff, setStaff] = useState([]);

  const token = localStorage.getItem("token");

  const createStaff = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      if (!token) {
        setErr("No token. Login si Owner.");
        return;
      }

      const res = await axios.post(
        `${API}/api/owner/staff`,
        { fullName, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(`U kriju ✅ ${res.data.fullName} (${res.data.role})`);
      setStaff((prev) => [res.data, ...prev]);

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("Waiter");
    } catch (e2) {
      const data = e2?.response?.data;
      setErr(typeof data === "string" ? data : JSON.stringify(data ?? "Error"));
    }
  };

  // vetëm për debug – shfaq role/token info
  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r && r !== "Owner") {
      setErr(`Duhet me u logu si Owner. Ti je: ${r}`);
    }
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Owner - Create Staff</h2>

      <div style={{ marginBottom: 12 }}>
        <b>Logged:</b> {localStorage.getItem("fullName")} | <b>Role:</b>{" "}
        {localStorage.getItem("role")}
        <button
          style={{ marginLeft: 12 }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <form onSubmit={createStaff} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: 12 }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 12 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12 }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: 12 }}
        >
          <option value="Admin">Admin</option>
          <option value="Waiter">Waiter</option>
          <option value="Cashier">Cashier</option>
        </select>

        <button style={{ padding: 12 }}>Create Staff</button>
      </form>

      {msg && <p style={{ color: "green", marginTop: 12 }}>{msg}</p>}
      {err && <p style={{ color: "red", marginTop: 12 }}>{err}</p>}

      <hr style={{ margin: "20px 0" }} />

      <h3>Newly created (temporary list)</h3>
      {staff.length === 0 ? (
        <p>No staff shown yet.</p>
      ) : (
        <ul>
          {staff.map((s) => (
            <li key={s.id}>
              {s.fullName} — {s.email} — <b>{s.role}</b> (RestaurantId: {s.restaurantId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
