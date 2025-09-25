import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Lấy danh mục
        const resCats = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
        if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`);
        const cats = await resCats.json();
        setCategories(Array.isArray(cats) ? cats : cats?.data ?? []);

        // ✅ Lấy sản phẩm
        const resProds = await fetch(`${API_BASE}/products`, { signal: ac.signal });
        if (!resProds.ok) throw new Error(`HTTP ${resProds.status}`);
        const prods = await resProds.json();

        // Demo: cắt 4 sản phẩm đầu là "mới", 4 cuối là "giảm giá"
        const list = Array.isArray(prods) ? prods : prods?.data ?? [];
        setNewItems(list.slice(0, 4));
        setSaleItems(list.slice(-4));
      } catch (err) {
        if (err.name !== "AbortError") setError("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Montserrat, Arial, sans-serif",
        background: "#f1f8e9",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          padding: "48px 0 32px",
          textAlign: "center",
          background: "linear-gradient(90deg, #e8f5e9 60%, #fffde7 100%)",
        }}
      >
        <h1
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#388e3c",
            marginBottom: 10,
          }}
        >
          MotoBikeStore🏍️🛵
        </h1>
        <p style={{ fontSize: 18, color: "#4caf50" }}>
          Nơi cung cấp các loại xe máy chất lượng cao, đa dạng mẫu mã và giá cả hợp lý.
        </p>
      </section>

      {/* Danh mục nổi bật */}
      <section style={{ margin: "40px 0" }}>
        <h2
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#388e3c" }}
        >
          Danh mục nổi bật
        </h2>

        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>Chưa có danh mục.</p>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/category/${c.id}`)} // ✅ sang CategoryProducts
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #e0f2f1",
                  padding: "16px",
                  minWidth: 160,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#388e3c",
                  border: "1px solid #e0f2f1",
                  cursor: "pointer",
                  transition: "transform .12s ease, box-shadow .12s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    height: 100,
                    marginBottom: 8,
                    overflow: "hidden",
                    borderRadius: 8,
                    background: "#f1f8e9",
                  }}
                >
                  <img
                    src={c.image_url || PLACEHOLDER}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>
                {c.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Trạng thái */}
      {loading && (
        <p style={{ textAlign: "center", color: "#388e3c" }}>Đang tải dữ liệu...</p>
      )}
      {error && <p style={{ textAlign: "center", color: "#d32f2f" }}>{error}</p>}

      {/* Sản phẩm */}
      {!loading && !error && (
        <>
          <section style={{ margin: "40px 0" }}>
            <h2
              style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#388e3c" }}
            >
              Sản phẩm mới
            </h2>
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {newItems.map((p) => (
                <ProductCard
                  key={p.id}
                  p={{ ...p, image: p.image_url || PLACEHOLDER }}

                />
              ))}
            </div>
          </section>

          <section style={{ margin: "40px 0" }}>
            <h2
              style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#ff7043" }}
            >
              Đang giảm giá
            </h2>
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {saleItems.map((p) => (
                <ProductCard
                  key={p.id}
                  p={{ ...p, image: p.image_url || PLACEHOLDER }}

                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* About */}
      <section
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px #e0f2f1",
          padding: "32px 24px",
          margin: "40px auto 24px",
          maxWidth: 700,
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, color: "#388e3c" }}
        >
          Về chúng tôi
        </h2>
        <p style={{ color: "#4caf50", fontSize: 16 }}>
          MotoBikeStore cam kết mang đến cho khách hàng những sản phẩm xe máy chất lượng cao,
          đa dạng về mẫu mã và giá cả hợp lý. Với đội ngũ nhân viên tận tâm và chuyên nghiệp,
          chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc lựa chọn chiếc xe phù hợp nhất với
          nhu cầu và sở thích của bạn. Hãy đến với MotoBikeStore để trải nghiệm dịch vụ
          tuyệt vời và sở hữu những chiếc xe máy ưng ý nhất!
        </p>
      </section>
    </div>
  );
}
