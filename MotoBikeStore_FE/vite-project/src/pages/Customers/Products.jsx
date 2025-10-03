// src/pages/Customers/Products.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const API_ROOT = "http://127.0.0.1:8000";
const API_PRODUCTS = `${API_ROOT}/api/products`;
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";
const PER_PAGE = 12;

// helpers
const asArray = (d) => (Array.isArray(d) ? d : d?.data ?? []);
const parseMeta = (d) => ({
  cur: d?.meta?.current_page ?? d?.current_page ?? 1,
  last: d?.meta?.last_page ?? d?.last_page ?? 1,
});

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");

  // ---------- LOAD ALL PRODUCTS ----------
  useEffect(() => {
    const ac = new AbortController();

    const getPage = async (page) => {
      const url = `${API_PRODUCTS}?page=${page}&per_page=${PER_PAGE}`;
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        return await res.json();
      } catch {
        return {};
      }
    };

    const dedupePush = (acc, seen, list) => {
      let added = 0;
      for (const p of list) {
        const key = p?.id ?? p?.product_id ?? p?.slug ?? JSON.stringify(p);
        if (!seen.has(key)) {
          seen.add(key);
          acc.push(p);
          added++;
        }
      }
      return added;
    };

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const all = [];
        const seen = new Set();

        // page 1
        const first = await getPage(1);
        const list1 = asArray(first);
        dedupePush(all, seen, list1);

        const { last } = parseMeta(first);

        if (last > 1) {
          // tải song song 2..last
          const pages = Array.from({ length: last - 1 }, (_, i) => i + 2);
          const datas = await Promise.allSettled(pages.map((p) => getPage(p)));
          for (const r of datas) {
            if (r.status === "fulfilled") {
              dedupePush(all, seen, asArray(r.value));
            }
          }
        } else {
          // fallback tuần tự cho API không trả meta
          for (let page = 2; page <= 300; page++) {
            const data = await getPage(page);
            const list = asArray(data);
            if (!list.length) break;
            const added = dedupePush(all, seen, list);
            if (added === 0) break;
          }
        }

        setItems(all);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // ---------- ADD TO CART (fallback + lắng nghe sự kiện từ ProductCard) ----------
  const addToCartLocal = (product) => {
    // Nếu bạn muốn bắt buộc đăng nhập, giữ đoạn này; nếu không, xoá 3 dòng dưới
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi thêm sản phẩm!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const id = product?.id ?? product?.product_id;
    const price = Number(product?.price_sale ?? product?.price ?? product?.unit_price ?? 0);
    const name = product?.name || "Sản phẩm";
    const thumb = product?.thumbnail_url || product?.image_url || product?.thumbnail || "";

    const idx = cart.findIndex((x) => x.id === id);
    if (idx > -1) {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      cart.push({ id, name, price, thumbnail_url: thumb, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Đã thêm vào giỏ hàng!");
  };

  // Lắng nghe sự kiện “add-to-cart” do ProductCard bắn ra (nếu nó dùng window.dispatchEvent)
  useEffect(() => {
    const onAdd = (e) => {
      if (e?.detail) addToCartLocal(e.detail);
    };
    window.addEventListener("add-to-cart", onAdd);
    return () => window.removeEventListener("add-to-cart", onAdd);
  }, []);

  // ---------- FILTER + SORT ----------
  const filtered = useMemo(() => {
    const norm = (s) => (s || "").toString().toLowerCase();
    const kw = norm(q);

    let arr = !kw
      ? items
      : items.filter((p) =>
          `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase().includes(kw)
        );

    const priceOf = (p) => Number(p.price_sale ?? p.price ?? p.unit_price ?? 0);

    switch (sort) {
      case "name_asc":
        arr = [...arr].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "price_asc":
        arr = [...arr].sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price_desc":
        arr = [...arr].sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "new":
      default:
        arr = [...arr].sort((a, b) => {
          const ca = new Date(a.created_at || 0).getTime();
          const cb = new Date(b.created_at || 0).getTime();
          if (cb !== ca) return cb - ca;
          return (b.id || 0) - (a.id || 0);
        });
    }
    return arr;
  }, [items, q, sort]);

  // ---------- UI ----------
  return (
    <div className="page-wrap product-page">
      {/* Toolbar */}
      <div
        className="u-card u-border"
        style={{
          padding: 12,
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, color: "var(--txt-inv,#eaf5ff)" }}>Tất cả sản phẩm</h2>

          {/* Chip “Tổng” có màu tương phản, luôn nhìn thấy */}
          <span
            className="u-chip"
            style={{
              background: "rgba(33,202,185,.18)",
              borderColor: "rgba(33,202,185,.35)",
              color: "#21cab9",
              fontWeight: 800,
            }}
          >
            Tổng: {items.length}
          </span>

          {q && (
            <span
              className="u-chip"
              style={{
                background: "rgba(104,117,245,.18)",
                borderColor: "rgba(104,117,245,.35)",
                color: "#6875F5",
                fontWeight: 700,
              }}
            >
              Kết quả: {filtered.length}
            </span>
          )}
        </div>

        <input
          className="u-input"
          placeholder="🔍 Tìm sản phẩm…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 220 }}
        />

        <select
          className="u-input"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Mới nhất</option>
          <option value="name_asc">Tên A→Z</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Grid */}
      {loading && items.length === 0 ? (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : err && items.length === 0 ? (
        <p style={{ padding: 20, color: "#d32f2f" }}>{err}</p>
      ) : !items.length ? (
        <p style={{ padding: 20 }}>Chưa có sản phẩm.</p>
      ) : (
        <div
          className="products-grid"
          style={{
            marginTop: 16,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          }}
        >
          {filtered.map((p) => (
            <ProductCard
              key={p.id ?? `${p.product_id}-${p.slug ?? ""}`}
              p={{
                ...p,
                image: p.thumbnail_url || p.thumbnail || p.image_url || PLACEHOLDER,
              }}
              // Nếu ProductCard hỗ trợ prop onAdd, mở comment dưới:
              // onAdd={() => addToCartLocal(p)}
            />
          ))}
        </div>
      )}

      <p style={{ marginTop: 24, textAlign: "center" }}>
        <Link to="/" style={{ color: "var(--brand,#21cab9)" }}>← Về trang chủ</Link>
      </p>
    </div>
  );
}
