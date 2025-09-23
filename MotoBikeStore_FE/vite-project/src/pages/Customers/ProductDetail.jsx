// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const API_URL = "http://127.0.0.1:8000/products"

export default function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err)
          setError("Không tải được sản phẩm.")
        }
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [id])

  if (loading) return <p style={{ padding: 20 }}>Đang tải sản phẩm...</p>
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate(-1)}>⬅ Quay lại</button>
      </div>
    )
  }

  const price = Number(product.price ?? product.price_sale ?? 0)
  const imgSrc = product.thumbnail_url || "https://placehold.co/400x300?text=No+Image"
  const brandLabel = product.brand ? `Thương hiệu #${product.brand}` : "Farm Local"

  return (
    <div
      className="product-detail"
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #e0f2f1",
      }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ⬅ Quay lại
      </button>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 300px" }}>
          <img
            src={imgSrc}
            alt={product.name}
            style={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300?text=No+Image")}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0 0 12px", color: "#2e7d32" }}>{product.name}</h2>
          <p style={{ margin: "6px 0", fontSize: 15, color: "#555" }}>{brandLabel}</p>
          <p style={{ margin: "6px 0", fontWeight: 600, color: "#388e3c" }}>
            {price.toLocaleString()} đ
          </p>
          <p style={{ margin: "12px 0", fontSize: 15, lineHeight: 1.5, color: "#444" }}>
            {product.description || "Chưa có mô tả chi tiết."}
          </p>

          {typeof addToCart === "function" && (
            <button
              onClick={() => addToCart(product)}
              style={{
                marginTop: 16,
                background: "#388e3c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2e7d32")}
              onMouseLeave={(e) => (e.target.style.background = "#388e3c")}
            >
              + Thêm vào giỏ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
