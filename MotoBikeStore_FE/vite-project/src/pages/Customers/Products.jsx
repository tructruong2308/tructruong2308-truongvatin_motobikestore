import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API_URL = "http://127.0.0.1:8000/products"
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image"
const VND = new Intl.NumberFormat("vi-VN")

export default function Products({ addToCart }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(API_URL, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Lỗi khi tải sản phẩm:", e)
          setErr("Không tải được danh sách sản phẩm.")
        }
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [])

  if (loading) return <p style={{ padding: 20 }}>Đang tải sản phẩm...</p>
  if (err) return <p style={{ padding: 20, color: "#d32f2f" }}>{err}</p>
  if (!items.length) return <p style={{ padding: 20 }}>Chưa có sản phẩm.</p>

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20, color: "#388e3c" }}>🌿 Sản phẩm</h2>

      <div
        className="products"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {items.map((p) => {
          const price = Number(p.price ?? 0)
          const imgSrc = p.thumbnail_url || PLACEHOLDER
          const brandLabel = p.brand ? `Thương hiệu #${p.brand}` : "Farm Local"

          return (
            <div
              key={p.id}
              className="product-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px #e0f2f1",
                padding: 20,
                textAlign: "center",
                fontSize: 15,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 4px 12px #b2dfdb"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px #e0f2f1"
              }}
            >
              <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="product-image"
                  style={{
                    background: "#f1f8e9",
                    borderRadius: 8,
                    height: 140,
                    marginBottom: 12,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={p.name}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2e7d32", margin: "8px 0" }}>
                  {p.name}
                </h3>
              </Link>

              <p style={{ color: "#616161", margin: "4px 0" }}>{brandLabel}</p>
              <p style={{ fontWeight: 600, color: "#388e3c", margin: "4px 0 12px" }}>
                {price > 0 ? `${VND.format(price)} đ` : "Liên hệ"}
              </p>

              {typeof addToCart === "function" && (
                <button
                  onClick={() => addToCart(p)}
                  style={{
                    background: "#388e3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#2e7d32")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#388e3c")}
                >
                  + Thêm vào giỏ
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
