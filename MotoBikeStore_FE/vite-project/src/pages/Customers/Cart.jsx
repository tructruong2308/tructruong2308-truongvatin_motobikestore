const VND = new Intl.NumberFormat("vi-VN");

export default function Cart({ cart = [], setCart }) {
  const updateQty = (id, qty) => setCart(list => list.map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));
  const removeItem = (id) => setCart(list => list.filter(x => x.id !== id));
  const total = cart.reduce((s, i) => s + (i.qty || 1) * Number(i.price || 0), 0);

  return (
    <div className="u-grid" style={{ gap: 16 }}>
      <h1 style={{ margin: 0 }}>Giỏ hàng</h1>

      <div className="u-card u-border" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th style={{ width: 120 }}>Giá</th>
              <th style={{ width: 140 }}>Số lượng</th>
              <th style={{ width: 140 }}>Tạm tính</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#9fb3d9" }}>Giỏ hàng trống</td></tr>
            )}
            {cart.map(it => (
              <tr key={it.id}>
                <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <img src={it.thumbnail_url || "https://placehold.co/60x40?text=No+Img"} style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ fontWeight: 700 }}>{it.name}</div>
                </td>
                <td>{VND.format(it.price || 0)}₫</td>
                <td>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button className="u-btn outline" onClick={() => updateQty(it.id, (it.qty || 1) - 1)}>-</button>
                    <input className="u-input" value={it.qty || 1} onChange={e => updateQty(it.id, +e.target.value || 1)} style={{ width: 64, textAlign: "center" }} />
                    <button className="u-btn outline" onClick={() => updateQty(it.id, (it.qty || 1) + 1)}>+</button>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{VND.format((it.qty || 1) * (it.price || 0))}₫</td>
                <td><button className="u-btn ghost" onClick={() => removeItem(it.id)}>Xoá</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="u-card u-border" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Tổng: {VND.format(total)}₫</div>
        <a className="u-btn" href="/checkout">Thanh toán</a>
      </div>
    </div>
  );
}
