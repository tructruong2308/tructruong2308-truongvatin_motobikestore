// src/pages/Customers/Login.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/"; // nơi cần quay lại sau login

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage("❌ " + (data.message || "Đăng nhập thất bại"));
        console.error("Login error:", data);
      } else {
        // Lưu user & token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setMessage("✅ Đăng nhập thành công!");
        // Nếu Header đang đọc user từ localStorage, reload để cập nhật menu
        setTimeout(() => {
          navigate(from, { replace: true });
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 18,
            color: "#1d4ed8",
            fontWeight: 700,
          }}
        >
          Đăng nhập
        </h2>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginBottom: 12,
              color: message.startsWith("✅") ? "#16a34a" : "#dc2626",
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <label style={{ display: "block", marginBottom: 6 }}>Mật khẩu</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background:
                "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(29,78,216,1) 100%)",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 14 }}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: "#1d4ed8" }}>
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
