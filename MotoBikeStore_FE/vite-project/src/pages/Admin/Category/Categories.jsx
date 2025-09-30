import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";
const PLACEHOLDER = "https://placehold.co/80x60?text=No+Img";

// -- tiện ích: tạo slug tiếng Việt
function removeVietnameseTones(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
function slugify(str = "") {
  const noAccent = removeVietnameseTones(str);
  return noAccent
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  // form tạo mới
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    sort_order: 0,
    description: "",
    parent_id: ""
  });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token"); // Sanctum bearer

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setRows(data.data || []);
      } catch (e) {
        console.error(e);
        setErr("Không tải được danh mục.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (c) =>
        c.name?.toLowerCase().includes(s) ||
        c.slug?.toLowerCase().includes(s)
    );
  }, [q, rows]);

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "sort_order" ? Number(value) : value }));
  };

  const onChangeName = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, name: value, slug: f.slug || slugify(value) }));
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nhập tên danh mục");
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      image: form.image.trim() || null,
      sort_order: form.sort_order || 0,
      description: form.description || "",
      parent_id: form.parent_id ? Number(form.parent_id) : null,
    };

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Tạo danh mục thất bại");
      }
      const data = await res.json();
      const created = data.data || data;
      setRows((prev) => [created, ...prev]);
      setOpenAdd(false);
      setForm({ name: "", slug: "", image: "", sort_order: 0, description: "", parent_id: "" });
    } catch (e) {
      console.error(e);
      alert("❌ Không thể tạo danh mục. Hãy kiểm tra token đăng nhập và dữ liệu hợp lệ.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("❌ Không thể xóa. Kiểm tra token hoặc danh mục đã liên quan sản phẩm.");
    }
  };

  return (
    <section>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 24 }}>Categories</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên/slug…"
            style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
          />
          <button
            onClick={() => setOpenAdd(true)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #0f62fe", background: "#0f62fe", color: "#fff" }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Trạng thái */}
      {loading && <p style={{ marginTop: 12 }}>Đang tải dữ liệu...</p>}
      {err && <p style={{ marginTop: 12, color: "red" }}>{err}</p>}

      {/* Bảng */}
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th align="left">ID</th>
              <th align="left">Tên</th>
              <th align="left">Slug</th>
              <th align="left">Ảnh</th>
              <th align="center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>
                  <img
                    src={c.image_url || PLACEHOLDER}
                    alt={c.name}
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, transition: "transform 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </td>
                <td align="center">
                  <button onClick={() => alert("TODO: Edit " + c.id)} style={{ marginRight: 8 }}>Sửa</button>
                  <button onClick={() => deleteCategory(c.id)} style={{ color: "#d32f2f" }}>Xóa</button>
                </td>
              </tr>
            ))}
            {!filtered.length && !loading && (
              <tr>
                <td colSpan={5} align="center" style={{ padding: 18, color: "#777" }}>
                  Trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal tạo mới (đơn giản) */}
      {openAdd && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenAdd(false);
          }}
        >
          <form
            onSubmit={createCategory}
            style={{
              width: 420,
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <h3 style={{ marginBottom: 4 }}>Tạo danh mục</h3>

            <label>
              <div>Tên *</div>
              <input
                name="name"
                value={form.name}
                onChange={onChangeName}
                placeholder="Ví dụ: Áo thun"
                style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
                required
              />
            </label>

            <label>
              <div>Slug *</div>
              <input
                name="slug"
                value={form.slug}
                onChange={onChangeForm}
                placeholder="ao-thun"
                style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
                required
              />
            </label>

            <label>
              <div>Ảnh (tên file trong public/assets/images)</div>
              <input
                name="image"
                value={form.image}
                onChange={onChangeForm}
                placeholder="ao-thun.jpg"
                style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label>
              <div>Thứ tự</div>
              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={onChangeForm}
                style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label>
              <div>Parent ID (nếu có)</div>
              <input
                type="number"
                name="parent_id"
                value={form.parent_id}
                onChange={onChangeForm}
                style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label>
              <div>Mô tả</div>
              <textarea
                name="description"
                value={form.description}
                onChange={onChangeForm}
                rows={3}
                style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8, resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" onClick={() => setOpenAdd(false)}>Hủy</button>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #0f62fe", background: "#0f62fe", color: "#fff" }}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
