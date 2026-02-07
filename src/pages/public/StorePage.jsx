import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:5083";

export default function StorePage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/public/stores/${slug}`).then(r => setData(r.data));
  }, [slug]);

  if (!data) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{data.store.name}</h1>
      <p style={{ opacity: .7 }}>{data.store.slug}</p>

      <h3>Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        {data.products.map(p => (
          <div key={p.id} style={{ padding: 14, border: "1px solid #ddd", borderRadius: 14 }}>
            <div style={{ fontWeight: 900 }}>{p.name}</div>
            <div style={{ opacity: .7 }}>{p.category}</div>
            <div style={{ marginTop: 6, fontWeight: 900 }}>
              €{(p.priceCents / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
