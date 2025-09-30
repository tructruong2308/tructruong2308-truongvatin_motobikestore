import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "", // 👈 thêm username
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username, // 👈 gửi username
          password: form.password,
          phone: form.phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage("❌ " + (data.message || JSON.stringify(data)));
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối: " + err.message);
    }
  };

  // ---- CSS ----
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
      fontFamily: "Arial, sans-serif",
    },
    box: {
      background: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#1d4ed8",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "14px",
      outline: "none",
    },
    inputGroup: { position: "relative", marginBottom: "16px" },
    toggleBtn: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
      color: "#fff",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
    },
    message: {
      padding: "10px",
      marginBottom: "1rem",
      borderRadius: "8px",
      fontSize: "14px",
    },
    success: {
      background: "#d1fae5",
      color: "#065f46",
      border: "1px solid #6ee7b7",
    },
    error: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Đăng ký tài khoản</h2>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.includes("✅") ? styles.success : styles.error),
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <span
              style={styles.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.inputGroup}>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <span
              style={styles.toggleBtn}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
