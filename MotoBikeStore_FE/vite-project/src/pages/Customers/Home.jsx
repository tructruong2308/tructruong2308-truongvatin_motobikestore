// src/pages/Home.jsx
import { useEffect, useState } from "react"

const API_URL = "http://127.0.0.1:8000/products"
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image"

function ProductCard({ p }) {
  const price = Number(p.price) || 0
  const imgSrc = p.thumbnail_url || PLACEHOLDER

  return (
    <div
      className="product-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #e0f2f1",
        padding: 16,
        width: 220,
        margin: 8,
        textAlign: "center",
      }}
    >
      <div className="product-image" style={{ marginBottom: 10 }}>
        <img
          src={imgSrc}
          alt={p.name}
          style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
        />
      </div>
      <div className="product-info">
        <div className="name" style={{ fontWeight: "bold", fontSize: 16 }}>{p.name}</div>
        <div className="brand" style={{ color: "#388e3c", fontSize: 13 }}>
          {p.brand ? `Thương hiệu #${p.brand}` : "Farm Local"}
        </div>
        <div className="price" style={{ color: "#43a047", fontWeight: "bold", marginTop: 4 }}>
          {price.toLocaleString()} đ
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [newItems, setNewItems] = useState([])
  const [saleItems, setSaleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(API_URL, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setNewItems(data.slice(0, 4))
        setSaleItems(data.slice(-4))
      } catch (err) {
        if (err.name !== "AbortError") setError("Không tải được sản phẩm")
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [])

  return (
    <div
      className="home"
      style={{ fontFamily: "Montserrat, Arial, sans-serif", background: "#f1f8e9", minHeight: "100vh" }}
    >
      {/* Hero */}
      <section
        className="hero"
        style={{
          background: "linear-gradient(90deg, #e8f5e9 60%, #fffde7 100%)",
          padding: "48px 0 32px 0",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 38, fontWeight: 700, color: "#388e3c", marginBottom: 10 }}>
          StoreVegetables 🥕🥦
        </h1>
        <p style={{ fontSize: 18, color: "#4caf50" }}>
          Nơi cung cấp rau củ quả tươi sạch từ nông trại đến bàn ăn
        </p>
      </section>

      {/* Danh mục */}
      <section style={{ margin: "40px 0" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#388e3c" }}>
          Danh mục nổi bật
        </h2>
        <div
          className="categories"
          style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}
        >
          {[
            { name: "Rau lá", icon: "🥬" },
            { name: "Củ quả", icon: "🥕" },
            { name: "Trái cây", icon: "🍎" },
            { name: "Hữu cơ", icon: "🌱" },
          ].map((c, i) => (
            <div
              key={i}
              className="category-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px #e0f2f1",
                padding: "24px 32px",
                minWidth: 120,
                textAlign: "center",
                fontWeight: 500,
                fontSize: 17,
                color: "#388e3c",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* Trạng thái tải */}
      {loading && (
        <p style={{ textAlign: "center", color: "#388e3c" }}>Đang tải sản phẩm...</p>
      )}
      {error && (
        <p style={{ textAlign: "center", color: "#d32f2f" }}>{error}</p>
      )}

      {/* Sản phẩm mới */}
      {!loading && !error && (
        <>
          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#388e3c" }}>
              Sản phẩm mới
            </h2>
            <div
              className="products"
              style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}
            >
              {newItems.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>

          {/* Sản phẩm sale */}
          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#ff7043" }}>
              Đang giảm giá
            </h2>
            <div
              className="products"
              style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}
            >
              {saleItems.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* About */}
      <section
        className="about"
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px #e0f2f1",
          padding: "32px 24px",
          margin: "40px auto 24px auto",
          maxWidth: 700,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, color: "#388e3c" }}>
          Về chúng tôi
        </h2>
        <p style={{ color: "#4caf50", fontSize: 16 }}>
          StoreVegetables cam kết mang đến những sản phẩm nông sản tươi sạch, an toàn và giàu dinh dưỡng.
          Chúng tôi kết nối nông dân và người tiêu dùng, vì một cuộc sống xanh, khỏe mạnh và bền vững.
        </p>
      </section>
    </div>
  )
}
