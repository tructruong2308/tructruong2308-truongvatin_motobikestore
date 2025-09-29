import { useMemo, useState } from "react";

const dummy = [
  { id: 1, name: "Áo thun trắng", sku: "TS-001", price: 150000, stock: 42 },
  { id: 2, name: "Quần jean xanh", sku: "JN-102", price: 450000, stock: 18 },
];

export default function Products() {
  const [items, setItems] = useState(dummy);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(x => x.name.toLowerCase().includes(s) || x.sku.toLowerCase().includes(s));
  }, [q, items]);

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 24 }}>Products</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Tìm tên/SKU…" style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
          />
          <button
            onClick={() => alert("TODO: mở form tạo sản phẩm")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #0f62fe", background: "#0f62fe", color: "#fff" }}
          >+ Add</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th align="left">ID</th>
              <th align="left">Tên</th>
              <th align="left">SKU</th>
              <th align="right">Giá</th>
              <th align="right">Tồn</th>
              <th align="center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td align="right">₫{p.price.toLocaleString("vi-VN")}</td>
                <td align="right">{p.stock}</td>
                <td align="center">
                  <button onClick={() => alert("Edit " + p.id)}>Sửa</button>{" "}
                  <button onClick={() => setItems(items.filter(x => x.id !== p.id))}>Xóa</button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} align="center" style={{ padding: 18, color: "#777" }}>Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
