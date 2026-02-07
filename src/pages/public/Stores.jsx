import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5083";

export default function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/public/stores`).then(r => setStores(r.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Stores</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        {stores.map(s => (
          <Link key={s.id} to={`/store/${s.slug}`} style={{ textDecoration:"none", color:"#111" }}>
            <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 14 }}>
              <div style={{ fontWeight: 900 }}>{s.name}</div>
              <div style={{ opacity: .7 }}>{s.slug}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
