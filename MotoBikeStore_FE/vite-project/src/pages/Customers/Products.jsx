// src/pages/Customers/Products.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

export default function Products({ addToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ Lấy tất cả sản phẩm
        const res = await fetch(`${API_BASE}/products`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setItems(list);
      } catch (e) {
        if (e.name !== "AbortError")
          setErr("Không tải được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Đang tải sản phẩm...</p>;
  if (err) return <p style={{ padding: 20, color: "#d32f2f" }}>{err}</p>;
  if (!items.length) return <p style={{ padding: 20 }}>Chưa có sản phẩm.</p>;

  // ✅ Hàm xử lý thêm giỏ hàng (check login trước)
  const handleAddToCart = (p) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi thêm sản phẩm!");
      navigate("/login", { state: { from: "/products" } });
      return;
    }
    addToCart?.(p);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16, color: "#388e3c" }}>🌿 Tất cả sản phẩm</h2>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {items.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            {/* Card có Link sang /products/:id */}
            <ProductCard
              p={{
                ...p,
                image: p.thumbnail_url || p.thumbnail || PLACEHOLDER,
              }}
            />
            {typeof addToCart === "function" && (
              <button
                onClick={() => handleAddToCart(p)}
                style={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  background: "#388e3c",
                  color: "#fff",
                  border: 0,
                  padding: "6px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                + Giỏ
              </button>
            )}
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, textAlign: "center" }}>
        <Link to="/" style={{ color: "#2e7d32" }}>
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
