import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";
const VND = new Intl.NumberFormat("vi-VN");

export default function CategoryProducts({ addToCart }) {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Lấy thông tin danh mục
        let foundCat = null;
        try {
          const rCat = await fetch(`${API_BASE}/categories/${id}`, { signal: ac.signal });
          if (rCat.ok) {
            foundCat = await rCat.json();
            setCat(foundCat);
          } else if (rCat.status === 404) {
            setCat(null);
            setItems([]);
            return;
          } else {
            throw new Error(`HTTP ${rCat.status}`);
          }
        } catch (_) {
          setCat(null);
          setItems([]);
          return;
        }

        // Lấy sản phẩm theo category
        const r = await fetch(`${API_BASE}/categories/${id}/products`, { signal: ac.signal });
        if (!r.ok) {
          if (r.status === 404) {
            setItems([]);
          } else {
            throw new Error(`HTTP ${r.status}`);
          }
        } else {
          const contentType = r.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await r.json();
            const list = Array.isArray(data) ? data : (data?.data ?? []);
            setItems(list);
          } else {
            setItems([]);
          }
        }
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được sản phẩm của danh mục này.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (err) return <p style={{ padding: 20, color: "#d32f2f" }}>{err}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 12, color: "#388e3c" }}>
        🌿 {cat?.name || cat?.["tên"] ? `Danh mục: ${cat?.name || cat?.["tên"]}` : `Sản phẩm theo danh mục #${id}`}
      </h2>
      <p style={{ marginBottom: 16 }}>
        <Link to="/products" style={{ color: "#2e7d32" }}>← Xem tất cả sản phẩm</Link>
      </p>

      {!cat ? (
        <p style={{ color: "#d32f2f" }}>Không tìm thấy danh mục này.</p>
      ) : items.length === 0 ? (
        <p>Không có sản phẩm.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {items.map(p => {
            const name = p["tên"] || p.name;
            const price = Number(p["giá"] ?? p.price ?? 0);
            const img = p.thumbnail_url || p["hình thu nhỏ"] || PLACEHOLDER;

            return (
              <div key={p.id} style={{
                background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e0f2f1",
                padding: 16, textAlign: "center"
              }}>
                <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ height: 140, borderRadius: 8, overflow: "hidden", marginBottom: 10, background: "#f1f8e9" }}>
                    <img
                      src={img}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => e.currentTarget.src = PLACEHOLDER}
                    />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2e7d32" }}>{name}</h3>
                </Link>
                <div style={{ fontWeight: 700, color: "#388e3c", marginTop: 6 }}>
                  {price > 0 ? `${VND.format(price)} đ` : "Liên hệ"}
                </div>
                {typeof addToCart === "function" && (
                  <button
                    onClick={() => addToCart(p)}
                    style={{
                      marginTop: 10, background: "#388e3c", color: "#fff",
                      border: 0, padding: "8px 12px", borderRadius: 8, cursor: "pointer"
                    }}
                  >
                    + Thêm vào giỏ
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
