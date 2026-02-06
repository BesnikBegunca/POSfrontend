import { useState } from "react";
import axios from "axios";

export default function CreateRestaurant() {
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5083/api/superadmin/restaurants",
        {
          restaurantName,
          ownerFullName,
          ownerEmail,
          ownerPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMsg("Restaurant + Owner u krijuan me sukses ✅");

      setRestaurantName("");
      setOwnerFullName("");
      setOwnerEmail("");
      setOwnerPassword("");
    } catch (e2) {
      setErr(
        e2?.response?.data
          ? JSON.stringify(e2.response.data)
          : "Gabim gjatë krijimit"
      );
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "60px auto" }}>
      <h2>Create Restaurant (SuperAdmin)</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Restaurant name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <input
          placeholder="Owner full name"
          value={ownerFullName}
          onChange={(e) => setOwnerFullName(e.target.value)}
        />

        <input
          placeholder="Owner email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Owner password"
          value={ownerPassword}
          onChange={(e) => setOwnerPassword(e.target.value)}
        />

        <button>Create Restaurant</button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
