// src/pages/Admin/Product/Products.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api"; // Laravel API
const IMG_PLACEHOLDER = "https://placehold.co/50x50?text=No+Img";

// ===== Helpers =====
const formatVND = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("vi-VN") : "0";
};

// Lấy giá gốc dù BE đặt key khác nhau (price_root | price | priceRoot)
const pickPriceRoot = (p) => p?.price_root ?? p?.price ?? p?.priceRoot ?? 0;

// Lấy ảnh có thể là thumbnail_url | thumbnail, nếu rỗng dùng placeholder
const getThumb = (p) => p?.thumbnail_url || p?.thumbnail || IMG_PLACEHOLDER;

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  // ✅ Gọi API lấy danh sách sản phẩm
  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("token");

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API_BASE}/products`, {
          signal: ac.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Trường hợp Laravel trả về { data: [...] } hoặc { items: [...] }
        const list = Array.isArray(data) ? data : data.data ?? data.items ?? [];
        setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được sản phẩm.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // ✅ Lọc theo tên hoặc SKU
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (x) =>
        x?.name?.toLowerCase().includes(s) ||
        x?.sku?.toLowerCase().includes(s)
    );
  }, [q, items]);

  // ✅ Hàm xóa sản phẩm
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name || id}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert("❌ Không thể xóa sản phẩm.");
    }
  };

  return (
    <section>
      {/* Thanh tìm kiếm + nút thêm */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Products</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên/SKU…"
            style={{
              height: 36,
              padding: "0 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
              minWidth: 220,
            }}
          />
          <button
            onClick={() => alert("TODO: mở form tạo sản phẩm")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0f62fe",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Trạng thái */}
      {loading && <p style={{ marginTop: 12 }}>Đang tải dữ liệu...</p>}
      {err && <p style={{ marginTop: 12, color: "red" }}>{err}</p>}

      {/* Bảng sản phẩm */}
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table
          width="100%"
          cellPadding={8}
          style={{ borderCollapse: "collapse", background: "#fff" }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th align="left">ID</th>
              <th align="left">Ảnh</th>
              <th align="left">Tên</th>
              <th align="left">SKU</th>
              <th align="right">Giá gốc</th>
              <th align="right">Tồn</th>
              <th align="center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={getThumb(p)}
                    alt={p.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 6,
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.5)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onError={(e) => {
                      e.currentTarget.src = IMG_PLACEHOLDER;
                    }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td align="right">₫{formatVND(pickPriceRoot(p))}</td>
                <td align="right">{Number(p?.qty ?? 0)}</td>
                <td align="center">
                  <button
                    onClick={() => alert("Edit " + p.id)}
                    style={{ marginRight: 6, cursor: "pointer" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    style={{ cursor: "pointer" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && !loading && (
              <tr>
                <td
                  colSpan={7}
                  align="center"
                  style={{ padding: 18, color: "#777" }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
