import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  return (
    <div
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Logo */}
      <strong style={{ fontSize: 20, color: "#0f62fe" }}>⚡ Admin Panel</strong>

      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        
      

        {/* Hiển thị user */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#444" }}>
              👋 Xin chào, <b>{user.name}</b>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: "#e63946",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                transition: "0.2s",
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#0f62fe",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
          }}
        >
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
      </div>
    </div>
  );
}
