import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const [auth, setAuth] = useState({ checked: false, allow: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
      // chưa đăng nhập
      setAuth({ checked: true, allow: false });
    } else {
      // chỉ cho phép admin
      if (user.roles === "admin") {
        setAuth({ checked: true, allow: true });
      } else {
        setAuth({ checked: true, allow: false });
      }
    }
  }, []);

  if (!auth.checked) {
    return <div className="p-6">⏳ Đang kiểm tra quyền truy cập...</div>;
  }

  if (!auth.allow) {
    // Nếu không phải admin → quay về trang login admin
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "260px 1fr", gridTemplateRows: "64px 1fr" }}>
      {/* Sidebar */}
      <div className="bg-gray-900 text-white p-4">Sidebar Admin</div>
      {/* Header */}
      <div className="col-span-2 bg-gray-100 p-4">Header Admin</div>
      {/* Nội dung */}
      <main className="col-span-2 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
