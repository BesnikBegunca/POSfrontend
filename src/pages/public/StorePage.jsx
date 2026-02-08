import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:5083";

export default function StorePage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await axios.get(`${API}/api/public/stores/${slug}`);
      setStore(r.data.store);
      setProducts(r.data.products ?? []);
    })();
  }, [slug]);

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>{store?.name ?? "Store"}</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 18,
            marginTop: 18,
          }}
        >
          {products.map((p) => {
            const pr = Number(p.price || 0);
            const d = Number(p.discountPercent || 0);
            const finalP = d > 0 ? pr * (1 - d / 100) : pr;

            return (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 30px rgba(0,0,0,.06)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={p.imageUrl ? `${API}${p.imageUrl}` : "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={p.name}
                    style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }}
                  />
                  {d > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "#111827",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      -{d}%
                    </div>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{p.name}</div>
                  <div style={{ opacity: 0.75, fontSize: 13, marginTop: 6, minHeight: 34 }}>
                    {p.description || "—"}
                  </div>

                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>
                      €{finalP.toFixed(2)}
                      {d > 0 && (
                        <span style={{ marginLeft: 8, opacity: 0.6, textDecoration: "line-through", fontWeight: 700, fontSize: 13 }}>
                          €{pr.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      Stock: <b>{p.quantity}</b>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
