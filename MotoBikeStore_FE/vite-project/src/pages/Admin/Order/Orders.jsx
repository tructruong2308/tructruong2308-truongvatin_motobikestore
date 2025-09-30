import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

const badgeView = (s) => {
  const m = {
    0: { t: "Pending",    bg: "#fff6e6", color: "#a35b00" },
    1: { t: "Processing", bg: "#e6f0ff", color: "#0f62fe" },
    2: { t: "Completed",  bg: "#e7f9ee", color: "#0a7a3f" },
    3: { t: "Cancelled",  bg: "#fde7e7", color: "#b00020" },
  }[s] || { t: s, bg: "#eee", color: "#333" };
  return {
    label: m.t,
    style: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      background: m.bg,
      color: m.color,
      fontSize: 12,
    },
  };
};

export default function Orders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);

  // =============== LOAD DANH SÁCH ===============
  useEffect(() => {
    if (selectedId) return; // không load list khi đang xem chi tiết
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/orders`, {
  headers: {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setRows(data.data || []);
      } catch (e) {
        setErr("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedId]);

  // =============== LOAD CHI TIẾT ===============
  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        setOrderDetail(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/orders/${selectedId}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setOrderDetail(data);
      } catch (e) {
        setErr("Không tải được chi tiết đơn hàng.");
      }
    })();
  }, [selectedId]);

  // =============== VIEW CHI TIẾT ===============
  if (selectedId && orderDetail) {
    return (
      <section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>
          Đơn hàng #{orderDetail.id}
        </h2>

        <div style={{ marginBottom: 16 }}>
          <p><b>Khách hàng:</b> {orderDetail.name}</p>
          <p><b>Email:</b> {orderDetail.email}</p>
          <p><b>Điện thoại:</b> {orderDetail.phone}</p>
          <p><b>Địa chỉ:</b> {orderDetail.address}</p>
        </div>

        <h3>Chi tiết sản phẩm</h3>
        <table
          width="100%"
          cellPadding={8}
          style={{ borderCollapse: "collapse", marginTop: 8 }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th align="left">Sản phẩm</th>
              <th align="right">Giá</th>
              <th align="center">SL</th>
              <th align="right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.details.map((d) => (
              <tr key={d.id} style={{ borderTop: "1px solid #eee" }}>
                <td>
                  {d.product?.thumbnail_url && (
                    <img
                      src={d.product.thumbnail_url}
                      alt={d.product?.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        marginRight: 6,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {d.product?.name || "Sản phẩm #" + d.product_id}
                </td>
                <td align="right">₫{d.price_buy.toLocaleString("vi-VN")}</td>
                <td align="center">{d.qty}</td>
                <td align="right">₫{d.amount.toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 16, fontWeight: "bold", fontSize: 16 }}>
          Tổng tiền: ₫{orderDetail.total.toLocaleString("vi-VN")}
        </p>

        <button
          onClick={() => setSelectedId(null)}
          style={{
            marginTop: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #0f62fe",
            background: "#0f62fe",
            color: "#fff",
          }}
        >
          ← Quay lại
        </button>
      </section>
    );
  }

  // =============== VIEW DANH SÁCH ===============
  return (
    <section>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Đơn hàng</h1>
      {loading && <p>Đang tải...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <table
        width="100%"
        cellPadding={8}
        style={{ borderCollapse: "collapse", background: "#fff" }}
      >
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th align="left">Đặt hàng #</th>
            <th align="left">Khách hàng</th>
            <th align="left">E-mail</th>
            <th align="right">Tổng tiền</th>
            <th align="left">Trạng thái</th>
            <th align="center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => {
            const badge = badgeView(o.status);
            const total = o.total ?? o.details_sum_amount ?? 0;
            return (
              <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{o.id}</td>
                <td>{o.name}</td>
                <td>{o.email}</td>
                <td align="right">₫{Number(total).toLocaleString("vi-VN")}</td>
                <td>
                  <span style={badge.style}>{badge.label}</span>
                </td>
                <td align="center">
                  <button onClick={() => setSelectedId(o.id)}>Xem</button>
                </td>
              </tr>
            );
          })}
          {!rows.length && !loading && (
            <tr>
              <td colSpan={6} align="center" style={{ padding: 18 }}>
                Không có đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
