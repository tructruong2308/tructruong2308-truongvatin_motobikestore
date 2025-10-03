// src/pages/Customers/ProductDetail.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_ROOT = "http://127.0.0.1:8000";
const API_A = `${API_ROOT}/api/products`;   // ưu tiên /api
const API_B = `${API_ROOT}/products`;       // dự phòng
const PLACEHOLDER = "https://placehold.co/800x600?text=No+Image";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // API helper — thử /api trước rồi fallback /products
  const fetchDetail = async (pid) => {
    const tryOne = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try { return await res.json(); } catch { return {}; }
    };

    try {
      const j = await tryOne(`${API_A}/${pid}`);
      return j?.data ?? j ?? null;
    } catch {
      const j2 = await tryOne(`${API_B}/${pid}`);
      return j2?.data ?? j2 ?? null;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setErr("");
        const p = await fetchDetail(id);
        if (mounted) setData(p);
      } catch (e) {
        if (mounted) setErr("Không tải được chi tiết sản phẩm.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const price = useMemo(() => {
    if (!data) return 0;
    return Number(data.price_sale ?? data.price ?? data.unit_price ?? 0);
  }, [data]);

  const imageUrl = useMemo(() => {
    if (!data) return PLACEHOLDER;
    return (
      data.thumbnail_url ||
      data.image_url ||
      data.thumbnail ||
      data.image ||
      PLACEHOLDER
    );
  }, [data]);

  const addToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi thêm sản phẩm!");
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    // Giữ cơ chế add-to-cart giống ProductCard (phát event)
    window.dispatchEvent(new CustomEvent("add-to-cart", { detail: data }));
    alert("✅ Đã thêm vào giỏ hàng!");
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải chi tiết…</div>;
  if (err) return <div style={{ padding: 20, color: "#f87171" }}>{err}</div>;
  if (!data) return <div style={{ padding: 20 }}>Không tìm thấy sản phẩm.</div>;

  return (
    <div style={{ padding: 16 }}>
      {/* Giữ bố cục cũ: 2 cột – ảnh bên trái, thông tin bên phải */}
      <div
        className="u-card u-border"
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 24,
        }}
      >
        {/* Ảnh sản phẩm — chỉ thay đổi cách bọc ảnh bằng .pd-img */}
        <div className="pd-img">
          <img
            src={imageUrl}
            alt={data?.name}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          />
        </div>

        {/* Thông tin */}
        <div style={{ display: "grid", alignContent: "start", gap: 16 }}>
          <h1 style={{ margin: 0 }}>{data?.name}</h1>

          <div
            className="u-card u-border"
            style={{
              padding: 12,
              background: "rgba(2,6,23,.35)",
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 15, opacity: 0.9 }}>Giá</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {price.toLocaleString("vi-VN")} ₫
            </div>
          </div>

          {data?.description && (
            <div className="u-card u-border" style={{ padding: 12 }}>
              {data.description}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="u-btn" onClick={addToCart}>
              Thêm vào giỏ
            </button>
            <button className="u-btn outline" onClick={() => navigate("/cart")}>
              Xem giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả dài (giữ nguyên nếu có) */}
      {data?.content && (
        <div className="u-card u-border" style={{ padding: 16, marginTop: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>Mô tả</h3>
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      )}
    </div>
  );
}
