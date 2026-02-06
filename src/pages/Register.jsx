import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Waiter");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(
        "http://localhost:5083/api/auth/register",
        {
          fullName,
          email,
          password,
          role,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("fullName", res.data.fullName);

      window.location.href = "/dashboard";
    } catch (e2) {
      setErr(e2?.response?.data || "Register failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <h2>Register</h2>

      <form onSubmit={onSubmit}>
        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="Admin">Admin</option>
          <option value="Waiter">Waiter</option>
          <option value="Cashier">Cashier</option>
        </select>

        {err && <p style={{ color: "red" }}>{String(err)}</p>}

        <button style={{ width: "100%", padding: 10 }}>
          Create account
        </button>
      </form>
    </div>
  );
}
