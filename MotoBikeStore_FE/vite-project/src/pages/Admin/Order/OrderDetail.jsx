import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function OrderDetail({ id, onBack }) {
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/orders/${id}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setOrder(data);
      } catch (e) {
        setErr("Không tải được chi tiết đơn hàng.");
      }
    })();
  }, [id]);

  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!order) return <p>Đang tải chi tiết...</p>;

  return (
    <section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>
        Đơn hàng #{order.id}
      </h2>

      <div style={{ marginBottom: 16 }}>
        <p><b>Khách hàng:</b> {order.name}</p>
        <p><b>Email:</b> {order.email}</p>
        <p><b>Điện thoại:</b> {order.phone}</p>
        <p><b>Địa chỉ:</b> {order.address}</p>
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
          {order.details.map((d) => (
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
        Tổng tiền: ₫{order.total.toLocaleString("vi-VN")}
      </p>

      <button
        onClick={onBack}
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
