import { useState } from "react";

const dummy = [
  { id: 1, name: "Áo thun", slug: "ao-thun", products: 24 },
  { id: 2, name: "Quần jean", slug: "quan-jean", products: 12 },
];

export default function Categories() {
  const [rows, setRows] = useState(dummy);

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24 }}>Categories</h1>
        <button onClick={() => alert("TODO: tạo danh mục")} style={{ padding: "8px 12px", borderRadius: 8 }}>+ Add</button>
      </div>

      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff", marginTop: 12 }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th align="left">ID</th>
            <th align="left">Tên</th>
            <th align="left">Slug</th>
            <th align="right">Sản phẩm</th>
            <th align="center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td align="right">{c.products}</td>
              <td align="center">
                <button onClick={() => alert("Edit " + c.id)}>Sửa</button>{" "}
                <button onClick={() => setRows(rows.filter(x => x.id !== c.id))}>Xóa</button>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5} align="center" style={{ padding: 18 }}>Trống</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
