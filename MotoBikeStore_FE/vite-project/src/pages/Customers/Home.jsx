// src/pages/Customers/Home.jsx
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000";
const CAT_PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

// Ghép URL ảnh danh mục: ưu tiên /assets/images, hỗ trợ /images, tên file trần, URL tuyệt đối
const buildCatImg = (raw) => {
  if (!raw) return CAT_PLACEHOLDER;
  const s = String(raw).trim();

  // URL tuyệt đối
  if (/^https?:\/\//i.test(s)) return s;

  // Đã kèm prefix đúng
  if (s.startsWith("/assets/images/")) return `${API_BASE}${s}`;
  if (s.startsWith("assets/images/"))  return `${API_BASE}/${s}`;

  // Hỗ trợ trường hợp BE trả /images
  if (s.startsWith("/images/")) return `${API_BASE}${s}`;
  if (s.startsWith("images/"))  return `${API_BASE}/${s}`;

  // Tên file trần -> mặc định .webp trong /assets/images
  const hasExt = /\.[a-z0-9]+$/i.test(s);
  const name = hasExt ? s : `${s}.webp`;
  return `${API_BASE}/assets/images/${name}`;
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [resCats, resNew, resSale] = await Promise.all([
          fetch(`${API_BASE}/categories`, { signal: ac.signal }),
          fetch(`${API_BASE}/products?sort=created_at:desc&limit=8`, { signal: ac.signal }),
          fetch(`${API_BASE}/products?where=has_sale&limit=8`, { signal: ac.signal }),
        ]);

        const cats = await resCats.json().catch(() => ([]));
        const n = await resNew.json().catch(() => ([]));
        const s = await resSale.json().catch(() => ([]));

        setCategories(Array.isArray(cats) ? cats : (cats?.data || []));
        setNewItems(Array.isArray(n) ? n : (n?.data || []));
        setSaleItems(Array.isArray(s) ? s : (s?.data || []));
      } catch (e) {
        if (e.name !== "AbortError") setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const onCatImgError = (e) => {
    // Thử chuyển .webp -> .jpg 1 lần trước khi dùng placeholder
    const tried = e.currentTarget.getAttribute("data-tried") || "0";
    const src = e.currentTarget.src;
    if (tried === "0" && /\.webp(\?.*)?$/i.test(src)) {
      e.currentTarget.setAttribute("data-tried", "1");
      e.currentTarget.src = src.replace(/\.webp(\?.*)?$/i, ".jpg$1");
    } else {
      e.currentTarget.src = CAT_PLACEHOLDER;
    }
  };

  return (
    <div className="u-grid" style={{ gap: 16 }}>
      {/* Hero */}
      <div className="u-card u-border u-hover" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
          <img
            src={`${API_BASE}/assets/images/banner.webp`}
            alt="banner"
            onError={(e) => (e.currentTarget.src = CAT_PLACEHOLDER)}
            style={{ width: "100%", height: 340, objectFit: "cover" }}
          />
          <div style={{ padding: 20, display: "grid", alignContent: "center", gap: 10 }}>
            <div className="u-chip">MotoBikeStore</div>
            <h1 style={{ margin: 0, lineHeight: 1.1 }}>
              Hiệu năng bùng nổ – Phong cách thể thao
            </h1>
            <p style={{ opacity: 0.85 }}>
              Khuyến mãi hấp dẫn cho xe & phụ kiện thể thao. Giao nhanh toàn quốc.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a className="u-btn" href="/products">Mua ngay</a>
              <a className="u-btn outline" href="#categories">Xem danh mục</a>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi (nếu có) */}
      {err && (
        <div className="u-card u-border" style={{ padding: 12, color: "#ff9b9b" }}>
          {err}
        </div>
      )}

      {/* Categories */}
      <section id="categories" className="u-grid" style={{ gap: 12 }}>
        <h2 style={{ margin: "4px 0 0" }}>Danh mục</h2>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          }}
        >
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="u-card u-border" style={{ padding: 10 }}>
                <div className="skeleton" style={{ height: 110, borderRadius: 10 }} />
                <div className="skeleton" style={{ height: 16, borderRadius: 6, marginTop: 8 }} />
              </div>
            ))}

          {!loading &&
            categories.map((c) => (
              <a
                key={c.id}
                href={`/category/${c.id}`}
                className="u-card u-border u-hover"
                style={{ padding: 10, textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={buildCatImg(c.image || c.image_url || c.thumbnail || c.photo || c.icon)}
                  alt={c.name}
                  data-tried="0"
                  onError={onCatImgError}
                  style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 10 }}
                />
                <div style={{ marginTop: 8, fontWeight: 700 }}>{c.name}</div>
              </a>
            ))}
        </div>
      </section>

      {/* New items */}
      <section className="u-grid" style={{ gap: 12 }}>
        <h2 style={{ margin: "12px 0 0" }}>Hàng mới</h2>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
              ))
            : newItems.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Sale items */}
      <section className="u-grid" style={{ gap: 12 }}>
        <h2 style={{ margin: "12px 0 0" }}>Đang giảm giá</h2>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
              ))
            : saleItems.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}
