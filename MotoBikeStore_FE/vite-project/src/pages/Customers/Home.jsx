import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

// ✅ Bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ State tìm kiếm
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Lấy danh mục
        const resCats = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
        if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`);
        const cats = await resCats.json();
        setCategories(Array.isArray(cats) ? cats : cats?.data ?? []);

        // Lấy sản phẩm
        const resProds = await fetch(`${API_BASE}/products`, { signal: ac.signal });
        if (!resProds.ok) throw new Error(`HTTP ${resProds.status}`);
        const prods = await resProds.json();

        const list = Array.isArray(prods) ? prods : prods?.data ?? [];
        setAllProducts(list);
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

  // ✅ Lọc sản phẩm
  const filteredProducts = query
    ? allProducts.filter((p) => {
        const name = p.name.toLowerCase();
        const noToneName = removeVietnameseTones(p.name.toLowerCase());
        const q = query.toLowerCase();
        const noToneQ = removeVietnameseTones(query.toLowerCase());
        return (
          name.includes(q) ||
          noToneName.includes(q) ||
          name.includes(noToneQ) ||
          noToneName.includes(noToneQ)
        );
      })
    : [];

  // ✅ Submit tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearching(true);
      setSuggestions([]);
    }
  };

  const goHome = () => {
    setQuery("");
    setSearching(false);
    setSuggestions([]);
  };

  // ✅ Gợi ý
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val) {
      setSearching(false);
      setSuggestions([]);
      return;
    }

    const noToneVal = removeVietnameseTones(val.toLowerCase());
    const sug = allProducts
      .filter((p) =>
        removeVietnameseTones(p.name.toLowerCase()).includes(noToneVal)
      )
      .slice(0, 5);
    setSuggestions(sug);
  };

  const handleSelectSuggestion = (name) => {
    setQuery(name);
    setSuggestions([]);
    setSearching(true);
  };

  return (
    <div
      style={{
        fontFamily: "Montserrat, Arial, sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          height: 400,
          position: "relative",
          textAlign: "center",
          color: "#fff",
          background: "url('http://127.0.0.1:8000/assets/images/banner.webp') center/cover no-repeat",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              marginBottom: 12,
              textShadow: "0 3px 8px rgba(0,0,0,0.6)",
              color: "#ff9800",
            }}
          >
            MotoBikeStore 🏍️🛵
          </h1>
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            }}
          >
            Đa dạng mẫu mã – Chất lượng hàng đầu – Giá cả hợp lý
          </p>
        </div>
      </section>

      {/* Ô tìm kiếm */}
      <section style={{ margin: "20px auto", maxWidth: 700, position: "relative" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="🔍 Tìm kiếm xe máy..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #bbb",
              fontSize: 16,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tìm
          </button>
          {searching && (
            <button
              type="button"
              onClick={goHome}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              🏠 Trang chủ
            </button>
          )}
        </form>

        {suggestions.length > 0 && !searching && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              marginTop: 4,
              zIndex: 50,
              listStyle: "none",
              padding: 0,
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSelectSuggestion(s.name)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Kết quả tìm kiếm */}
      {searching && query && !loading && !error && (
        <section style={{ margin: "20px auto", maxWidth: 1000 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, color: "#1976d2", textAlign: "center" }}>
            Kết quả tìm kiếm
          </h2>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} p={{ ...p, image: p.image_url || PLACEHOLDER }} />
              ))
            ) : (
              <p style={{ color: "#666" }}>Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        </section>
      )}

      {/* Danh mục */}
      {!searching && (
        <section style={{ margin: "40px 0" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20, color: "#1976d2", textAlign: "center" }}>
            Danh mục nổi bật
          </h2>
          {categories.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>Chưa có danh mục.</p>
          ) : (
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(`/category/${c.id}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                    padding: "16px",
                    minWidth: 180,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#1976d2",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    />
                  </div>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trạng thái */}
      {loading && <p style={{ textAlign: "center", color: "#1976d2" }}>Đang tải dữ liệu...</p>}
      {error && <p style={{ textAlign: "center", color: "#d32f2f" }}>{error}</p>}

      {/* Sản phẩm */}
      {!loading && !error && !searching && (
        <>
          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: "#388e3c", textAlign: "center" }}>
              Sản phẩm mới 🚀
            </h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {newItems.map((p) => (
                <ProductCard key={p.id} p={{ ...p, image: p.image_url || PLACEHOLDER }} />
              ))}
            </div>
          </section>

          <section style={{ margin: "40px 0" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: "#ff5722", textAlign: "center" }}>
              Đang giảm giá 🔥
            </h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
              {saleItems.map((p) => (
                <ProductCard key={p.id} p={{ ...p, image: p.image_url || PLACEHOLDER }} />
              ))}
            </div>
          </section>

          {/* ✅ Nút xem tất cả sản phẩm */}
          <div style={{ textAlign: "center", margin: "20px 0 40px" }}>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                transition: "all .2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#125a9c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1976d2")}
            >
              Xem tất cả sản phẩm ➝
            </button>
          </div>
        </>
      )}

      {/* About */}
      {!searching && (
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            padding: "32px 24px",
            margin: "40px auto 24px",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#1976d2" }}>
            Về chúng tôi
          </h2>
          <p style={{ color: "#444", fontSize: 16, lineHeight: 1.6 }}>
            <b>MotoBikeStore</b> cam kết mang đến cho khách hàng những chiếc xe máy chất lượng cao, 
            đa dạng về mẫu mã và giá cả hợp lý. Với đội ngũ nhân viên tận tâm và chuyên nghiệp, 
            chúng tôi luôn đồng hành cùng bạn để chọn được chiếc xe phù hợp nhất.
          </p>
        </section>
      )}
    </div>
  );
}
