// src/pages/Customers/Checkout.jsx
import { useMemo, useState } from "react";

const VND = new Intl.NumberFormat("vi-VN");
const API_BASE = "http://127.0.0.1:8000/api";

export default function Checkout({ cart = [], setCart }) {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const total = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 1) * Number(i.price || 0), 0),
    [cart]
  );

  const submit = async () => {
    setMsg("");

    if (!form.customer_name || !form.phone || !form.address) {
      setMsg("Vui lòng nhập đủ Họ tên, SĐT và Địa chỉ.");
      return;
    }

    // 🔧 Chuẩn hoá từng item với đầy đủ biến thể tên field
    const items = cart.map((i) => {
      const q = Number(i.qty || 1);
      const p = Number(i.price || 0);
      return {
        // ID sản phẩm (cả 2 biến thể)
        id: i.id,
        product_id: i.id,

        // Tên & ảnh (tuỳ chọn)
        name: i.name,
        thumbnail: i.thumbnail_url || null,

        // Số lượng (2 biến thể)
        qty: q,
        quantity: q,

        // Đơn giá (2 biến thể)
        price: p,
        unit_price: p,

        // Thành tiền cho từng dòng
        total: q * p,
      };
    });

    // ✅ Payload “siêu tương thích”: vừa nhóm name..., vừa nhóm customer_...
    const payload = {
      // nhóm tên thường gặp
      name: form.customer_name,
      phone: form.phone,
      email: form.email || null,
      address: form.address,
      note: form.note || null,
      total: Math.round(total) || 0,
      status: 1,
      items,
      order_details: items,

      // nhóm tên kiểu customer_*
      customer_name: form.customer_name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      customer_address: form.address,
      customer_note: form.note || null,
      customer_total: Math.round(total) || 0,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // đọc JSON kể cả khi lỗi để hiện chi tiết 422
      let data = {};
      try { data = await res.json(); } catch {}

      if (res.status === 401) {
        setMsg("Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!res.ok) {
        const details =
          data?.errors
            ? Object.entries(data.errors)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join(" | ")
            : null;
        const apiMsg = data?.message || details || `HTTP ${res.status}`;
        throw new Error(apiMsg);
      }

      setMsg("✅ Đặt hàng thành công!");
      setCart([]); localStorage.removeItem("cart");
    } catch (e) {
      setMsg(`❌ Lỗi: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="u-grid" style={{ gap: 16 }}>
      <h1 style={{ margin: 0 }}>Thanh toán</h1>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.2fr .8fr" }}>
        {/* Form */}
        <div className="u-card u-border" style={{ padding: 16, display: "grid", gap: 10 }}>
          <input
            className="u-input"
            placeholder="Họ tên"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          />
          <input
            className="u-input"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="u-input"
            placeholder="Email (tuỳ chọn)"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="u-input"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <textarea
            className="u-input"
            placeholder="Ghi chú"
            rows={4}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          {msg && (
            <div
              className="u-card u-border"
              style={{
                padding: 10,
                color: msg.startsWith("✅") ? "#6fe0b1" : "#ff9b9b",
              }}
            >
              {msg}
            </div>
          )}

          <button className="u-btn" onClick={submit} disabled={loading}>
            {loading ? "Đang gửi…" : "Đặt hàng"}
          </button>
        </div>

        {/* Summary */}
        <div className="u-card u-border" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Tóm tắt đơn</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {cart.map((i) => (
              <div
                key={i.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <img
                  src={i.thumbnail_url || "https://placehold.co/60x40?text=No+Img"}
                  style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 8 }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{i.name}</div>
                  <div className="u-chip">
                    x{i.qty || 1} · {VND.format(i.price || 0)}₫
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>
                  {VND.format((i.qty || 1) * (i.price || 0))}₫
                </div>
              </div>
            ))}
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,.08)", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
            <div>Tổng cộng</div>
            <div>{VND.format(total)}₫</div>
          </div>
        </div>
      </div>
    </div>
  );
}
