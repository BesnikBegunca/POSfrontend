import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5083";

export default function ManagerProducts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    setErr("");
    setMsg("");
    try {
      setLoading(true);
      const r = await axios.get(`${API}/api/manager/products`, { headers });
      setItems(r.data ?? []);
    } catch {
      setErr("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDiscountPercent("");
    setQuantity("");
    setImageFile(null);
    const el = document.getElementById("product-image");
    if (el) el.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("discountPercent", discountPercent || 0);
      fd.append("quantity", quantity);
      if (imageFile) fd.append("image", imageFile);

      await axios.post(`${API}/api/manager/products`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setMsg("Created ✅");
      resetForm();
      load();
    } catch {
      setErr("Error creating product");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API}/api/manager/products/${id}`, { headers });
    load();
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manager Dashboard</h1>
          <p style={styles.subtitle}>Manage your products</p>
        </div>

        <button onClick={() => navigate("/stores")} style={styles.blackBtn}>
          ← Back
        </button>
      </div>

      {/* LAYOUT */}
      <div style={styles.layout}>
        {/* FORM CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Product</h3>

          <form onSubmit={submit} style={styles.form}>
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />

            <textarea
              style={{ ...styles.input, minHeight: 90 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <div style={styles.row2}>
              <input style={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
              <input style={styles.input} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="Discount %" />
            </div>

            <input style={styles.input} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Stock" />

            <input
              id="product-image"
              type="file"
              accept="image/*"
              style={styles.input}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />

            <button style={styles.blackBtn}>Create</button>
          </form>

          {msg && <div style={styles.success}>{msg}</div>}
          {err && <div style={styles.error}>{err}</div>}
        </div>

        {/* TABLE CARD */}
        <div style={styles.card}>
          <div style={styles.listHeader}>
            <h3 style={styles.cardTitle}>Your Products</h3>
            <button onClick={load} style={styles.smallBtn}>Refresh</button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Photo</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td style={styles.td}>
                        <img
                          src={p.imageUrl ? `${API}${p.imageUrl}` : "https://via.placeholder.com/80"}
                          style={styles.img}
                        />
                      </td>

                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>€{p.price}</td>
                      <td style={styles.td}>{p.quantity}</td>

                      <td style={styles.td}>
                        <button onClick={() => remove(p.id)} style={styles.deleteBtn}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F6F6F2",
    padding: 24,
    fontFamily: "Inter, sans-serif",
    color: "#0F172A",
  },

  header: {
    maxWidth: 1200,
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { margin: 0, fontWeight: 900 },
  subtitle: { margin: "6px 0 0", opacity: 0.6 },

  layout: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 20,
  },

  card: {
    background: "#FFFFFF",
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,.08)",
    padding: 20,
  },

  cardTitle: {
    margin: "0 0 12px",
    fontWeight: 900,
  },

  form: {
    display: "grid",
    gap: 12,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,.1)",
    background: "#F7F7F4",
    fontSize: 14,
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  blackBtn: {
    padding: "12px",
    borderRadius: 12,
    background: "#0B0F19",
    color: "#fff",
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
  },

  smallBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,.1)",
    background: "#fff",
    cursor: "pointer",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: 10,
    fontSize: 13,
    borderBottom: "1px solid rgba(15,23,42,.1)",
  },

  td: {
    padding: 10,
    borderBottom: "1px solid rgba(15,23,42,.05)",
  },

  img: {
    width: 70,
    height: 50,
    objectFit: "cover",
    borderRadius: 8,
  },

  deleteBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#FFB4B4",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },

  success: { color: "green", marginTop: 10 },
  error: { color: "red", marginTop: 10 },
};
