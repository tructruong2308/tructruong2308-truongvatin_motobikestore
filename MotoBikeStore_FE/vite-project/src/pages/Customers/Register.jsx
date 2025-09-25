import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 201) {
        setMessage("✅ Đăng ký thành công!");
        setForm({ name: "", email: "", password: "", phone: "" });
      } else {
        setMessage("❌ " + (data.message || JSON.stringify(data)));
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối: " + err.message);
    }
  };

  // CSS style object
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
      boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      color: "#1d4ed8",
      marginBottom: "1.5rem",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "8px",
      marginBottom: "16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "border 0.2s",
    },
    button: {
      width: "100%",
      background: "#2563eb",
      color: "white",
      fontWeight: "bold",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s",
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
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
